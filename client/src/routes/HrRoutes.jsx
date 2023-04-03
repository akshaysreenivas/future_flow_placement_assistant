import React from "react";
import { Route, Routes } from "react-router-dom";
import HRAddJobPost from "../pages/hrManager/HRAddJobPost";
import HrDashboard from "../pages/hrManager/HrDashboard";
import HrJobDetails from "../pages/hrManager/HrJobDetails";
import HRListJobs from "../pages/hrManager/HRListJobs";
import HrLogin from "../pages/hrManager/HrLogin";

function HrRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HrLogin />} />
      <Route path="/login" element={<HrLogin />} />
      <Route path="/dashboard" element={<HrDashboard />} />
      <Route path="/addJobs" element={<HRAddJobPost />} />
      <Route path="/jobs" element={<HRListJobs/>} />
      <Route path="/jobs/JobDeatils" element={<HrJobDetails/>} />
    </Routes>
  );
}

export default HrRoutes;
