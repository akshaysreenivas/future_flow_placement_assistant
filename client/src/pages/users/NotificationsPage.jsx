import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserNavBar from "../../components/userNavbar/UserNavBar";
import Notifications from "../../components/notifications/Notifications";

function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/login");
  }, [navigate, user]);

  return (
    <div className='user_page'>
    <UserNavBar user={true}/>
      <div className="user_page  d-flex  justify-content-center">  
          <Notifications/>
      </div>
    </div>
  );
}

export default NotificationsPage;
