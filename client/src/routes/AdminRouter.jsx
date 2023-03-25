import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminAddUsers from '../pages/admin/AdminAddUsers'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminUsersList from '../pages/admin/AdminUsersList'

function AdminRouter() {
  return (
    <>
    <Routes>
        <Route path="/admin" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/userList" element={<AdminUsersList />} />
        <Route path="/admin/addStudents" element={<AdminAddUsers />} />
      </Routes>
    </>
  )
}

export default AdminRouter