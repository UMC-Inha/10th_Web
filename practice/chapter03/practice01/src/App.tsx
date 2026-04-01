import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import RootLayout from "./layout/RootLayout";

const NotFound = () => (
  <main style={{ padding: 24 }}>
    <h1>페이지를 찾을 수 없어요 (404)</h1>
    <p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
    <a href="/">홈으로</a>
  </main>
);
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
        path: "movies",
        element: <MoviesPage />,
      },
      {
        // 부모가 '/'이므로, 'movies'만 써도 '/movies'로 매칭
        // :movieId 부분은 동적 경로 매개변수
        path: "movies/:movieId",
        element: <MoviesPage />,
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
