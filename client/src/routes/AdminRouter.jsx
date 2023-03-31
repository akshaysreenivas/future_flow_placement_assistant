import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminAddHrManagers from "../pages/admin/AdminAddHrManagers.";
import AdminAddUsers from "../pages/admin/AdminAddUsers";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminHrList from "../pages/admin/AdminHrList";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminUsersList from "../pages/admin/AdminUsersList";

function AdminRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/userList" element={<AdminUsersList />} />
        <Route path="/addStudents" element={<AdminAddUsers />} />
        <Route path="/hrList" element={<AdminHrList />} />
        <Route path="/addHrManagers" element={<AdminAddHrManagers />} />
      </Routes>
    </>
  );
}

export default AdminRouter;
