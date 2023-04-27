import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { addExperience } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";
import "./AddExperience.css";

function AddExperience() {
  const [state, setState] = useState({
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setState({
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleInputChange = (event) => {
    setState((prevProps) => ({
      ...prevProps,
      [event.target.name]: event.target.value,
    }));
  };

  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    // password validation
    if (!state.company || state.company.match(/^\s*$/)) {
      return toast.error("Company Name field required");
    }
    if (!state.title || state.title.match(/^\s*$/)) {
      return toast.error("Role field required");
    }
    if (!state.startDate) {
      return toast.error("Start Date field required");
    }
    if (!state.endDate) {
      return toast.error("End Date required");
    }
    if (!state.description) {
      return toast.error("Description field required");
    }

    try {
      setLoading(true);
      addExperience(state).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          toast.success("Successfully Added");
          setState({
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            description: "",
          });
        } else {
          setShow(false);
          toast.error("Something went Wrong");
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setShow(false);
      toast.error("Something went Wrong");
    }
  };
 
 
    return (
    <>     
        <button
          className="text-primary mx-1 px-2 bg-white py-1 border-primary rounded"
          onClick={handleShow}
        >
          Add Experience
        </button>
    
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>"Add Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              name="company"
              placeholder="Enter the company Name"
              value={state.company}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter the Role"
              value={state.title}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="row g-2">
            <Form.Group className="mb-3 col">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={state.startDate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 col">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={state.endDate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={state.description}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <LoadingButton
              size="sm"
              className="loading_profile_upload"
              variant={"light"}
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

export default AddExperience;
