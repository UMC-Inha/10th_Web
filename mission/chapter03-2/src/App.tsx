import './App.css'
import MoviePage from './pages/MoviePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import Home from './pages/Home'
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
      ]
    }
  ])
  return (
      <RouterProvider router={router} />
    )
}

export default App
