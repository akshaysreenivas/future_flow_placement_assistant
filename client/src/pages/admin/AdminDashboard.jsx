import { useEffect } from "react";
import Topbar from "../../components/adminNavbar/AdminNavbar";
import Sidebar from "../../components/adminSidebar/AdminSidebar";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    // checking for token if not redirecting to login page
    const token = localStorage.getItem("adminAuthToken");
    if (!token) return navigate("/admin");
  }, [navigate]);
  return (
    <div className="admin_page">
      <Topbar />
      <Sidebar />
      <div className="admin_component">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default AdminDashboard;
