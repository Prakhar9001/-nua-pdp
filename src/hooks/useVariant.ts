import { useState, useEffect, useCallback } from 'react';
import type { ProductVariant } from '../types';

function getUrlParams(): { colour: string | null; size: string | null } {
  const params = new URLSearchParams(window.location.search);
  return {
    colour: params.get('colour'),
    size: params.get('size'),
  };
}

function pushUrlParams(colour: string, size: string) {
  const params = new URLSearchParams(window.location.search);
  params.set('colour', colour);
  params.set('size', size);
  window.history.replaceState(null, '', `?${params.toString()}`);
}

function firstInStock(variants: ProductVariant[]): ProductVariant | undefined {
  return variants.find((v) => v.stock > 0);
}

function resolveInitialVariant(variants: ProductVariant[]): ProductVariant {
  const { colour, size } = getUrlParams();
  const matched = variants.find(
    (v) => v.colour === colour && v.size === size && v.stock > 0
  );
  if (matched) return matched;

  const fallback = firstInStock(variants) ?? variants[0];
  pushUrlParams(fallback.colour, fallback.size);
  return fallback;
}

export function useVariant(variants: ProductVariant[]) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Initialise once variants are available — product loads async so first render
  // always has an empty array; useState initializer would produce undefined.
  useEffect(() => {
    if (variants.length === 0 || selectedVariant !== null) return;
    setSelectedVariant(resolveInitialVariant(variants));
  }, [variants, selectedVariant]);

  const setColour = useCallback(
    (colour: string) => {
      if (!selectedVariant) return;
      const sameSize = variants.find(
        (v) => v.colour === colour && v.size === selectedVariant.size && v.stock > 0
      );
      const anyInStock = variants.find((v) => v.colour === colour && v.stock > 0);
      const next =
        sameSize ??
        anyInStock ??
        variants.find((v) => v.colour === colour) ??
        selectedVariant;
      pushUrlParams(next.colour, next.size);
      setSelectedVariant(next);
    },
    [variants, selectedVariant]
  );

  const setSize = useCallback(
    (size: string) => {
      if (!selectedVariant) return;
      const next =
        variants.find((v) => v.colour === selectedVariant.colour && v.size === size) ??
        selectedVariant;
      pushUrlParams(next.colour, next.size);
      setSelectedVariant(next);
    },
    [variants, selectedVariant]
  );

  return { selectedVariant, setColour, setSize };
}
