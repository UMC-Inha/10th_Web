import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import cartItems from '../constants/cartItems';

type CartStore = {
  cartItems: CartItem[];
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems,

  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) => (item.id === id ? { ...item, amount: item.amount - 1 } : item))
        .filter((item) => item.amount >= 1),
    })),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cartItems: [] }),
}));

export const useCartTotals = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const amount = cartItems.reduce((sum, item) => sum + item.amount, 0);
  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.amount, 0);
  return { amount, total };
};
