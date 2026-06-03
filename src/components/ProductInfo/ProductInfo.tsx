import type { Product, ProductVariant } from '../../types';
import { VariantSelector } from '../VariantSelector/VariantSelector';
import { QuantityPicker } from '../QuantityPicker/QuantityPicker';
import { AddToCartButton } from '../AddToCartButton/AddToCartButton';
import styles from './ProductInfo.module.scss';

interface ProductInfoProps {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  onColourChange: (colour: string) => void;
  onSizeChange: (size: string) => void;
  onQuantityChange: (qty: number) => void;
  onCartSuccess: () => void;
  onCartError: () => void;
}

export function ProductInfo({
  product,
  selectedVariant,
  quantity,
  onColourChange,
  onSizeChange,
  onQuantityChange,
  onCartSuccess,
  onCartError,
}: ProductInfoProps) {
  const hasSale = selectedVariant.originalPrice !== undefined;
  const inStock = selectedVariant.stock > 0;

  return (
    <div className={styles['product-info']}>
      <p className={styles['product-info__brand']}>{product.brand}</p>
      <h1 className={styles['product-info__name']}>{product.name}</h1>

      <div className={styles['product-info__price']}>
        {hasSale && (
          <span className={styles['product-info__price--original']}>
            ₹{selectedVariant.originalPrice}
          </span>
        )}
        <span className={hasSale ? styles['product-info__price--sale'] : styles['product-info__price--regular']}>
          ₹{selectedVariant.price}
        </span>
      </div>

      <div className={styles['product-info__variants']}>
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onColourChange={onColourChange}
          onSizeChange={onSizeChange}
        />
      </div>

      <div className={styles['product-info__quantity']}>
        <span className={styles['product-info__quantity-label']}>Quantity</span>
        <QuantityPicker
          quantity={quantity}
          maxStock={selectedVariant.stock}
          onChange={onQuantityChange}
        />
      </div>

      <div className={styles['product-info__cta']}>
        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          onSuccess={onCartSuccess}
          onError={onCartError}
        />
      </div>

      {inStock && (
        <p className={styles['product-info__delivery']}>
          🚚 {product.deliveryEstimate}
        </p>
      )}
    </div>
  );
}
