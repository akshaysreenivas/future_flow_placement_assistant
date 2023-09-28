import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import { submitOtp } from "../services/userServices";
import LoadingButton from "../components/loadingButton/LoadingButton";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/store";

export default function App() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const handlesubmit = async () => {
    // validations
    if (!otp || otp.match(/^\s*$/) || otp < 6)
      return toast.error("Enter a Valid OTP");
    setLoading(true);
    // calling api
    submitOtp(otp)
      .then((data) => {
        if (data.status) {
          setOtp("");
          localStorage.setItem("userAuthToken", data.token);
          dispatch(setUserDetails(data.user));
          return  navigate("/")
        }
        toast.error(data.message);
      })
      .catch((err) => {
        console.log("err", err);
        const data = err;
        toast.error(data.message);
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 vw-100">
      <div className="otpContainer rounded border border-5">
        <img src="./otp.png" width={60} alt="" />
        <h2 className="pb-4 text-center">Verification Code</h2>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          shouldAutoFocus={true}
          inputStyle="otpInput"
          
          inputType={"tel"}
        />
        <div className="pt-3">
        {loading ? (
          <LoadingButton className={"submitButton rounded border-0"} variant="white" size={"sm"} />
          ) : (
            <Button className="submitButton" onClick={handlesubmit}>Submit</Button>
            )}
            </div>
      </div>
    </div>
  );
}
