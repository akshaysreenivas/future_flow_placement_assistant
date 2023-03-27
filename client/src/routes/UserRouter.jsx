import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import CreatePasswordPage from '../pages/users/CreatePasswordPage'
import HomePage from '../pages/users/HomePage'
import OtpPage from '../pages/users/OtpPage'
import SignupPage from '../pages/users/SignupPage'
import UserLogin from '../pages/users/UserLogin'

function UserRouter() {
  return (
    <>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signUp" element={<SignupPage />} />
        <Route path="/verifyOTP" element={<OtpPage/>} />
        <Route path="/createPassword" element={<CreatePasswordPage />} />
      </Routes>
    </>
  )
}

export default UserRouter