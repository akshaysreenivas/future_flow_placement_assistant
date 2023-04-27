import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";
import "./UserNavBar.css";
function UserNavBar({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("userAuthToken");
    dispatch(setUserDetails(null));
    return navigate("/login");
  };

  return (
    <Navbar
      collapseOnSelect
      className="main"
      bg="light"
      variant="light"
      expand="lg"
    >
      <Container className="navbar px-1">
        <Navbar.Brand className="brand" onClick={() => navigate("/")}>
          FutureFlow
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className=" nav-items d-flex align-items-center">
            <Link to={"/"} className="Link ">
              Home
            </Link>
            <Link to={"/jobs"} className="Link">
              Jobs
            </Link>
            <Link to={"/"} className="Link">
              Contact
            </Link>
            <Link to={"/"} className="Link">
              About
            </Link>
            {user ? (
              <Link to={"/profile"} className="Link">
                Profile
              </Link>
            ) : (
              <Link to={"/login"} className="Link">
                login
              </Link>
            )}
            {user && (
              <Link to={"/appliedJobs"} className="Link">
                Applied Jobs
              </Link>
            )}
          </Nav>
          {user && (
            <Nav
              className="logout_btn d-flex flex-row align-content-center text-md-danger me-1"
              onClick={handleLogout}
            >
              <span className="me-1">Logout</span>
              <RiLogoutCircleRLine size={15} />
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNavBar;
