import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/users/HomePage";
import JobDetails from "../pages/users/JobDetails";
import JobsPage from "../pages/users/JobsPage";
import UserLogin from "../pages/users/UserLogin";
import ProfilePage from "../pages/users/ProfilePage";
import AppliedJobsPage from "../pages/users/AppliedJobs";
import NotificationsPage from "../pages/users/NotificationsPage";
import ErrorPage from "../pages/ErrorPage";
import OtpPage from "../pages/otp";
import Signup from "../components/signup/Signup";
import ProtectedRoute from "../PrivateRoute";

function UserRouter() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/otp-submit" element={<OtpPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<UserLogin />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobdetails/:id"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appliedJobs"
        element={
          <ProtectedRoute>
            <AppliedJobsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Showing error page */}
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}

export default UserRouter;
