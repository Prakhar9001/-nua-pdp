import { useContext } from 'react';
import { CartContext, type CartContextType } from '../stores/CartContext';

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
