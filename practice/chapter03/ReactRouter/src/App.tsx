import './App.css'

// 1. React Router에서 필요한 함수/컴포넌트를 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";



//만든 페이지 import
import HomePage from './pages/home';
import NotFound from './pages/not-found';
import Movies from './pages/movies';
import RootLayout from './layout/root-layout';

//경로(path)와 보여줄 화면(element)를 정의
const router = createBrowserRouter([
  {
    //라우터에 연결
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound/>,
    // Navbar 아래에 표시할 자식 라우트
    children: [
      {
        // index: true -> 부모의 기존 경로 ('/')일 때 렌더
        index: true,
        element: <HomePage />,
      },
      {
        // 부모가 '/'이므로, movies만 써도 '/movies'로 매칭
        path: 'movies/:movieId', //동적 파라미터로 받을 때 /movies/뒤에 오는 값을 movieId라는 이름으로 받겠다는 뜻
        element: <Movies />
      }
    ],
  },
]);

// 3. RouterProvider로 router 전달
function App() {
  return <RouterProvider router={router} />
}

export default App;

// 와일드카드(*) 경로로 NotFound 라우트 만들기
/*
const NotFound = () => (
  <main style={{ padding: 24 }}>
    <h1>페이지를 찾을 수 없어요 (404)</h1>
    <p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
    <a href="/">홈으로</a>
  </main>
);

const router = createBrowserRouter([
  { path: '/', element: <h1>홈 페이지입니다.</h1> },
  { path: '/movies', element: <h1>영화 페이지 입니다.</h1> },
  { path: '*', element: <NotFound /> }, // 가장 마지막에 배치
]);
*/