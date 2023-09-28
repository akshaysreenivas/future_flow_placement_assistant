import React, { useEffect, useState } from "react";
import UserNavBar from "../../components/userNavbar/UserNavBar";
import WelcomeBanner from "../../components/welcomeBanner/WelcomeBanner";
import CompanyBanner from "../../components/companysBanner/CompanyBanner";
import AOS from "aos";

function HomePage() {
  const [isAuthenticated, setstate] = useState(false);
  useEffect(() => {
    AOS.init();
    const token = localStorage.getItem("userAuthToken");
    if (token) setstate(true);
  }, []);

  return (
    <div className="user_page">
      <UserNavBar user={isAuthenticated} />
      <div className="bg-white">
        <WelcomeBanner />
        <CompanyBanner />
      </div>
    </div>
  );
}

export default HomePage;
