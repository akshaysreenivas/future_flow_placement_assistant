import React from "react";
import "./BasicInfo.css";
import { useSelector } from "react-redux";
import Loading from "../loading/Loading";
import ChangePassword from "../changePassword/ChangePassword";
import AddBasicInfo from "../addBasicInfo/AddBasicInfo";

function BasicInfo() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="bg-white">
      <div className=" p-1 d-flex align-items-center justify-content-between">
        <h3>
          <img
            className="mx-2 border-black rounded-circle"
            src="user_default.avif"
            width={25}
            alt=""
          />
          Basic Information
        </h3>
        <AddBasicInfo />
      </div>
      {user ? (
        <div className="basicInfo">
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
              <p>
                {user.location && user.location.district && user.location.state ?  user.location.district  + "," + user.location.state 
                  : "Add Address to view here"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center py-5">
          <Loading />
        </div>
      )}

      <ChangePassword />
    </div>
  );
}

export default BasicInfo;
