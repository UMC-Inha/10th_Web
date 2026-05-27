import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import cartItems from '../constants/cartItems';

type CartStore = {
  cartItems: CartItem[];
  amount: number;
  total: number;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems,
  amount: cartItems.reduce((sum, item) => sum + item.amount, 0),
  total: cartItems.reduce((sum, item) => sum + Number(item.price) * item.amount, 0),

  increase: (id) =>
    set((state) => {
      const updated = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      );
      return { cartItems: updated };
    }),

  decrease: (id) =>
    set((state) => {
      const target = state.cartItems.find((item) => item.id === id);
      if (!target) return state;
      const updated =
        target.amount - 1 < 1
          ? state.cartItems.filter((item) => item.id !== id)
          : state.cartItems.map((item) =>
              item.id === id ? { ...item, amount: item.amount - 1 } : item,
            );
      return { cartItems: updated };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () =>
    set((state) => ({
      amount: state.cartItems.reduce((sum, item) => sum + item.amount, 0),
      total: state.cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.amount,
        0,
      ),
    })),
}));
