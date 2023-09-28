import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../loadingButton/LoadingButton";
import { Button } from "react-bootstrap";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import { adminLogin } from "../../services/adminServices";
import { userLogin } from "../../services/userServices";
import { hrLogin } from "../../services/hrServices";
import "./Login.css";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";

function Login({ role, url }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const togglePassword = () => {
    setPasswordType(!passwordType);
  };

  const validations = () => {
    // email validation
    if (!email || email.match(/^\s*$/)) {
      toast.error("email required", { position: "top-center" });
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error(" enter a valid email", { position: "top-center" });
      return false;
    }
    // password validation
    if (!password || password.match(/^\s*$/)) {
      toast.error("password required", { position: "top-center" });
      return false;
    }
    return true;
  };
  // submitting login form

  // admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (validations()) {
      setLoading(true);
      adminLogin(email, password)
        .then((data) => {
          setLoading(false);
          if (data.status) {
            localStorage.setItem("adminAuthToken", data.token);
            return navigate("/admin/dashboard");
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error.message);
          toast.error("Something Went Wrong");
        });
    }
  };

  // student login
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (validations()) {
      setLoading(true);
      try {
        const data = await userLogin(email, password);
        setLoading(false);
        if (data.status) {
          localStorage.setItem("userAuthToken", data.token);
          dispatch(setUserDetails(data.user));
          return navigate("/home");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error(error.message);
        toast.error("Something Went Wrong");
      }
    }
  };
  // hrlogin
  const handleHrLogin = async (e) => {
    e.preventDefault();
    if (validations()) {
      setLoading(true);
      try {
        const data = await hrLogin(email, password);
        setLoading(false);
        if (data.status) {
          localStorage.setItem("hrAuthToken", data.token);
          return navigate("/hr/dashboard");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error(error.message);
        toast.error("Something Went Wrong");
      }
    }
  };

  const handlesubmit = (e) => {
    switch (role) {
      case "Admin":
        handleAdminLogin(e);
        break;
      case "HR":
        handleHrLogin(e);
        break;
      case "Student":
        handleStudentLogin(e);
        break;
      default:
    }
  };
  return (
    <div className="loginParentDiv">
      <div className="loginDiv rounded">
        <div>
          <img
            className="img-fluid"
            src={url}
            alt="login"
            width={500}
            height={475}
          />
        </div>
        <div className="loginformDiv">
          <h1 className="text-center">{role} Login</h1>
          <form onSubmit={handlesubmit}>
            <label htmlFor="fname">Email Adddress</label>
            <input
              className="input"
              type="email"
              id="fname"
              placeholder="Enter Your Email"
              name="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="lname">Password</label>
            <div className="password_div">
              <input
                className="input "
                type={passwordType ? "password" : "text"}
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />

              <i className="Eye_icon" onClick={togglePassword}>
                {passwordType ? (
                  <MdVisibilityOff size={23} />
                ) : (
                  <MdVisibility size={23} />
                )}
              </i>
            </div>
            {loading ? (
              <LoadingButton size={"sm"} />
            ) : (
              <Button type="submit">login</Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
