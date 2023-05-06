import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { changeUserStatus, getUsers } from "../../services/adminServices";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import "./Userlist.css";
import LoadingButton from "../loadingButton/LoadingButton";
import Swal from "sweetalert2";
import SearchBar from "../searchBar/SearchBar";
import Pagination from "../pagination/Pagination";
import Loading from "../loading/Loading";

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [limit, setLimit] = useState();
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  useEffect(() => {
    getUsers(department, page, search)
      .then((data) => {
        setUsers(data.result?.map((user) => ({ ...user, loading: false })));
        setPage(data.page);
        setNext(data.next);
        setPrev(data.previous);
        setTotal(data.total);
        setLimit(data.limit);
        setDepartments(data.departments);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
        toast.error("Something Went Wrong", { position: "top-center" });
      }).finally(()=>setLoading(false));
  }, [department, page, search]);

  // handling reseting the filterations
  const handleReset = () => {
    setDepartment("");
    setSearch("");
  };
  
  return (
    <div className="table_div">
      <h2>Students</h2>
      <div>
        <SearchBar
          value={search}
          placeholder={"Search"}
          setSearch={setSearch}
        />
        <div className="d-flex align-items-center justify-content-evenly my-3">
          <Form.Select
            size="sm"
            className=""
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
          >
            <option value="" defaultChecked disabled>
              Filter By Department
            </option>
            {departments.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </Form.Select>
          <Button onClick={handleReset}>reset</Button>
        </div>
      </div>
      {  loading ? ( <div className="d-flex justify-content-center mx-auto my-5">
      <Loading />
    </div>) :
        (users.length ? (
        <>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
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
                      changeUserStatus(!item.blocked, item._id)
                        .then((data) => {
                          const updatedUsers = [...users];
                          updatedUsers[userIndex].loading = false;
                          if (data.status) {
                            updatedUsers[userIndex].blocked = !item.blocked;
                            toast(
                              `Successfully ${
                                item.blocked ? "Blocked" : "UnBlocked"
                              } Student`,
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

                let statusColor = "text-secondary";
                if (item.status === "Inactive") {
                  statusColor = "text-secondary";
                } else if (item.status === "Placed") {
                  statusColor = "text-info";
                } else if (item.status === "Active") {
                  statusColor = "text-success";
                }

                return (
                  <tr key={item._id}>
                    <td>{item.studentID}</td>
                    <td>{item.name}</td>
                    <td>{item.department}</td>
                    <td>{item.email}</td>
                    <td className={item.blocked ? "text-danger" : statusColor}>
                      {item.blocked ? "Blocked" : item.status}
                    </td>
                    <td className="text-center text-dark">
                      {item.loading ? (
                        <LoadingButton
                          className={item.blocked ? "bg-success" : "bg-danger"}
                          size="sm"
                        />
                      ) : (
                        <Button
                          className={item.blocked ? "bg-success" : "bg-danger"}
                          onClick={changeStatus}
                        >
                          {item.blocked ? "Unblock" : "Block"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Pagination
            page={page}
            total={total}
            limit={limit}
            setPage={setPage}
            next={next}
            prev={prev}
          />
        </>
      ) : (
        <div>
          <h5 className="text-center">
            No Datas Available Here! Try Adding Students
          </h5>
        </div>
      )) }
    </div>
  );
}

export default UserList;
