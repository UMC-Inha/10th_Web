import { useEffect } from 'react';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import { useCartStore } from './store/useCartStore';

function App() {
  const cartItems = useCartStore((state) => state.cartItems);
  const calculateTotals = useCartStore((state) => state.calculateTotals);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <>
      <Navbar />
      <CartContainer />
    </>
  );
}

export default App;