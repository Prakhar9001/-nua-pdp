import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddToCartButton } from '../src/components/AddToCartButton/AddToCartButton';
import { CartProvider } from '../src/stores/CartContext';
import type { Product, ProductVariant } from '../src/types';

// vi.mock is hoisted above imports, so AddToCartButton.tsx receives the mocked module
vi.mock('../src/api/mockCart', () => ({
  mockAddToCart: vi.fn(),
}));

import { mockAddToCart } from '../src/api/mockCart';
const mockFn = mockAddToCart as ReturnType<typeof vi.fn>;

const product: Product = {
  id: 'p1',
  name: 'Nua Soft Cup',
  brand: 'Nua',
  description: 'Comfortable period underwear',
  images: ['https://example.com/img.jpg'],
  specifications: [],
  variants: [],
  deliveryEstimate: '2-3 days',
};

const availableVariant: ProductVariant = {
  id: 'v1',
  colour: 'Rose Pink',
  colourHex: '#F4C0D1',
  size: 'Regular',
  stock: 8,
  price: 299,
};

const soldOutVariant: ProductVariant = {
  ...availableVariant,
  id: 'v2',
  stock: 0,
};

function renderButton(
  variant: ProductVariant,
  opts: { onSuccess?: () => void; onError?: () => void } = {}
) {
  return render(
    <CartProvider>
      <AddToCartButton
        product={product}
        selectedVariant={variant}
        quantity={1}
        onSuccess={opts.onSuccess ?? vi.fn()}
        onError={opts.onError ?? vi.fn()}
      />
    </CartProvider>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  // Default: resolves immediately
  mockFn.mockResolvedValue(undefined);
});

describe('AddToCartButton — sold-out state', () => {
  it('renders "Sold Out" and is disabled when stock is 0', () => {
    renderButton(soldOutVariant);
    const btn = screen.getByRole('button', { name: /sold out/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Sold Out');
  });

  it('does not call the API when clicked in sold-out state', () => {
    renderButton(soldOutVariant);
    fireEvent.click(screen.getByRole('button', { name: /sold out/i }));
    expect(mockFn).not.toHaveBeenCalled();
  });
});

describe('AddToCartButton — loading state', () => {
  it('shows "Adding…" and disables the button while the API is in-flight', async () => {
    mockFn.mockReturnValue(new Promise(() => {})); // never resolves
    renderButton(availableVariant);
    fireEvent.click(screen.getByRole('button', { name: /add to bag/i }));
    const btn = await screen.findByRole('button', { name: /adding to bag/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Adding…');
  });
});

describe('AddToCartButton — success path', () => {
  it('calls onSuccess and resets to "Add to Bag" after a successful call', async () => {
    const onSuccess = vi.fn();
    renderButton(availableVariant, { onSuccess });
    fireEvent.click(screen.getByRole('button', { name: /add to bag/i }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button')).toHaveTextContent('Add to Bag');
  });
});

describe('AddToCartButton — failure path', () => {
  it('shows "Try Again" and an error alert when the API rejects', async () => {
    mockFn.mockRejectedValue(new Error('Network error — please try again'));
    const onError = vi.fn();
    renderButton(availableVariant, { onError });
    fireEvent.click(screen.getByRole('button', { name: /add to bag/i }));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button')).toHaveTextContent('Try Again');
    expect(screen.getByRole('alert')).toHaveTextContent(/network error/i);
  });

  it('clears the error and succeeds on a retry after a failed attempt', async () => {
    mockFn
      .mockRejectedValueOnce(new Error('Network error — please try again'))
      .mockResolvedValueOnce(undefined);
    const onSuccess = vi.fn();
    renderButton(availableVariant, { onSuccess });

    fireEvent.click(screen.getByRole('button', { name: /add to bag/i }));
    // Wait for error state
    await waitFor(() => screen.getByRole('alert'));

    // Click the "Try Again" button (use role + name to disambiguate from the error text)
    fireEvent.click(screen.getByRole('button', { name: /add to bag/i }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button')).toHaveTextContent('Add to Bag');
  });
});
