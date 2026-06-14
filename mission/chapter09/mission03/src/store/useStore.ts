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
        const index = state.cartItems.findIndex((item)=> item.id === id);
        if (index !== -1) {
          state.cartItems.splice(index, 1);
        }
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
            const index = state.cartItems.findIndex((target)=> target.id === id);
            if (index !== -1) {
              state.cartItems.splice(index, 1);
            }
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

      // Boolean 변경은 객체 set 방식으로 분리하여 오버헤드 방지
      openModal: () => set({isModalOpen: true}),
      closeModal: () => set({isModalOpen: false}),
  }))
);

export default useStore;