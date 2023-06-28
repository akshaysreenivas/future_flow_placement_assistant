import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingButton from "../loadingButton/LoadingButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  changeCandidateStatus,
  getCandidates,
} from "../../services/hrServices";
import "./Candidates.css";
function Candidates() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate=useNavigate()

  const { id } = useParams();
  useEffect(() => {
    getCandidates(id, filter)
      .then((data) => {
        if (data.status) {
          const d = data.result;
          setUsers(
            d?.map((user) => ({
              ...user,
              rejectloading: false,
              loading: false,
            }))
          );
        }
        
        navigate("/*")

      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong", { position: "top-center" });
      });
  }, [id, filter]);
  const Status = ["Applied", "Rejected", "Short Listed", "Placed"];
  return (
    <div className="table_div">
      <h2 className="mb-3 text-center">Job Candidates</h2>

      <div className="me-auto mb-4 ">
        <label className="mb-1">Filter by Candidates Status</label>
        <Form.Select
          size="sm"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          <option value="" defaultChecked>
            &#xE16E; All Candidates
          </option>
          {Status.map((item, index) => (
            <option value={item} key={index}>
              {item}
            </option>
          ))}
        </Form.Select>
      </div>
      {users.length ? (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Student ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Current Status</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((item) => {
              const changeStatus = (status) => {
                Swal.fire({
                  title: "Are you sure?",
                  icon: "warning",
                  width: 450,
                  heightAuto: false,
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const newUsers = [...users];
                    // // finding the current row
                    const userIndex = newUsers.findIndex(
                      (u) => u.id._id === item.id._id
                    );
                    // // setting the loading animation
                    if (status === "Rejected") {
                      newUsers[userIndex].rejectloading = true;
                    } else {
                      newUsers[userIndex].loading = true;
                    }
                    setUsers(newUsers);

                    // // setting the new status
                    // Calling Api
                    changeCandidateStatus(id, item.id._id, status)
                      .then((data) => {
                        if (data.status) {
                          newUsers[userIndex].progress.status = status;
                          setUsers(newUsers);
                          toast.success(`Successfully ${status} candidate`, {autoClose: 1000});
                        }
                      })
                      .catch((err) => {
                        toast.error("Something Went Wrong", {autoClose: 1000});
                      })
                      .finally(() => {
                        const updatedUsers = [...users];
                        updatedUsers[userIndex].loading = false;
                        newUsers[userIndex].rejectloading = false;
                        setUsers(updatedUsers);
                      });
                  }
                });
              };

              return (
                <tr key={item.id._id}>
                  <td>
                    <div className="profileimgpreviewdiv  mx-auto">
                      <img
                        src={
                          item.id.profilePicUrl
                            ? process.env.REACT_APP_BASE_URL +
                              item.id.profilePicUrl
                            : "/default_profile_pic.avif"
                        }
                        width={50}
                        alt=""
                        className="circle"
                      />
                    </div>
                  </td>
                  <td>{item.id.name}</td>
                  <td>{item.id.studentID}</td>
                  <td>{item.id.email}</td>
                  <td>{item.id.phone}</td>
                  <td> {item.progress.status}</td>
                  <td className="">
                    <Link
                      className="link text-light m-auto"
                      to={`/hr/jobs/viewCandidateProfile/${item.id._id}`}
                    >
                      <Button className="bg-info m-auto d-block text-dark py-1 px-2">
                        View...
                      </Button>
                    </Link>
                  </td>
                  <td className="text-center text-dark">
                    <div className="d-flex align-items-center justify-content-center">
                      {item.progress.status === "Rejected" ? (
                        <span className="text-danger">Rejected</span>
                      ) : item.progress.status === "Placed" ? (
                        <span className="text-success">Placed</span>
                      ) : (
                        <>
                          {item.rejectloading ? (
                            <LoadingButton size="sm" className={"reject_btn"} />
                          ) : (
                            <button
                              className={"reject_btn"}
                              onClick={() => changeStatus("Rejected")}
                            >
                              Reject
                            </button>
                          )}

                          {item.loading ? (
                            <LoadingButton
                              size="sm"
                              className={
                                item.progress.status === "Short Listed"
                                  ? "hire_btn"
                                  : "shortList_btn"
                              }
                            />
                          ) : item.progress.status === "Short Listed" ? (
                            <Button
                              className={"hire_btn"}
                              onClick={() => changeStatus("Placed")}
                            >
                              Hire
                            </Button>
                          ) : (
                            <Button
                              className={"shortList_btn"}
                              onClick={() => changeStatus("Short Listed")}
                            >
                              Short List
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <div>
          <h5 className="text-center">No Candidates Found!</h5>
        </div>
      )}
    </div>
  );
}

export default Candidates;

// <td className="text-center text-dark">
// <div className="d-flex align-items-center justify-content-center">
//   {item.progress.status==="Rejected" ? (
//     <span className="text-danger">Rejected</span>
//   ) : (
//     <>
//       {item.rejectloading ? (
//         <LoadingButton size="sm" className={"reject_btn"} />
//       ) : (
//         item.progress.status !== "Placed" && (
//           <button
//             className={"reject_btn"}
//             onClick={() => changeStatus("Rejected")}
//           >
//             Reject
//           </button>
//         )
//       )}
//       {item.loading ? (
//         <LoadingButton size="sm" className={ item.progress.status !== "Placed" ? "shortList_btn" : "hire_btn"} />
//       ) : item.progress.status === "Short Listed" ? (
//         item.progress.status !== "Placed" && (
//           <Button
//             className={"hire_btn"}
//             onClick={() => changeStatus("Placed")}
//           >
//             Hire
//           </Button>
//         )
//       ) : item.progress.status !== "Placed" ? (
//         <Button
//           className={"shortList_btn"}
//           onClick={() => changeStatus("Short Listed")}
//         >
//           Short List
//         </Button>
//       ) : (
//         <span className="text-success">Placed</span>
//         )}
//     </>
//   )}
// </div>
// </td>
