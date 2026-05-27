export type CartItem = {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
};

export type CartState = {
  cartItems: CartItem[];
  amount: number;
  total: number;
};
