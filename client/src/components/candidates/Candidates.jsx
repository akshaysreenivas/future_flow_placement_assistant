import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { changeHRStatus } from "../../services/adminServices";
import LoadingButton from "../loadingButton/LoadingButton";
import { Link, useParams } from "react-router-dom";
import { getCandidates } from "../../services/hrServices";

function Candidates() {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    getCandidates(id)
      .then((data) => {
        if (data.status) {
          const d = data.result;
          setUsers(d.map((user) => ({ ...user, loading: false })));
  
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong", { position: "top-center" });
      });
  }, [id]);
  return (
    <div className="table_div">
      <h2 className="mb-3">Candidates</h2>
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
              const changeStatus = () => {
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
                    // finding the current row
                    const userIndex = newUsers.findIndex(
                      (u) => u._id === item._id
                    );
                    // setting the loading animation
                    newUsers[userIndex].loading = true;
                    setUsers(newUsers);
                    // Calling Api
                    changeHRStatus(!item.blocked, item._id)
                      .then((data) => {
                        const updatedUsers = [...users];
                        updatedUsers[userIndex].loading = false;
                        if (data.status) {
                          updatedUsers[userIndex].blocked = !item.blocked;
                          toast(
                            `Successfully ${
                              item.blocked ? "Blocked" : "UnBlocked"
                            } HR Manager`,
                            { position: "top-center" }
                          );
                        }
                        setUsers(updatedUsers);
                      })
                      .catch((err) => {
                        const updatedUsers = [...users];
                        updatedUsers[userIndex].loading = false;
                        setUsers(updatedUsers);
                        toast.error("Something Went Wrong", {
                          position: "top-center",
                        });
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
                  <div>
                    {item.loading ? (
                      <LoadingButton
                        size="sm"
                        className={item.blocked ? "bg-success" : "bg-danger"}
                      />
                    ) : (
                      <Button
                        className={ "bg-danger me-1"}
                        onClick={changeStatus}
                      >
                        Reject
                      </Button>
                    )}
                    {item.loading ? (
                      <LoadingButton
                        size="sm"
                        className={item.blocked ? "bg-success" : "bg-danger"}
                      />
                    ) : (
                      <Button
                        className={ "bg-success"}
                        onClick={changeStatus}
                      >
                        Short List
                      </Button>
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
          <h5 className="text-center">No Datas Available Here!</h5>
        </div>
      )}
    </div>
  );
}

export default Candidates;
