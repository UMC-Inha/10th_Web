import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import InfinitePostsJsonPlaceholder from './components/InfinitePostsJsonPlaceholder';
import { QueryClientProvider, QueryClient} from '@tanstack/react-query';
import InfinitePostsAutoJsonPlaceholder from './components/InfinitePostsAutoJsonPlaceholder';
import Home from './components/Home';
import Layout from './layouts/Layout';

const queryClient = new QueryClient();

// Layout 대신 간단한 div를 넣어보세요.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {index:true, element:<Home/>},
      {path: "button", element: <InfinitePostsJsonPlaceholder/>},
      {path: "auto", element: <InfinitePostsAutoJsonPlaceholder/>}
    ]
  },
]);

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;