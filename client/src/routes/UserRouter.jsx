import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/users/HomePage";
import JobDetails from "../pages/users/JobDetails";
import JobsPage from "../pages/users/JobsPage";
import UserLogin from "../pages/users/UserLogin";
import ProfilePage from "../pages/users/ProfilePage";

function UserRouter() {
  return (
  
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/jobdetails/:id" element={<JobDetails/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/challenges" element={<ProfilePage />} />
      </Routes>
 
  );
}

export default UserRouter;
