import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../../components/userNavbar/UserNavBar";
import WelcomeBanner from "../../components/welcomeBanner/WelcomeBanner";
import CompanyBanner from "../../components/companysBanner/CompanyBanner";


function HomePage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/");
  }, [navigate, user]);

  return (
    <div className="user_page">
      <UserNavBar user={true} />
      <div className="bg-white">
      <WelcomeBanner />
      <CompanyBanner />
      </div>
    </div>
  );
}

export default HomePage;
