import { useCartStore } from './store/useCartStore';
import { useModalStore } from './store/useModalStore';
import Navbar from './components/Navbar';
import CartItem from './components/CartItem';
import Footer from './components/Footer';
import Modal from './components/Modal';

function App() {
  const { cartItems } = useCartStore();
  const { isOpen } = useModalStore();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {isOpen && <Modal />}

      <Navbar />

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg">장바구니가 비어 있습니다.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
