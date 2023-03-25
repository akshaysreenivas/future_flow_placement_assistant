import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HrLogin from '../pages/hrManager/HrLogin'

function HrRoutes() {
  return (
    <Routes>
        <Route path="/hr" element={<HrLogin/>} />
      </Routes>
  )
}

export default HrRoutes