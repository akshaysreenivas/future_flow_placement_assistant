import React from 'react'
import Topbar from '../../components/adminNavbar/AdminNavbar'
import Sidebar from '../../components/adminSidebar/AdminSidebar'
import UserList from '../../components/usersList/UsersList'
function AdminUsersList() {
  return (
    <div className='admin_page'>
    <Topbar/>
    <Sidebar/>
    <div className='admin_component'>
    <UserList/>
    </div>
    </div>
  )
}

export default AdminUsersList