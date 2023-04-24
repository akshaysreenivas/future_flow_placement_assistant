import React, { useEffect, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Attachments from "../../components/attachment/Attachments";
import ProfileHeader from "../../components/profileheader/ProfileHeader";
import Sidenav from "../../components/profileSidenav/Sidenav";
import UserNavBar from "../../components/userNavbar/UserNavBar";

function AttachmentPage() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState(false);
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/");
  }, [navigate, user]);

  return (
    <div className="user_page">
      <UserNavBar user={true} />
      <ProfileHeader setDisplay={setDisplay} display={display} />
      <Sidenav display={display} setDisplay={setDisplay} />
      <GrAttachment />
      <Attachments/>
    </div>
  );
}

export default AttachmentPage;
