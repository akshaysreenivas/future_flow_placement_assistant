import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { changeHRStatus, getHRManagers } from "../../services/adminServices";
import LoadingButton from "../loadingButton/LoadingButton";
import SearchBar from "../searchBar/SearchBar";
import Pagination from "../pagination/Pagination";
import Loading from "../loading/Loading";

function HRList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [hiring, setHiring] = useState("");
  const [total, setTotal] = useState();
  const [limit, setLimit] = useState();
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHRManagers(hiring, search, page)
      .then((data) => {
        const d = data.result;
        setUsers(d.map((user) => ({ ...user, loading: false })));
        setPage(data.page);
        setNext(data.next);
        setPrev(data.previous);
        setTotal(data.total);
        setLimit(data.limit);
      })
      .catch((error) => {
        toast.error("Something Went Wrong", { position: "top-center" });
      }).finally(()=> setLoading(false));
  }, [hiring, search, page]);

  // handling reseting the filterations
  const handleReset = () => {
    setSearch("");
    setHiring("");
    setPage(1);
  };
  return (
    <div className="table_div">
      <h2>HR Managers</h2>
      <div>
        <SearchBar
          value={search}
          placeholder={"Search by Name , Company or gmail"}
          setSearch={setSearch}
        />
        <div className="filter_div my-3">
          <Form.Select size="sm" value={hiring} onChange={(e)=>setHiring(e.target.value) } name="sort" className="">
            <option value="" defaultChecked >
              Filter by Status
            </option>
            <option value={true}>Hiring </option>
            <option value={false}>Not Hiring</option>
          </Form.Select>

          <Button onClick={handleReset}>reset</Button>
        </div>
      </div>
      { loading ?( <div className="d-flex justify-content-center mx-auto my-5">
      <Loading />
    </div>) :
     ( users.length ? (
        <>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
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
                    <td>{item.name}</td>
                    <td>{item.company}</td>
                    <td>{item.email}</td>
                    <td className={item.blocked ? "text-danger" : statusColor}>
                      {item.blocked
                        ? "Blocked"
                        : item.active
                        ? "Hiring"
                        : "Not Hiring"}
                    </td>
                    <td className="text-center text-dark">
                      {item.loading ? (
                        <LoadingButton
                          size="sm"
                          className={item.blocked ? "bg-success" : "bg-danger"}
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
            No Datas Available Here! Try Adding HR Managers
          </h5>
        </div>
      ))
       }
    </div>
  );
}

export default HRList;
