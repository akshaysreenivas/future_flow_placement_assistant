import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FcSettings } from "react-icons/fc";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../changePassword/ChangePassword";
function Topbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("hrAuthToken");
    navigate("/hr");
  };
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">FutureFlow</span>
        </div>
        <div className="topRight">
          <div className="pointer">
            
            <DropdownButton id="dropdown-basic-button" variant="white" color="white" title={<FcSettings size={20} color="black" />}>
              <Dropdown.Item> <ChangePassword hr={true}/></Dropdown.Item>

            </DropdownButton>
          </div>
          <img
            src="/hr_profile.png"
            alt=""
            className="topAvatar"
          />
          <div className="topbarIconContainer">
            <RiLogoutCircleRLine size={20} onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Topbar;
