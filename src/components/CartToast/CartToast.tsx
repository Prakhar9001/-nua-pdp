import { useEffect } from 'react';
import styles from './CartToast.module.scss';

interface CartToastProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}

export function CartToast({ visible, type, message, onDismiss }: CartToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  return (
    <div
      className={`${styles.toast} ${styles[`toast--${type}`]} ${visible ? styles['toast--visible'] : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
