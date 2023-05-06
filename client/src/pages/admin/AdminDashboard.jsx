import { useEffect } from "react";
import Topbar from "../../components/adminNavbar/AdminNavbar";
import Sidebar from "../../components/adminSidebar/AdminSidebar";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../components/dashboard/Dashboard";

function AdminDashboard() {
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
        <h1>Dashboard</h1>
        <Dashboard/>
      </div>
    </div>
  );
}

export default AdminDashboard;
