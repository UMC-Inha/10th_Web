import { BrowserRouter, Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import CartPage from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<CartPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
