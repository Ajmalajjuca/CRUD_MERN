
import './index.css'
import Home from './pages/Home'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserProfile from './pages/UserProfile'
import UserRouter from './components/Private/UserRouter'
import AdminDashboard from './pages/AdminDashboard'
import AdminRouter from './components/Private/AdminRouter'
import AdminProfile from './pages/AdminProfile'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route element={<UserRouter />}>
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/dashboard' element={<Home />} />

          </Route>
          <Route element={<AdminRouter />} >
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/profile' element={<AdminProfile />} />
          </Route>

        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
