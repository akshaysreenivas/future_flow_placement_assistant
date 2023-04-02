import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { Button } from "react-bootstrap";
import "./AddUsers.css";
import { Form } from "react-bootstrap";
import swal from "sweetalert2";
import { addUsers } from "../../services/adminServices";
function AddUsers() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    name: "",
    studentId: "",
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
    // validations
    if (!state.name || state.name.match(/^\s*$/) || state.name.length < 3)
      return toast.error("Valid student name required minimum 3 characters", {
        position: "top-center",
      });
    if (
      !state.studentId ||
      state.studentId.match(/^\s*$/) ||
      state.studentId.length < 4
    )
      return toast.error("Valid Student ID required minimum 4 characters", {
        position: "top-center",
      });
    // email validation
    if (!state.email || state.email.match(/^\s*$/))
      return toast.error("email required", { position: "top-center" });
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email))
      return toast.error(" enter a valid email", { position: "top-center" });
    setLoading(true);
    // calling api
    addUsers(state)
      .then((data) => {
        console.log("data",data)
        setLoading(false);
        const newValues = {
          name: "",
          studentId: "",
          email: "",
        };
        if (data.status) {
          swal.fire("Success", "Successfully added Student", "success");
          setState(newValues);
          return;
        }
        toast.error(data.message, { position: "top-center" });
      })
      .catch((err) => {
        console.log("err",err)
        setLoading(false);
        const  data  = err;
        toast.error(data.message, { position: "top-center" });
      });
  };

  return (
    <>
      <div className="form_div">
        <h2 className="pb-3 mt-0">Add Students</h2>
        <Form onSubmit={handlesubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Student Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter the name of Student"
              id="name"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              name="studentId"
              placeholder="Enter the Admission ID of the student."
              value={state.studentId}
              id="id"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter the Email ID of the student."
              value={state.email}
              id="id"
              onChange={handleInputChange}
            />
          </Form.Group>
          {loading ? (
            <LoadingButton size={"sm"} variant={"white"} className={"submitButton"} />
          ) : (
            <Button type="submit" className="submitButton">
              Submit
            </Button>
          )}
        </Form>
      </div>
    </>
  );
}

export default AddUsers;
