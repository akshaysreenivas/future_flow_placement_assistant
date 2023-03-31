import React, { useState } from "react";
import { toast } from "react-toastify";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../loadingButton/LoadingButton";
import { Button } from "react-bootstrap";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import { adminLogin } from "../../services/adminServices";
import { userLogin } from "../../services/userServices";
import { hrLogin } from "../../services/hrServices";

function Login({ role }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [loading, setLoading] = useState(false);

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
          }
          toast.error(data.message, { position: "top-center" });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error, { position: "top-center" });
        });
    }
  };

  // student login
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (validations()) {
      setLoading(true);
      try {
        const { data } = await userLogin(email, password);
        console.log(data);
        setLoading(false);
        if (data.status) {
          localStorage.setItem("userAuthToken", data.token);
          return navigate("/home");
        }
        toast.error(data.message, { position: "top-center" });
      } catch (err) {
        console.log("try catch", err);
        setLoading(false);
        toast.error(err, { position: "top-center" });
      }
    }
  };
  // hrlogin
  const handleHrLogin = async (e) => {
    e.preventDefault();
    if (validations()) {
      setLoading(true);
      try {
        hrLogin(email, password)
          .then((data) => {
            setLoading(false);
            console.log("pro");
            if (data.status) {
              localStorage.setItem("hrAuthToken", data.token);
              return navigate("/hr/dashboard");
            }
            console.log("hiiii", data);
            toast.error(data.message, { position: "top-center" });
          })
          .catch((error) => {
            setLoading(false);
            console.log("hiiiillll");

            toast.error("Something went wrong", { position: "top-center" });
          });
      } catch (err) {
        console.log("try catch");
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
      <div className="loginDiv bg-light m-4">
        <h2 className="text-center">{role} Login</h2>
        <form onSubmit={handlesubmit}>
          <label htmlFor="fname">User Name</label>
          <input
            className="input"
            type="email"
            id="fname"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />

            <i className="Eye_icon link" onClick={togglePassword}>
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
  );
}

export default Login;
