import { useState, useEffect } from 'react';
import styles from './ImageGallery.module.scss';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first image when the image set changes (colour switch)
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  return (
    <div className={styles.gallery}>
      <div className={styles.gallery__primary}>
        <img
          src={images[activeIndex]}
          alt={productName}
          fetchPriority="high"
        />
      </div>

      <div className={styles.gallery__thumbnails}>
        {images.map((src, i) => (
          <button
            key={src}
            className={`${styles.gallery__thumb} ${i === activeIndex ? styles['gallery__thumb--active'] : ''}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`View image ${i + 1}`}
            aria-pressed={i === activeIndex}
          >
            <img src={src} alt={`${productName} view ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      <div className={styles.gallery__dots} aria-hidden="true">
        {images.map((_, i) => (
          <span
            key={i}
            className={`${styles.gallery__dot} ${i === activeIndex ? styles['gallery__dot--active'] : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
