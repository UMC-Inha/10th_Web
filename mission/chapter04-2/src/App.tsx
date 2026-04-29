import './App.css'
import LogInPage from './pages/LogInPage'
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
          path:"/login",
          element: <LogInPage/>,
        },
      ]
    }
  ])
  return (
      <RouterProvider router={router} />
    )
}

export default App
