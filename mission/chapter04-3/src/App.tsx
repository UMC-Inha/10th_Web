import './App.css'
import LogInPage from './pages/LogInPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import Home from './pages/Home'
import SignUpPage from './pages/SignUpPage'

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
        {
          path:"/signup",
          element: <SignUpPage/>,
        },
      ]
    }
  ])
  return (
      <RouterProvider router={router} />
    )
}

export default App
