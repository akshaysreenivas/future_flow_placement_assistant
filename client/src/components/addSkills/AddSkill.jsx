import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { addSkills } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";

function AddSkill() {
  const [state, setState] = useState({
    name: "",
    level: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setState({
      name: "",
      level: "",
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
    if (!state.name || state.name.match(/^\s*$/)) {
      return toast.error("Skill field required");
    }
    if (!state.level || state.level.match(/^\s*$/)) {
      return toast.error("Level field required");
    }

    try {
      setLoading(true);
      addSkills(state).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          toast.success("Successfully Updated", {autoClose: 1000});
          setState({
            name: "",
            level: "",
          });
        } else {
          setShow(false);
          toast.error("Something went Wrong", {autoClose: 1000});
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setShow(false);
      toast.error("Something went Wrong", {autoClose: 1000});
    }
  };
  return (
    <>
      <button
        className="text-primary mx-1 px-2 bg-white py-1 border-primary rounded"
        onClick={handleShow}
      >
        Add Skill
      </button>

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter the skill"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Level</Form.Label>
            <Form.Select onChange={handleInputChange} defaultChecked name="level" size="sm">
              <option  value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </Form.Select>
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

export default AddSkill;
