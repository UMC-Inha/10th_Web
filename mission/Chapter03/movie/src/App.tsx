import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import MovieListPage from './pages/MovieListPage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
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
