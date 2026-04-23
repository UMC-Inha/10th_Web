import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">
            홈 화면
          </div>
        ),
      },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;