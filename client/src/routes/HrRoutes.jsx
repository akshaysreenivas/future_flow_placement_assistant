import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HrDashboard from '../pages/hrManager/HrDashboard'
import HrLogin from '../pages/hrManager/HrLogin'

function HrRoutes() {
  return (
    <Routes>
        <Route path="/hr" element={<HrLogin/>} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
      </Routes>
  )
}

export default HrRoutes