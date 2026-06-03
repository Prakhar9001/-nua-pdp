import type { ProductVariant } from '../../types';
import styles from './VariantSelector.module.scss';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onColourChange: (colour: string) => void;
  onSizeChange: (size: string) => void;
}

function getStockState(stock: number): 'sold-out' | 'low-stock' | 'available' {
  if (stock === 0) return 'sold-out';
  if (stock <= 2) return 'low-stock';
  return 'available';
}

export function VariantSelector({
  variants,
  selectedVariant,
  onColourChange,
  onSizeChange,
}: VariantSelectorProps) {
  const uniqueColours = Array.from(
    new Map(variants.map((v) => [v.colour, { colour: v.colour, colourHex: v.colourHex }])).values()
  );

  const sizesForColour = variants.filter((v) => v.colour === selectedVariant.colour);

  const lowStockVariant = sizesForColour.find(
    (v) => v.size === selectedVariant.size && getStockState(v.stock) === 'low-stock'
  );

  return (
    <div className={styles['variant-selector']}>
      <div className={styles['variant-selector__section']}>
        <span className={styles['variant-selector__label']}>
          Colour: <strong>{selectedVariant.colour}</strong>
        </span>
        <div className={styles['variant-selector__swatches']}>
          {uniqueColours.map(({ colour, colourHex }) => (
            <button
              key={colour}
              className={`${styles['variant-selector__swatch']} ${
                colour === selectedVariant.colour
                  ? styles['variant-selector__swatch--active']
                  : ''
              }`}
              style={{ backgroundColor: colourHex }}
              onClick={() => onColourChange(colour)}
              aria-label={colour}
              aria-pressed={colour === selectedVariant.colour}
              title={colour}
            />
          ))}
        </div>
      </div>

      <div className={styles['variant-selector__section']}>
        <span className={styles['variant-selector__label']}>Size</span>
        <div className={styles['variant-selector__sizes']}>
          {sizesForColour.map((v) => {
            const state = getStockState(v.stock);
            return (
              <button
                key={v.id}
                className={[
                  styles['variant-selector__size-btn'],
                  state === 'sold-out' ? styles['variant-selector__size-btn--sold-out'] : '',
                  state === 'low-stock' ? styles['variant-selector__size-btn--low-stock'] : '',
                  v.size === selectedVariant.size ? styles['variant-selector__size-btn--active'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => state !== 'sold-out' && onSizeChange(v.size)}
                disabled={state === 'sold-out'}
                aria-pressed={v.size === selectedVariant.size}
                aria-label={`${v.size}${state === 'sold-out' ? ' — sold out' : ''}`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
        {lowStockVariant && (
          <p className={styles['variant-selector__low-stock-label']}>
            Only {lowStockVariant.stock} left
          </p>
        )}
      </div>
    </div>
  );
}
