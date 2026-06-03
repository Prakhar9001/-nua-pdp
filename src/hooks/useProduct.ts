import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { mockVariants, colourImages } from '../data/mockProduct';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const NUA_DESCRIPTION =
  "Designed for real days and real bodies. Our Ultra-Soft Period Underwear gives you up to 4-tampon worth of absorbency with zero bulk — so you can wear it alone or as backup, without thinking twice. The fabric is breathable, moisture-wicking, and gentle on skin. No more surprise leaks. Just comfort you can trust.";

const SPECIFICATIONS = [
  { key: 'Material',        value: '95% Cotton, 5% Elastane' },
  { key: 'Absorbency',      value: 'Up to 4 tampons worth' },
  { key: 'Care',            value: 'Machine wash cold, tumble dry low' },
  { key: 'Sizes available', value: 'XS, S, M, L, XL' },
  { key: 'Colours',         value: 'Light Pink, Lemon Green, Light Purple' },
  { key: 'Country of origin', value: 'India' },
];

function buildProduct(id: string): Product {
  return {
    id,
    name: 'Nua Ultra-Soft Period Underwear',
    brand: 'Nua',
    description: NUA_DESCRIPTION,
    images: colourImages['Light Pink'],
    specifications: SPECIFICATIONS,
    variants: mockVariants,
    deliveryEstimate: 'Delivered by Thu, 5 Jun',
  };
}

export function useProduct() {
  // Render immediately with mock data — no loading gate shown to the user.
  // The Fake Store API fetch runs in the background and patches in the real
  // product ID once it resolves; everything else is sourced from our mocks.
  const [product, setProduct] = useState<Product>(() => buildProduct('19'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('https://fakestoreapi.com/products/19')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<FakeStoreProduct>;
      })
      .then((data) => {
        if (!cancelled) setProduct(buildProduct(String(data.id)));
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load product');
      });

    return () => { cancelled = true; };
  }, []);

  return { product, error };
}
