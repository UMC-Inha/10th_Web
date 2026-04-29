import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import MovieListPage from './pages/MovieListPage'
import AllMoviesPage from './pages/AllMoviesPage'
import MovieDetailPage from './pages/MovieDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="all" element={<AllMoviesPage />} />
            <Route path="popular" element={<MovieListPage title="인기 영화" endpoint="popular" />} />
            <Route path="upcoming" element={<MovieListPage title="개봉 예정" endpoint="upcoming" />} />
            <Route path="top-rated" element={<MovieListPage title="평점 높은 영화" endpoint="top_rated" />} />
            <Route path="now-playing" element={<MovieListPage title="현재 상영 중" endpoint="now_playing" />} />
            <Route path="movies/:movieId" element={<MovieDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
