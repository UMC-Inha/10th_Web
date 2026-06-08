import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import cartItems, { type ICartItem } from '../constants/cartItems';

interface IUnifiedState {
  // 장바구니 상태
  cartItems: ICartItem[];
  amount: number;
  total: number;
  
  // 모달 상태
  isModalOpen: boolean;

  // 장바구니 액션
  clearCart: () => void;
  removeItem: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  calculateTotals: () => void;

  // 모달 액션
  openModal: () => void;
  closeModal: () => void;
}

const useStore = create<IUnifiedState>()(
  immer((set) => ({
    cartItems: cartItems,
    amount: 0,
    total: 0,
    isModalOpen: false,

    clearCart: () =>
      set((state) => {
        state.cartItems = [];
        state.amount = 0;
        state.total = 0;
      }),

    removeItem: (id) =>
      set((state) => {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      }),

    increase: (id) =>
      set((state) => {
        const item = state.cartItems.find((item) => item.id === id);
        if (item) item.amount += 1;
      }),

    decrease: (id) =>
      set((state) => {
        const item = state.cartItems.find((item) => item.id === id);
        if (item) {
          item.amount -= 1;
          if (item.amount < 1) {
            state.cartItems = state.cartItems.filter((item) => item.id !== id);
          }
        }
      }),

    calculateTotals: () =>
      set((state) => {
        let totalAmount = 0;
        let totalPrice = 0;

        state.cartItems.forEach((item) => {
          totalAmount += item.amount;
          totalPrice += item.amount * parseInt(item.price, 10);
        });

        state.amount = totalAmount;
        state.total = totalPrice;
      }),

    openModal: () =>
      set((state) => {
        state.isModalOpen = true;
      }),

    closeModal: () =>
      set((state) => {
        state.isModalOpen = false;
      }),
  }))
);

export default useStore;