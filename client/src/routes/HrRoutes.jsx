import React from "react";
import { Route, Routes } from "react-router-dom";
import HrDashboard from "../pages/hrManager/HrDashboard";
import HrLogin from "../pages/hrManager/HrLogin";

function HrRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HrLogin />} />
      <Route path="/dashboard" element={<HrDashboard />} />
      <Route path="/login" element={<HrLogin />} />
    </Routes>
  );
}

export default HrRoutes;
