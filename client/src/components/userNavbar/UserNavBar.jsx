import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";
import "./UserNavBar.css";
function UserNavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("userAuthToken");
    dispatch(setUserDetails(null));
    return navigate("/login");
  };
  return (
    <Navbar collapseOnSelect expand="lg">
      <Container className="navbar">
        <Navbar.Brand className="logo" onClick={() => navigate("/")}>
          FutureFlow
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className=" nav-items">
            <Link to={"/"} className="Link">
              Home
            </Link>
            <Link to={"/jobs"} className="Link">
              Jobs
            </Link>
            <Link to={"/challenges"} className="Link">
              Challenges
            </Link>
            <Link to={"/"} className="Link">
              Contact
            </Link>
            <Link to={"/"} className="Link">
              About
            </Link>
          </Nav>
          <Nav>
            <Link to={"/login"} className="Link">
              Profile
            </Link>
          </Nav>
          <Nav className="logout_btn me-1" onClick={handleLogout} >
            <span className="me-1">Logout</span>
            <RiLogoutCircleRLine
              size={15}
              
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNavBar;
