import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "../loadingButton/LoadingButton";
import { userSignup } from "../../services/userServices";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    name: "",
    studentID: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (token) return navigate("/home");
  }, [navigate]);

  const handleInputChange = (event) => {
    setState((prevProps) => ({
      ...prevProps,
      [event.target.name]: event.target.value,
    }));
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    // validations
    if (!state.name || state.name.match(/^\s*$/) || state.name.length < 3)
      return toast.error("Valid student name required minimum 3 characters");
    // email validation
    if (!state.email || state.email.match(/^\s*$/))
      return toast.error("email required");

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email))
      return toast.error("Please enter a valid email");
    if (
      !state.studentID ||
      state.studentID.match(/^\s*$/) ||
      state.studentID.length < 4
    )
      return toast.error("Valid Student ID required minimum 4 characters");

    //-----Password validation----
    if (!state.password || /\s/.test(state.password)) {
      return toast.error("Valid password required");
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!passwordRegex.test(state.password)) {
      return toast.error(
        "Password must contain between 6 and 16 characters long and contain at least one special character and a number"
      );
    }

    ///-----Confirm password validation------

    if (!state.confirmPassword) {
      return toast.error("Confirm Password field required");
    }

    if (state.password !== state.confirmPassword) {
      return toast.error("Passwords does not match");
    }

    setLoading(true);
    // calling api
    userSignup(state)
      .then((data) => {
        const newValues = {
          name: "",
          studentID: "",
          email: "",
          password: "",
          confirmPassword: "",
        };
        if (data.status) {
          setState(newValues);
          return navigate("/otp-submit");
        }
        toast.error(data.message);
      })
      .catch((err) => {
        const data = err;
        toast.error(data.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="signupParentDiv">
      <div className="signupDiv rounded">
        <div>
          <img
            className="img-fluid"
            src={"/signup.avif"}
            alt="signup"
            width={500}
            height={475}
          />
        </div>
        <div className="signupformDiv">
          <h1 className="text-center">Student Signup</h1>
          <form onSubmit={handlesubmit}>
            <label htmlFor="fname">Name</label>
            <input
              className="input"
              placeholder="Enter Your Name"
              type="text"
              id="fname"
              name="name"
              value={state.name}
              onChange={handleInputChange}
            />
            <label htmlFor="email">Email Address</label>
            <input
              className="input"
              placeholder="Enter Your Email Address"
              type="email"
              id="email"
              name="email"
              value={state.email}
              onChange={handleInputChange}
            />
            <label htmlFor="studentId">Student ID</label>
            <input
              className="input"
              type="text"
              placeholder="Enter Student ID"
              id="studentId"
              name="studentID"
              value={state.studentID}
              onChange={handleInputChange}
            />
            <label htmlFor="studentId"> Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter a Password"
              id="password"
              name="password"
              value={state.password}
              onChange={handleInputChange}
            />
            <label htmlFor="studentId">Confirm Password</label>
            <input
              className="input"
              type="password"
              placeholder="Confirm Your Password"
              id="confirmPassword"
              name="confirmPassword"
              value={state.confirmPassword}
              onChange={handleInputChange}
            />
            {loading ? (
              <LoadingButton size={"sm"} />
            ) : (
              <button type="submit">Signup</button>
            )}
          </form>
          <p>Already have an account? <Link to="/login">Login Here</Link> </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;
