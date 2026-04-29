import './App.css'
import LogInPage from './pages/LogInPage'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import SignUpPage from './pages/SignUpPage'
import { AuthProvider } from './context/AuthContext'
import Mypage from './pages/Mypage'
import ProtectedLayout from './layouts/ProtectedLayout'
import HomeLayout from './layouts/HomeLayout'

const publicRoutes:RouteObject[] = [
  {
      path:"/",
      element: <HomeLayout/>,
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
] 
const protectedRoutes:RouteObject[] = ([
  {
    path:"/",
    element:<ProtectedLayout/>,
    errorElement:<NotFound/>,
    children:[
      {
        path:"me",
        element:<Mypage/>
      }
    ]
  }
])

const router = createBrowserRouter([...publicRoutes,...protectedRoutes])
function App() {
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    )
}

export default App
