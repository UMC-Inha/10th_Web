import './App.css'
import MoviePage from './pages/MoviePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import Home from './pages/Home'
import MovieDetailsPage from './pages/MovieDetailsPage'
function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <Home/>,
      errorElement: <NotFound/>,
      children: [
        {
          path:"/movies/:category",
          element: <MoviePage/>, 
        },
        {
          path:"/movie/:movieId",
          element:<MovieDetailsPage/>
        }
      ]
    }
  ])
  return (
      <RouterProvider router={router} />
    )
}

export default App
