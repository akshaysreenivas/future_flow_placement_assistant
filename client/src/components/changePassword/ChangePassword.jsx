import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { changePassword } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import "./ChangePassword.css";
import { changeHRPassword } from "../../services/hrServices";

function ChangePassword({ hr }) {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [confirmPasswordType, setconfirmPasswordType] = useState(true);
  const [passwordType, setPasswordType] = useState(true);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const togglePassword = () => {
    setPasswordType(!passwordType);
  };
  const toggleConfirmPassword = () => {
    setconfirmPasswordType(!confirmPasswordType);
  };
  const handleClose = () => {
    setShow(false);
    setPassword("");
    setConfirmPassword("");
  };
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    // password validation
    if (!password || password.match(/^\s*$/)) {
      return toast.error("Password field required");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error(
        "password should contain at least one uppercase letter, one lowercase letter, one digit, and at least 8 characters"
      );
    }
    if (confirmPassword !== password) {
      return toast.error("Passwords did not match");
    }

    try {
      setLoading(true);
      if (hr) {
        changeHRPassword(password).then((data) => {
          if (data.status) {
            setShow(false);
            setPassword("");
            setConfirmPassword("");
            toast.success("Successfully Updated", {autoClose: 1000});
          } else {
            setShow(false);
            setPassword("");
            setConfirmPassword("");
            toast.error("Something went Wrong", {autoClose: 1000});
          }
          setLoading(false);
        });
      } else {
        changePassword(password).then((data) => {
          if (data.status) {
            dispatch(setUserDetails(data.user));
            setShow(false);
            setPassword("");
            setConfirmPassword("");
            toast.success("Successfully Updated");
          } else {
            setShow(false);
            setPassword("");
            setConfirmPassword("");
            toast.error("Something went Wrong");
          }
          setLoading(false);
        });
      }
    } catch (error) {
      setLoading(false);
      setShow(false);
      toast.error("Something went Wrong");
    }
  };
  return (
    <>
      <button
        className="text-primary  rounded border-0 px-2 py-1 m-1"
        onClick={handleShow}
      >
        Change Password
      </button>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Enter a Password</Form.Label>
            <Form.Control
              className="input "
              type={passwordType ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              autoFocus
            />
            <i className="eye_icon" onClick={togglePassword}>
              {passwordType ? (
                <MdVisibilityOff size={23} />
              ) : (
                <MdVisibility size={23} />
              )}
            </i>
          </Form.Group>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={confirmPasswordType ? "password" : "text"}
              id="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="password"
            />
            <i
              className="eye_icon position-absolute top-38 right-7"
              onClick={toggleConfirmPassword}
            >
              {confirmPasswordType ? (
                <MdVisibilityOff size={23} />
              ) : (
                <MdVisibility size={23} />
              )}
            </i>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <LoadingButton
              size="sm"
              className="loading_profile_upload"
              variant={"primary"}
            />
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>

              <Button type="button" variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePassword;
