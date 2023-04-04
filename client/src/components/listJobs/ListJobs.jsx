import "./ListJobs.css";
import React, { useEffect, useState } from "react";
import LoadingButton from "../loadingButton/LoadingButton";
import { Button, Table } from "react-bootstrap";
import { changeJobStatus, getJobPosts } from "../../services/hrServices";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function ListJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // fetching the datas 
    getJobPosts()
      .then((data) => {
          if(data.status){
            const d = data.result;
            setJobs(d.map((job) => ({ ...job, loading: false })));
            return
        }
        toast.error(data.message, { position: "top-left" });

      })
      .catch((error) => {
        toast.error(error.message, { position: "top-center" });
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="table_div">
      <h2 className="mb-3"> Job Posts</h2>
      {jobs.length ? (
        <Table hover>
          <thead>
            <tr>
              <th>Department</th>
              <th>Job Type</th>
              <th>Salary Range (₹) </th>
              <th>Status</th>
              <th>More info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs?.map((item) => {
              const changeStatus = () => {
                Swal.fire({
                  title: "Are you sure?",
                  icon: "warning",
                  width: 350,
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const newJobs = [...jobs];
                    // finding the current row
                    const jobsIndex = newJobs.findIndex(
                      (u) => u._id === item._id
                    );
                    // setting the loading animation
                    newJobs[jobsIndex].loading = true;
                    setJobs(newJobs);
                    // Calling Api
                    changeJobStatus(!item.active, item._id)
                      .then((data) => {
                        const updatedJobs = [...jobs];
                        updatedJobs[jobsIndex].loading = false;
                        if (data.status) {
                          updatedJobs[jobsIndex].active = !item.active;
                          toast(data.message, { position: "top-center" });
                        }
                        setJobs(updatedJobs);
                      })
                      .catch((err) => {
                        const updatedUsers = [...jobs];
                        updatedUsers[jobsIndex].loading = false;
                        setJobs(updatedUsers);
                        toast.error("Something Went Wrong", {
                          position: "top-center",
                        });
                      });
                  }
                });
              };

              return (
                <tr key={item._id}>
                  <td>{item.department}</td>
                  <td>{item.job_type}</td>
                  <td>
                    {item.min_salary === item.max_salary
                      ? item.max_salary
                      : item.min_salary + " - " + item.max_salary}
                  </td>

                  <td
                    className={item.active ? "text-success" : "text-secondary"}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </td>
                  <td> <Link className="link"  to="/hr/jobs/JobDeatils">More...</Link></td>
                  <td className="text-center text-dark">
                    {item.loading ? (
                      <LoadingButton
                        size="sm"
                        className={item.active ? "bg-success" : "bg-danger"}
                      />
                    ) : (
                      <Button
                        className={item.active ? "bg-danger" : "bg-success"}
                        onClick={changeStatus}
                      >
                        {item.active ? "Stop Hiring" : "Start Hiring"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <div>
          <h5 className="text-center">
            No Datas Available Here! Try Adding Job posts
          </h5>
        </div>
      )}
    </div>
  );
}

export default ListJobs;
