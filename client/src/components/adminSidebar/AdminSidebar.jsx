import {HiUsers } from "react-icons/hi";
import {MdDashboard } from "react-icons/md";
import {FcManager} from "react-icons/fc"
import { useNavigate } from "react-router-dom";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div>
      <SideNav
        className="sidenav"
        onSelect={(selected) => {
          navigate(selected);
        }}>
        <SideNav.Toggle className="toggle" />
        <SideNav.Nav defaultSelected="DashBoard">
          <NavItem eventKey="/admin/dashboard">
            <NavIcon>
              <MdDashboard size={20} className="sidebarIcon" />
            </NavIcon>
            <NavText>Home</NavText>
          </NavItem>
          <NavItem eventKey="/">
            <NavIcon>
            <HiUsers size={20} className="sidebarIcon" />
            </NavIcon>
            <NavText>Students</NavText>
            <NavItem eventKey="/admin/userList">
              <NavIcon>
              </NavIcon>
              <NavText>Users List</NavText>
            </NavItem>
            <NavItem eventKey="/admin/addStudents">
              <NavIcon>
              </NavIcon>
              <NavText>Add Students</NavText>
            </NavItem>
          </NavItem>
          <NavItem eventKey="/">
            <NavIcon>
            <FcManager size={20} className="sidebarIcon" />
            </NavIcon>
            <NavText>HR Managers</NavText>
            <NavItem eventKey="/admin/hrList">
              <NavIcon>
              </NavIcon>
              <NavText>HR List</NavText>
            </NavItem>
            <NavItem eventKey="/admin/addHrManagers">
              <NavIcon>
              </NavIcon>
              <NavText>Add HR</NavText>
            </NavItem>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </div>
  );
}

export default Sidebar;
