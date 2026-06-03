import { useCart } from '../../hooks/useCart';
import styles from './Header.module.scss';

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.5 8V6a3.5 3.5 0 0 1 7 0v2M3 8h14l-1.5 9H4.5L3 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const { totalItems } = useCart();
  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <img
          src="/nua-logo.webp"
          alt="Nua"
          className={styles.header__logo}
        />
        <button
          className={styles.header__cart}
          aria-label={`Bag — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          title={totalItems > 0 ? `${totalItems} item${totalItems !== 1 ? 's' : ''} in bag` : 'Bag is empty'}
        >
          <BagIcon />
          {totalItems > 0 && (
            <span className={styles['header__cart-badge']}>{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}
