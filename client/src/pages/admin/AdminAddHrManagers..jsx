import React from 'react'
import AddHr from '../../components/addHr/AddHr'
import Topbar from '../../components/adminNavbar/AdminNavbar'
import Sidebar from '../../components/adminSidebar/AdminSidebar'

function AdminAddHrManagers() {
  return (
    <div className='admin_page'>
    <Topbar/>
    <Sidebar/>
    <div className='admin_component'>
    <AddHr/>
    </div>
    </div>
  )
}

export default AdminAddHrManagers