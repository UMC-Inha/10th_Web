import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import LpDetailPage from './pages/LpDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="lp/:lpId" element={<LpDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
