import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


const UserRouter = () => {
    const { user } = useSelector(state => state.user)
    return user ? <Outlet /> : <Navigate to='/' />
}

export default UserRouter
