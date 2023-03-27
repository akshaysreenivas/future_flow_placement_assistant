import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HrCreateAccount from '../components/hrCreateAccount/HrCreateAccount'
import HrCreatePassword from '../pages/hrManager/HrCreatePassword'
import HrDashboard from '../pages/hrManager/HrDashboard'
import HrLogin from '../pages/hrManager/HrLogin'
import HrOtpPage from '../pages/hrManager/HrOtpPage'

function HrRoutes() {
  return (
    <Routes>
        <Route path="/hr" element={<HrLogin/>} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
        <Route path="/hr/signup" element={<HrCreateAccount />} />
        <Route path="/hr/verifyOtp" element={<HrOtpPage />} />
        <Route path="/hr/createPassword" element={<HrCreatePassword />} />
        <Route path="/hr/login" element={<HrLogin />} />
      </Routes>
  )
}

export default HrRoutes