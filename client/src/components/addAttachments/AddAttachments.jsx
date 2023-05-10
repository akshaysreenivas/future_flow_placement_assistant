import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { uploadAttachments } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";
import { AiOutlineClose } from "react-icons/ai";
function AddAttachment() {
  const [state, setState] = useState({
    name: "",
  });

  const [file, setFile] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setState({ name: "" });
    setFile(null);
  };

  const handleInputChange = (event) => {
    setState((prevProps) => ({
      ...prevProps,
      [event.target.name]: event.target.value,
    }));
  };

  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    state.file = file;
    // password validation
    if (!state.name || state.name.match(/^\s*$/)) {
      return toast.error("Name field required");
    }

    // file validation   
    if (!state.file) {
      return toast.error("file required");
    }
    if (
      state.file.type !== "application/pdf" &&
      state.file.type !== "application/msword" &&
      state.file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return toast.error("Only PDFs, Word docs accepted!");
    }

    try {
      setLoading(true);
      uploadAttachments(state).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          toast.success("Successfully Updated", {autoClose: 1000});
          setState({ name: "" });
          setFile(null);
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
        Add Attachment
      </button>

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Attachment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter the name of attachment"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          {file && (
            <div className="d-flex flex-wrap m-auto justify-content-between px-2 py-1 bg-white text-primary rounded border border-primary border-1">
              {file.name}
              <span className="pointer" onClick={() => setFile(null)}>
                <AiOutlineClose className="text-dark" />
              </span>
            </div>
          )}
          <Form.Group controlId="Poster" className="mb-3">
            <Form.Label className=" px-3 m-2 ms-auto me-3 py-1 bg-primary text-white">
              Upload file
            </Form.Label>
            <Form.Control
              className="d-none"
              onChange={(e) => setFile(e.target.files[0])}
              name="file"
              type="file"
              size="sm"
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

export default AddAttachment;
