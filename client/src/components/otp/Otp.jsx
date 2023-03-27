import React from "react";
import "./Otp.css";
import { Button, Form } from "react-bootstrap";
import axiosInstance from "../../api/axios";
import { useState } from "react";
import LoadingButton from "../loadingButton/LoadingButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Otp() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate=useNavigate()
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        "/submitOtp",
        { otp: otp },
        { withCredentials: true }
      );
      setLoading(false);
      if (data.status) {
        toast(data.message, { position: "top-center" });
        return navigate("/createPassword") ;
      }
      toast.error(data.message, { position: "top-center" });
    } catch (error) {
      toast.error(error, { position: "top-center" });
      setLoading(false);
    }
  };
  return (
    <div className="formParentDiv">
      <div className="formDiv">
        <h2 className="text-center mb-4">Verify OTP</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Form.Text className="text-muted">
              Enter the otp we have sent you to your Email
            </Form.Text>
          </Form.Group>
          {loading ? (
            <LoadingButton size={"sm"} />
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </Form>
      </div>
    </div>
  );
}

export default Otp;
