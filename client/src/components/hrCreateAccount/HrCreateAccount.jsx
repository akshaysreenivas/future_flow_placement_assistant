import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
import LoadingButton from '../loadingButton/LoadingButton';

function HrCreateAccount() {
    const [email,setEmail]=useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
         // email validation
    if (!email || email.match(/^\s*$/)) {
      toast.error("email required", { position: "top-center" });
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error(" enter a valid email", { position: "top-center" });
      return false;
    }
      try {
        setLoading(true);
        const { data } = await axiosInstance.post("/hr/signup", {
          email
        },{withCredentials:true});
        setLoading(false);
        if (data.status) {
          return navigate("/hr/verifyOtp");
        }
        toast.error(data.message, { position: "top-center" });
      } catch (error) {
        setLoading(false);
        toast.error(error, { position: "top-center" });
      }
    
  };
  return (
    <div className="formParentDiv">
      <div className="formDiv">
      <h2 className="text-center mb-4"> Create Account</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" >
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter the registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          {loading ? (
            <LoadingButton size={"sm"} />
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </Form>
      </div>
    </div>
  ) 
}

export default HrCreateAccount