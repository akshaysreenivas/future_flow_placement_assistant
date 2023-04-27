import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { editSkill } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../store/store";
import { MdEdit } from "react-icons/md";

function EditSkill({ id }) {
  const [state, setState] = useState({
    name: "",
    level: "",
  });
  const { user } = useSelector((state) => state.user);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleShow = () => {
    const editSkill = user.skills.filter((item) => item._id === id);
    const editState = editSkill[0];
    setState(editState);
    setShow(true);
  };

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

  const handleSubmit = () => {
    // password validation
    if (!state.name || state.name.match(/^\s*$/)) {
      return toast.error("Company Name field required");
    }
    if (!state.level || state.level.match(/^\s*$/)) {
      return toast.error("Role field required");
    }

    try {
      setLoading(true);
      editSkill(state._id, state).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          toast.success("Successfully Updated");
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
      <MdEdit onClick={handleShow}
        className="bg-primary pointer text-white p-1 m-1  rounded"
        size={20}
      />

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
              placeholder="Enter the name of the skill"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Level</Form.Label>
            <Form.Select onChange={handleInputChange} name="level" size="sm">
              <option value="Beginner">Beginner</option>
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

export default EditSkill;
