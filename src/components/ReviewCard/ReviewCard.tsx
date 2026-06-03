import type { Review } from '../../types';
import styles from './ReviewCard.module.scss';

interface ReviewCardProps {
  review: Review;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className={styles['review-card__stars']} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles['review-card__star--filled'] : styles['review-card__star--empty']}>
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className={styles['review-card']}>
      <div className={styles['review-card__header']}>
        <div className={styles['review-card__avatar']} aria-hidden="true">
          {getInitials(review.author)}
        </div>
        <div className={styles['review-card__meta']}>
          <span className={styles['review-card__author']}>{review.author}</span>
          <span className={styles['review-card__date']}>{review.date}</span>
        </div>
        {review.verified && (
          <span className={styles['review-card__verified']}>Verified Purchase</span>
        )}
      </div>
      <Stars rating={review.rating} />
      <p className={styles['review-card__body']}>{review.body}</p>
    </article>
  );
}
