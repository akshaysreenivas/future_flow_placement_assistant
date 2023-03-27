import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreatePassword from '../components/createPassword/CreatePassword'
import Otp from '../components/otp/Otp'
import LandingPage from '../pages/LandingPage'
import HomePage from '../pages/users/HomePage'
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
        <Route path="/verifyOTP" element={<Otp />} />
        <Route path="/createPassword" element={<CreatePassword />} />
      </Routes>
    </>
  )
}

export default UserRouter