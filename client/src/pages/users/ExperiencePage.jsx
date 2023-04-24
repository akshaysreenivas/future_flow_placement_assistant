import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Experience from "../../components/experience/Experience";
import ProfileHeader from "../../components/profileheader/ProfileHeader";
import Sidenav from "../../components/profileSidenav/Sidenav";
import UserNavBar from "../../components/userNavbar/UserNavBar";

function ExperiencePage() {
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
      <Experience />
    </div>
  );
}

export default ExperiencePage;
