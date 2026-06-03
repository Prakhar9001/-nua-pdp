import type { ReactNode } from 'react';
import styles from './ProductDetails.module.scss';

interface AccordionPanelProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function AccordionPanel({ id, title, isOpen, onToggle, children }: AccordionPanelProps) {
  const bodyId = `accordion-body-${id}`;

  return (
    <div className={styles.accordion__item}>
      <button
        className={styles.accordion__trigger}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={bodyId}
      >
        <span className={styles.accordion__title}>{title}</span>
        <svg
          className={`${styles.accordion__icon} ${isOpen ? styles['accordion__icon--open'] : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        id={bodyId}
        className={`${styles.accordion__body} ${isOpen ? styles['accordion__body--open'] : ''}`}
        role="region"
        aria-labelledby={`accordion-trigger-${id}`}
      >
        <div className={styles.accordion__content}>{children}</div>
      </div>
    </div>
  );
}
