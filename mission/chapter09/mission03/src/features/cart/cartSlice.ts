import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItems, { type ICartItem } from '../../constants/cartItems';

// 스토어 전역 상태 인터페이스 정의
interface ICartState {
  cartItems: ICartItem[];
  amount: number;
  total: number;
}

const initialState: ICartState = {
  cartItems: cartItems, // 초기값으로 Mock 데이터 주입
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, action: PayloadAction<string>) => {
      const cartItem = state.cartItems.find((item) => item.id === action.payload);
      if (cartItem) {
        cartItem.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const cartItem = state.cartItems.find((item) => item.id === action.payload);
      if (cartItem) {
        cartItem.amount -= 1;
        if (cartItem.amount < 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        }
      }
    },
    calculateTotals: (state) => {
      let totalAmount = 0;
      let totalPrice = 0;

      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += item.amount * parseInt(item.price, 10);
      });

      state.amount = totalAmount;
      state.total = totalPrice;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;