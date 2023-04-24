import React from "react";
import { FaEdit } from "react-icons/fa";
import "./BasicInfo.css";
import { useSelector } from 'react-redux';
import Loading from "../loading/Loading";

function BasicInfo() {
    const { user } = useSelector((state) => state.user);

  return (
    <div className="bg-white">
    <div className=" p-1 d-flex align-items-center justify-content-between">
    <h5>Basic Information</h5>
    <FaEdit/>
    </div>
     {user ?  <div className="basicInfo">
        <div>
          <div className="info">
            <span>Email Address</span>
            <p> {user.email}</p>
          </div>
          <div className="info">
            <span>Phone Number</span>
            <p> {user.phone ?? "Add your Mobile Number"}</p>
          </div>
          <div className="info">
            <span>Personnel Website</span>
            <p> {user.website ?? "Add Personel website"} </p>
          </div>
        </div>
        <div>
          <div className="info">
            <span>Gender</span>
            <p>{user.gender}</p>
          </div>
          <div className="info">
            <span>Address</span>
            <p>{user.address ?? "Add Address to view here"}</p>
          </div>
        </div>
      </div> :<div className="d-flex align-items-center justify-content-center py-5"> <Loading/></div> }
    </div>
  );
}

export default BasicInfo;
