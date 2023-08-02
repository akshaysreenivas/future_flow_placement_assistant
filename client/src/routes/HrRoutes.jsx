import React from "react";
import { Route, Routes } from "react-router-dom";
import HRAddJobPost from "../pages/hrManager/HRAddJobPost";
import HrDashboard from "../pages/hrManager/HrDashboardPage";
import HREditJobPost from "../pages/hrManager/HREditJob";
import HrJobDetails from "../pages/hrManager/HrJobDetails";
import HRListJobs from "../pages/hrManager/HRListJobs";
import HrLogin from "../pages/hrManager/HrLogin";
import HRCandidates from "../pages/hrManager/HRCandidates";
import CandidateProfileView from "../pages/hrManager/CandidateProfileView";
import HRMessagesPage from "../pages/hrManager/HRMessagesPage";
import ErrorPage from "../pages/ErrorPage";

function HrRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HrLogin />} />
      <Route path="/login" element={<HrLogin />} />
      <Route path="/dashboard" element={<HrDashboard />} />
      <Route path="/addJobs" element={<HRAddJobPost />} />
      <Route path="/jobs" element={<HRListJobs />} />
      <Route path="/messages" element={<HRMessagesPage />} />
      <Route path="/jobs/JobDetails/:id" element={<HrJobDetails />} />
      <Route path="/jobs/getCandidates/:id" element={<HRCandidates />} />
      <Route
        path="/jobs/viewCandidateProfile/:userid"
        element={<CandidateProfileView />}
      />
      <Route path="/jobs/editJobDetails/:id" element={<HREditJobPost />} />
      {/* Showing error page */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default HrRoutes;

