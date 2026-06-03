import { useState, useEffect, useCallback } from 'react';
import { useProduct } from './hooks/useProduct';
import { useVariant } from './hooks/useVariant';
import { colourImages } from './data/mockProduct';
import { Header } from './components/Header/Header';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { ProductInfo } from './components/ProductInfo/ProductInfo';
import { ProductDetails } from './components/ProductDetails/ProductDetails';
import { CartToast } from './components/CartToast/CartToast';
import styles from './App.module.scss';

interface ToastState {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
}

function App() {
  const { product, error } = useProduct();
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'success',
    message: '',
  });

  const variants = product?.variants ?? [];
  const { selectedVariant, setColour, setSize } = useVariant(variants);

  useEffect(() => {
    if (selectedVariant && quantity > selectedVariant.stock) {
      setQuantity(Math.max(1, selectedVariant.stock));
    }
  }, [selectedVariant, quantity]);

  const handleCartSuccess = useCallback(() => {
    setToast({ visible: true, type: 'success', message: 'Added to bag ✓' });
  }, []);

  const handleCartError = useCallback(() => {
    setToast({ visible: true, type: 'error', message: 'Something went wrong — try again' });
  }, []);

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  if (!selectedVariant) return <div className={styles.state}>Loading…</div>;
  if (error || !product) return <div className={styles.state}>Something went wrong.</div>;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.pdp}>
        <div className={styles.pdp__gallery}>
          <ImageGallery
            images={colourImages[selectedVariant.colour] ?? product.images}
            productName={product.name}
          />
        </div>

        <div className={styles.pdp__info}>
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            quantity={quantity}
            onColourChange={setColour}
            onSizeChange={setSize}
            onQuantityChange={setQuantity}
            onCartSuccess={handleCartSuccess}
            onCartError={handleCartError}
          />
        </div>

        <div className={styles.pdp__details}>
          <ProductDetails product={product} />
        </div>
      </main>

      <CartToast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onDismiss={dismissToast}
      />
    </div>
  );
}

export default App;
