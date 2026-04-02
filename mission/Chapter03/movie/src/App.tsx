import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import MovieListPage from './pages/MovieListPage'
import MovieDetailPage from './pages/MovieDetailPage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        // 기본 진입 시 보여줄 홈 페이지
        index: true,
        element: <HomePage />,
      },
      {
        // 영화 카테고리별 목록 페이지
        path: 'popular',
        element: <MovieListPage title="인기 영화" endpoint="popular" />,
      },
      {
        path: 'upcoming',
        element: <MovieListPage title="개봉 예정" endpoint="upcoming" />,
      },
      {
        path: 'top-rated',
        element: <MovieListPage title="평점 높은 영화" endpoint="top_rated" />,
      },
      {
        path: 'now-playing',
        element: <MovieListPage title="현재 상영 중" endpoint="now_playing" />,
      },
      {
        // 카드 클릭 시 이동하는 동적 상세 페이지
        path: 'movies/:movieId',
        element: <MovieDetailPage />,
      },
      {
        // 정의되지 않은 경로는 404 페이지로 처리
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
