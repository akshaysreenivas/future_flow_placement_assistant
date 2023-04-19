import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Alerts from "../../components/alert/Alert";
import UserNavBar from "../../components/userNavbar/UserNavBar";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/");
  }, [navigate, user]);

  return (
    <div className="user_page">
      {user?.firstLogin && <Alerts data={user.name} />}

      <UserNavBar user={true} />

      <h1 className="px-5">Home Page</h1>
    </div>
  );
}

export default HomePage;
