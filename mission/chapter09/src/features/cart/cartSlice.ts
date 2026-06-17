import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';
import type { CartState } from '../../types/cart';

function computeTotals(items: CartState['cartItems']) {
  return {
    amount: items.reduce((sum, item) => sum + item.amount, 0),
    total: items.reduce((sum, item) => sum + item.amount * Number(item.price), 0),
  };
}

const initialTotals = computeTotals(cartItems);

const initialState: CartState = {
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(({ id }) => id === action.payload);
      if (item) {
        item.amount += 1;
      }
      const totals = computeTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(({ id }) => id === action.payload);
      if (!item) return;

      if (item.amount <= 1) {
        state.cartItems = state.cartItems.filter(({ id }) => id !== action.payload);
      } else {
        item.amount -= 1;
      }

      const totals = computeTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(({ id }) => id !== action.payload);
      const totals = computeTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      const totals = computeTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
