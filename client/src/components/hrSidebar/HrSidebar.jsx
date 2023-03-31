import { HiUsers } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "./HrSidenav.css"

function HrSidebar() {
  const navigate = useNavigate();
  return (
  
      <SideNav
        className="hrsidenav"
        onSelect={(selected) => {
          navigate(selected);
        }}
      >
        <SideNav.Toggle className="toggle" />
        <SideNav.Nav defaultSelected="DashBoard">
          <NavItem eventKey="/hr/dashboard">
            <NavIcon>
              <MdDashboard size={20} className="sidebarIcon" />
            </NavIcon>
            <NavText>Home</NavText>
          </NavItem>
          <NavItem eventKey="/hr/studentsList">
            <NavIcon>
              <HiUsers size={20} className="sidebarIcon" />
            </NavIcon>
            <NavText>Students</NavText>
          </NavItem>
          <NavItem eventKey="/">
            <NavIcon>
              <FcManager size={20} className="sidebarIcon" />
            </NavIcon>
            <NavText>Jobs</NavText>
            <NavItem eventKey="/hr/jobs">
              <NavIcon></NavIcon>
              <NavText>Uploaded Jobs</NavText>
            </NavItem>
            <NavItem eventKey="/hr/addJobs">
              <NavIcon></NavIcon>
              <NavText>Add Jobs</NavText>
            </NavItem>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
   
  );
}

export default HrSidebar;
