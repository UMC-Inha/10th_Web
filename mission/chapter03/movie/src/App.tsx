import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import RootLayout from "./layout/RootLayout";
import MovieDetailPage from "./pages/MovieDetailPage";
import NotFound from "./pages/NotFound";

// 경로와 해당 경로에서 보여줄 컴포넌트를 설정하는 라우터를 생성
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // Navbar 아래에 렌더링할 하위 라우트 설정
    children: [
      {
        // index: true → 부모의 기본 경로('/')일 때
        index: true,
        element: <HomePage />,
      },
      {
        path: "movies/:categoryId",
        element: <MoviesPage />,
      },
      {
        path: "movies/:categoryId/:movieId",
        element: <MovieDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// RouterProvider로 router 전달
function App() {
  return <RouterProvider router={router} />;
}

export default App;
