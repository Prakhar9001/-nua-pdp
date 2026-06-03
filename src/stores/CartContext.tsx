import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types';

const STORAGE_KEY = 'nua_cart';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem };

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  totalItems: number;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.variantId === action.payload.variantId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantId === action.payload.variantId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }

    default:
      return state;
  }
}

function readFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({
    items: readFromStorage(),
  }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}
