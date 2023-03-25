import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import LoadingButton from "../loadingButton/LoadingButton";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("1262235sss");
  const [email, setEmail] = useState("akshaypvkeerakkal@gmail.com");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
      // studentId validation
      if (!studentId || studentId.match(/^\s*$/))
      return toast.error("username required", { position: "top-center" });
    // email validation
    if (!email || email.match(/^\s*$/)) return toast.error("email required", { position: "top-center" });     
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) return toast.error(" enter a valid email", { position: "top-center" });
    
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        "/signup",
        {
          studentID: studentId,
          email: email,
        },
        { withCredentials: true }
      );
      setLoading(false);
      if (data.status) {
        toast(data.message, { position: "top-center" });
        navigate("/verifyOTP");
        return;
      }
      toast.error(data.message, { position: "top-center" });
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong", { position: "top-center" });
    }
  };
  return (
    <div className="formParentDiv">
      <div className="formDiv">
      <h2 className="text-center mb-4">Verify Student ID</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <Form.Text className="text-muted">
              Enter your Admission ID or Student ID
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
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
  );
}

export default SignupForm;
