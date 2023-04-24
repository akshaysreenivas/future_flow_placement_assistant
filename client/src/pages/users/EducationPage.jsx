import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Education from "../../components/education/Education";
import ProfileHeader from "../../components/profileheader/ProfileHeader";
import Sidenav from "../../components/profileSidenav/Sidenav";
import UserNavBar from "../../components/userNavbar/UserNavBar";

function EducationPage() {
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
      <Education />
    </div>
  );
}

export default EducationPage;
