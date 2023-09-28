import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";
import "./UserNavBar.css";
import { MdNotifications } from "react-icons/md";
import { getNotifications } from "../../services/userServices";
function UserNavBar({ user }) {
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(user){
      getNotifications()
      .then((data) => {
        if (data.status) {
          setUnread(data.result.count);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [user]);

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
        {user && (
          <div className="noti_parent_div ms-auto d-md-block d-lg-none">
            <div className="notfication_icon_div me-auto pointer">
              <div className="px-md-4 px-2"></div>
              <div>
                <Link
                  to={"/notifications"}
                  className="me-auto ms-auto d-md-block d-lg-none"
                >
                  <MdNotifications color="blue" size={22} />
                  {unread > 0 && (
                    <span className="badge notfication_pill rounded-pill badge-notification bg-danger">
                      <small>{unread}</small>
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        )}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Link to={"/"} className="Link ">
              Home
            </Link>
            <Link to={"/jobs"} className="Link">
              Jobs
            </Link>
            {user ? (
              <Link to={"/profile"} className="Link">
                Profile
              </Link>
            ) : (
              <>
                <Link to={"/login"} className="Link">
                  Login
                </Link>
                <Link to={"/signup"} className="Link">
                  Signup
                </Link>
              </>
            )}
            
            {user && (
              <Link to={"/appliedJobs"} className="Link">
                Applied Jobs
              </Link>
            )}
          </Nav>

          {user && (
            <>
              <div className="noti_parent_div">
                <div className="notfication_icon_div me-auto pointer">
                  <Link
                    to={"/notifications"}
                    className="me-auto ms-auto d-none d-lg-block"
                  >
                    <MdNotifications color="blue" size={25} />
                    {unread > 0 && (
                      <span className="badge notfication_pill rounded-pill badge-notification bg-danger">
                        <small>{unread}</small>
                      </span>
                    )}
                  </Link>
                </div>
              </div>
              <Nav
                className="logout_btn d-flex flex-row align-content-center text-md-danger me-1"
                onClick={handleLogout}
              >
                <span className="me-1">Logout</span>
                <RiLogoutCircleRLine size={15} />
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNavBar;
