import React, {useEffect } from "react";
import Topbar from "../../components/adminNavbar/AdminNavbar";
import Sidebar from "../../components/adminSidebar/AdminSidebar";
import { useNavigate } from 'react-router-dom';
import UserList from "../../components/usersList/UsersList";

function AdminUsersList() {
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
      <div className="component">
          <UserList />
      </div>
    </div>
  );
}

export default AdminUsersList;
