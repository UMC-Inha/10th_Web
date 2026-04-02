import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import PopularPage from './pages/PopularPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <PopularPage /> }, 
      { path: 'popular', element: <PopularPage /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;