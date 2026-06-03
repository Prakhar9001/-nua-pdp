import { useState } from 'react';
import type { Product } from '../../types';
import { mockReviews } from '../../data/mockReviews';
import { AccordionPanel } from './AccordionPanel';
import { ReviewCard } from '../ReviewCard/ReviewCard';
import styles from './ProductDetails.module.scss';

interface ProductDetailsProps {
  product: Product;
}

type PanelId = 'description' | 'specifications' | 'reviews';

export function ProductDetails({ product }: ProductDetailsProps) {
  const [openPanel, setOpenPanel] = useState<PanelId>('description');

  function toggle(id: PanelId) {
    setOpenPanel((prev) => (prev === id ? ('' as PanelId) : id));
  }

  return (
    <div className={styles.accordion}>
      <AccordionPanel
        id="description"
        title="Description"
        isOpen={openPanel === 'description'}
        onToggle={() => toggle('description')}
      >
        <p className={styles.accordion__text}>{product.description}</p>
      </AccordionPanel>

      <AccordionPanel
        id="specifications"
        title="Specifications"
        isOpen={openPanel === 'specifications'}
        onToggle={() => toggle('specifications')}
      >
        <table className={styles.accordion__specs}>
          <tbody>
            {product.specifications.map(({ key, value }) => (
              <tr key={key}>
                <td className={styles['accordion__specs-key']}>{key}</td>
                <td className={styles['accordion__specs-value']}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionPanel>

      <AccordionPanel
        id="reviews"
        title={`Reviews (${mockReviews.length})`}
        isOpen={openPanel === 'reviews'}
        onToggle={() => toggle('reviews')}
      >
        <div className={styles.accordion__reviews}>
          {mockReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </AccordionPanel>
    </div>
  );
}
