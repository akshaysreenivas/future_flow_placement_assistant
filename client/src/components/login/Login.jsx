import React, {  useState } from "react";
import { toast } from "react-toastify";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../loadingButton/LoadingButton";
import axiosInstance from "../../api/axios";
import { Button } from 'react-bootstrap';
import {MdVisibilityOff,MdVisibility} from "react-icons/md"

function Login({role}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [loading, setLoading] = useState(false);
 

  const togglePassword = () => {
    setPasswordType(!passwordType);
  };

  // submitting login form
  const handleLogin = async (e) => {
    e.preventDefault();
    // username validation
    if (!username || username.match(/^\s*$/))
      return toast.error("username required", { position: "top-center" });
    // password validation
    if (!password || password.match(/^\s*$/))
      return toast.error("password required", { position: "top-center" });
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/admin/login",
        {
          username,
          password,
        }
      );
      setLoading(false);
      if(data.status){
        localStorage.setItem("adminAuthToken",data.token)
        return navigate("/admin/dashboard");
        
      }
      toast.error(data.message, { position: "top-center" });
    } catch (error) {
      setLoading(false);
      toast.error(error, { position: "top-center" });
    }
  };
  return (
    <>
      <div className="loginParentDiv">
        <div className="loginDiv bg-light m-4">
          <h2 className="text-center">{role} Login</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="fname">User Name</label>
            <input
              className="input"
              type="text"
              id="fname"
              name="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                {passwordType ?  <MdVisibilityOff size={23} /> : <MdVisibility size={23} /> }
              </i>
            </div>
            {loading ? <LoadingButton size={"sm"} /> : <Button type="submit" >login</Button>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
