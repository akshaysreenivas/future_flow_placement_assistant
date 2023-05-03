import React from "react";
import "./AdminNavbar.css";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
function Topbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken");
    navigate("/admin");
  };
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">FutureFlow</span>
        </div>
        <div className="topRight">
          <img
            src="/admin_profile.avif"
            alt=""
            className="topAvatar"
          />
          <div className="topbarIconContainer">
            <RiLogoutCircleRLine size={25} onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Topbar;
