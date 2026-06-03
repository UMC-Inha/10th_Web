import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItemType } from '../constants/cartItems';

type CartStore = {
  cartItems: CartItemType[];
  amount: number;
  total: number;
  isOpen: boolean;

  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  openModal: () => void;
  closeModal: () => void;
};

const calculateCartTotals = (items: CartItemType[]) => {
  let amount = 0;
  let total = 0;

  items.forEach((item) => {
    amount += item.amount;
    total += Number(item.price) * item.amount;
  });

  return { amount, total };
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  increase: (id) =>
    set((state) => {
      const updatedItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      );

      const { amount, total } = calculateCartTotals(updatedItems);

      return {
        cartItems: updatedItems,
        amount,
        total,
      };
    }),

  decrease: (id) =>
    set((state) => {
      const updatedItems = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount >= 1);

      const { amount, total } = calculateCartTotals(updatedItems);

      return {
        cartItems: updatedItems,
        amount,
        total,
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const updatedItems = state.cartItems.filter((item) => item.id !== id);

      const { amount, total } = calculateCartTotals(updatedItems);

      return {
        cartItems: updatedItems,
        amount,
        total,
      };
    }),

  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  calculateTotals: () =>
    set((state) => {
      const { amount, total } = calculateCartTotals(state.cartItems);

      return {
        amount,
        total,
      };
    }),

  openModal: () =>
    set({
      isOpen: true,
    }),

  closeModal: () =>
    set({
      isOpen: false,
    }),
}));
