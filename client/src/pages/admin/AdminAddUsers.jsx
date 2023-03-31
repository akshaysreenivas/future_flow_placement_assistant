import React, { useEffect } from "react";
import Topbar from "../../components/adminNavbar/AdminNavbar";
import Sidebar from "../../components/adminSidebar/AdminSidebar";
import AddUsers from "../../components/addUsers/AddUsers";
import { useNavigate } from "react-router-dom";

function AdminAddUsers() {
  const navigate = useNavigate();
  useEffect(() => {
    // checking for token if not redirecting to login page
    const token = localStorage.getItem("adminAuthToken");
    if (!token || token ==="undefined") return navigate("/admin");
  }, [navigate]);
  return (
    <div className="page">
      <Topbar />
      <Sidebar />
      <div className="admin_component">
        <AddUsers />
      </div>
    </div>
  );
}

export default AdminAddUsers;
