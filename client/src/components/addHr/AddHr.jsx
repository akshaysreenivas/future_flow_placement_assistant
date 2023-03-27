import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import LoadingButton from "../loadingButton/LoadingButton";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import swal from "sweetalert2";
function AddHr() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
  });

  const handleInputChange = (event) => {
    setState((prevProps) => ({
      ...prevProps,
      [event.target.name]: event.target.value,
    }));
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    // validation
    if (!state.name || state.name.match(/^\s*$/) || state.name.length < 3)
      return toast.error("Valid student name required minimum 3 characters", {
        position: "top-center",
      });
    // email validation
    if (!state.email || state.email.match(/^\s*$/))
      return toast.error("email required", { position: "top-center" });
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email))
      return toast.error(" enter a valid email", { position: "top-center" });

    setLoading(true);
    try {
      // checking for auth token
      const token = localStorage.getItem("adminAuthToken");

      //   calling api
      const { data } = await axiosInstance.post(
        "/admin/addHrManagers",
        {
          username: state.name,
          email: state.email,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      const newValues = {
        name: "",
        studentId: "",
      };
      if (data.status) {
        swal.fire("Success", "Successfully added HR Manager", "success");
        setState(newValues);
        return;
      }
      toast.error(data.message, { position: "top-center" });
    } catch (err) {
      setLoading(false);
      const { data } = err.response;
      toast.error(data.message, { position: "top-center" });
    }
  };

  return (
    <>
      <div className="form_div">
        <h2 className="pb-3 mt-0">Add HR Managers</h2>
        <Form onSubmit={handlesubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter the name of HR"
              id="name"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter the email of HR"
              value={state.email}
              id="email"
              onChange={handleInputChange}
            />
          </Form.Group>
          {loading ? (
            <LoadingButton size={"sm"} className={"submitButton"} />
          ) : (
            <Button type="submit" className="submitButton">
              Submit
            </Button>
          )}
        </Form>
      </div>
    </>
  );
}; 

export default AddHr;
