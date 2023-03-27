import React from 'react'
import Topbar from '../../components/adminNavbar/AdminNavbar'
import Sidebar from '../../components/adminSidebar/AdminSidebar'
import HRList from '../../components/hrList/HRList'

function AdminHrList() {
  return (
    <div className='admin_page'>
    <Topbar/>
    <Sidebar/>
    <div className='admin_component'>
  <HRList/>
    </div>
    </div>
  )
}

export default AdminHrList