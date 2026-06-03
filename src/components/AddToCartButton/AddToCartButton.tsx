import { useState } from 'react';
import type { Product, ProductVariant } from '../../types';
import { useCart } from '../../hooks/useCart';
import { mockAddToCart } from '../../api/mockCart';
import styles from './AddToCartButton.module.scss';

interface AddToCartButtonProps {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  onSuccess: () => void;
  onError: () => void;
}

export function AddToCartButton({
  product,
  selectedVariant,
  quantity,
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soldOut = selectedVariant.stock === 0;

  async function handleClick() {
    if (loading || soldOut) return;
    setLoading(true);
    setError(null);
    try {
      await mockAddToCart();
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        colour: selectedVariant.colour,
        size: selectedVariant.size,
        quantity,
        price: selectedVariant.price,
        image: product.images[0],
      });
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      onError();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles['add-to-cart__wrapper']}>
      <button
        className={[
          styles['add-to-cart'],
          loading ? styles['add-to-cart--loading'] : '',
          error ? styles['add-to-cart--error'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={handleClick}
        disabled={soldOut || loading}
        aria-busy={loading}
        aria-label={soldOut ? 'Sold out' : loading ? 'Adding to bag' : 'Add to bag'}
      >
        {soldOut ? 'Sold Out' : loading ? 'Adding…' : error ? 'Try Again' : 'Add to Bag'}
      </button>
      {error && (
        <p className={styles['add-to-cart__error-msg']} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
