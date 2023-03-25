import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateAccount from '../components/createAccount/CreateAccount'
import Otp from '../components/otp/Otp'
import LandingPage from '../pages/LandingPage'
import SignupPage from '../pages/users/SignupPage'
import UserLogin from '../pages/users/UserLogin'

function UserRouter() {
  return (
    <>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signUp" element={<SignupPage />} />
        <Route path="/verifyOTP" element={<Otp />} />
        <Route path="/createAccount" element={<CreateAccount />} />
      </Routes>
    </>
  )
}

export default UserRouter