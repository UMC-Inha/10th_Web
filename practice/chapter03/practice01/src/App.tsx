import './App.css'
// 1. React Router에서 필요한 함수/컴포넌트를 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 1) 만든 페이지 import
import HomePage from './pages/home';
import MoviesPage from './pages/movies';
import NotFound from './pages/not-found';
import RootLayout from './layout/root-layout';

// 라우터 연결
const router = createBrowserRouter([
  {path: '/', 
    //element : <HomePage/>,
    element: <RootLayout/>, errorElement: <NotFound/>,
    // 2) Navbar 아래에 표시할 자식 라우트
    children: [
      {
        // 3) index : true -> 부모의 기본 경로(/)일때
        index : true, element: <HomePage/>
      },
      // 4) 부모가 '/'이므로 movies만 써도 /movies로 매칭됨
      {path: 'movies/:movieId', element:<MoviesPage/>},
    ]
  },
]);

// 일반적인 404 처리
// const NotFound = () => (
//   <main style={{padding: 24}}>
//     <h1>페이지를 찾을 수 없어요 (404)</h1>
//     <p>주소를 다시 확인하거나 홈으로 이동해 주세요</p>
//     <a href='/'>홈으로</a>
//   </main>
// )

// 3. RouterProvider로 router 전달
function App() {
  return <RouterProvider router={router} />
}

export default App;