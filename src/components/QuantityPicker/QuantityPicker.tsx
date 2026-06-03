import styles from './QuantityPicker.module.scss';

interface QuantityPickerProps {
  quantity: number;
  maxStock: number;
  onChange: (qty: number) => void;
}

export function QuantityPicker({ quantity, maxStock, onChange }: QuantityPickerProps) {
  return (
    <div className={styles['quantity-picker']}>
      <button
        className={styles['quantity-picker__btn']}
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles['quantity-picker__value']} aria-live="polite">
        {quantity}
      </span>
      <button
        className={styles['quantity-picker__btn']}
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= maxStock}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
