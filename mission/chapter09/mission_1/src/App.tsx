import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import { calculateTotals } from './store/cartSlice';
import type { RootState } from './store/store';

function App() {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <>
      <Navbar />
      <CartContainer />
    </>
  );
}

export default App;