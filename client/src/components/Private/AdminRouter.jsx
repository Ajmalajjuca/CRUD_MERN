import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


const AdminRouter = () => {
    const { user } = useSelector(state => state.user)
    const isAdmin = user?.isAdmin
    return isAdmin ? <Outlet /> : <Navigate to='/'/>
    
}

export default AdminRouter