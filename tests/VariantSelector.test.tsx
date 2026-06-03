import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VariantSelector } from '../src/components/VariantSelector/VariantSelector';
import { QuantityPicker } from '../src/components/QuantityPicker/QuantityPicker';
import type { ProductVariant } from '../src/types';

const variants: ProductVariant[] = [
  { id: 'v1', colour: 'Rose Pink',     colourHex: '#F4C0D1', size: 'Regular', stock: 8,  price: 299 },
  { id: 'v2', colour: 'Rose Pink',     colourHex: '#F4C0D1', size: 'XL',      stock: 2,  price: 299 },
  { id: 'v3', colour: 'Rose Pink',     colourHex: '#F4C0D1', size: 'XL+',     stock: 0,  price: 329 },
  { id: 'v4', colour: 'Midnight Teal', colourHex: '#5DCAA5', size: 'Regular', stock: 12, price: 299 },
];

describe('VariantSelector', () => {
  it('disables the size button when stock is 0 (sold out)', () => {
    render(
      <VariantSelector
        variants={variants}
        selectedVariant={variants[0]}
        onColourChange={vi.fn()}
        onSizeChange={vi.fn()}
      />
    );

    const soldOutBtn = screen.getByRole('button', { name: /XL\+.*sold out/i });
    expect(soldOutBtn).toBeDisabled();
  });

  it('shows "Only N left" label when selected size has low stock (1–2 units)', () => {
    // v2: Rose Pink XL, stock=2
    render(
      <VariantSelector
        variants={variants}
        selectedVariant={variants[1]}
        onColourChange={vi.fn()}
        onSizeChange={vi.fn()}
      />
    );

    expect(screen.getByText(/only 2 left/i)).toBeInTheDocument();
  });

  it('does not show low-stock label when selected size has ample stock', () => {
    render(
      <VariantSelector
        variants={variants}
        selectedVariant={variants[0]}
        onColourChange={vi.fn()}
        onSizeChange={vi.fn()}
      />
    );

    expect(screen.queryByText(/only \d+ left/i)).not.toBeInTheDocument();
  });

  it('calls onSizeChange with the correct size when an available button is clicked', () => {
    const onSizeChange = vi.fn();
    render(
      <VariantSelector
        variants={variants}
        selectedVariant={variants[0]}
        onColourChange={vi.fn()}
        onSizeChange={onSizeChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^XL$/i }));
    expect(onSizeChange).toHaveBeenCalledWith('XL');
  });

  it('does not call onSizeChange when a sold-out button is clicked', () => {
    const onSizeChange = vi.fn();
    render(
      <VariantSelector
        variants={variants}
        selectedVariant={variants[0]}
        onColourChange={vi.fn()}
        onSizeChange={onSizeChange}
      />
    );

    const soldOutBtn = screen.getByRole('button', { name: /XL\+.*sold out/i });
    fireEvent.click(soldOutBtn);
    expect(onSizeChange).not.toHaveBeenCalled();
  });
});

describe('QuantityPicker — stock cap', () => {
  it('disables the plus button when quantity equals maxStock', () => {
    render(<QuantityPicker quantity={3} maxStock={3} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled();
  });

  it('disables the minus button when quantity is 1', () => {
    render(<QuantityPicker quantity={1} maxStock={5} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /decrease/i })).toBeDisabled();
  });

  it('calls onChange with quantity + 1 when plus is clicked', () => {
    const onChange = vi.fn();
    render(<QuantityPicker quantity={2} maxStock={5} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with quantity - 1 when minus is clicked', () => {
    const onChange = vi.fn();
    render(<QuantityPicker quantity={3} maxStock={5} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
