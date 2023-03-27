import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import LoadingButton from "../loadingButton/LoadingButton";
import "./CreatePassword.css";

function CreatePassword({ role }) {
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [confirmpassType, setConfirmpassType] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.match(/^\s*$/))
      return toast.error("* Password field required", {
        position: "top-center",
      });

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password))
      return toast.error(
        "password should contain at least one uppercase letter, one lowercase letter, one digit, and at least 8 characters",
        { position: "top-center" }
      );
    if (password !== ConfirmPassword)
      return toast.error("Passwords Doesn't Match", { position: "top-center" });
    setLoading(true);

    // calling api for student
    if (role === "Student") {
      try {
        const { data } = await axiosInstance.post(
          "/createPassword",
          { password },
          { withCredentials: true }
        );
        if (data.status) {
          return navigate("/login");
        }
        setLoading(false);
        toast.error(data.message, { position: "top-center" });
      } catch (error) {
        setLoading(false);
        toast.error(error, { position: "top-center" });
      }
    }
    // calling api for HR
    else if (role === "HR") {
      try {
        const { data } = await axiosInstance.post(
          "/hr/createPassword",
          { password },
          { withCredentials: true }
        );
        if (data.status) {
          return navigate("/hr/login");
        }
        setLoading(false);
        toast.error(data.message, { position: "top-center" });
      } catch (error) {
        setLoading(false);
        toast.error(error, { position: "top-center" });
      }
    }
  };
  return (
    <div className="formParentDiv">
      <div className="formDiv">
        <h2 className="text-center">Create Password</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="password_div">
              <Form.Control
                value={password}
                type={passwordType ? "password" : "text"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Form.Text className="text-muted"></Form.Text>
              <i className="Eye_icon">
                {passwordType ? (
                  <MdVisibilityOff
                    size={23}
                    onClick={() => setPasswordType(!passwordType)}
                  />
                ) : (
                  <MdVisibility
                    size={23}
                    onClick={() => setPasswordType(!passwordType)}
                  />
                )}
              </i>
            </div>
          </Form.Group>
          <Form.Group className="mb-3 ">
            <Form.Label>Confirm Password</Form.Label>
            <div className="password_div">
              <Form.Control
                type={confirmpassType ? "password" : "text"}
                value={ConfirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              <Form.Text className="text-muted"></Form.Text>
              <i className="Eye_icon">
                {confirmpassType ? (
                  <MdVisibilityOff
                    size={23}
                    onClick={() => setConfirmpassType(!confirmpassType)}
                  />
                ) : (
                  <MdVisibility
                    size={23}
                    onClick={() => setConfirmpassType(!confirmpassType)}
                  />
                )}
              </i>
            </div>
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

export default CreatePassword;
