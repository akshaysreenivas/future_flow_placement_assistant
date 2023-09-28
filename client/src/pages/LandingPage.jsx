import React,{useEffect} from "react";
import { useNavigate } from "react-router";
// importing aos
import WelcomeBanner from "../components/welcomeBanner/WelcomeBanner";
import CompanyBanner from "../components/companysBanner/CompanyBanner";
import AOS from 'aos';
import 'aos/dist/aos.css';
import UserNavBar from "../components/userNavbar/UserNavBar";

function LandingPage() {
  useEffect(() => {
    AOS.init();
  }, [])
  return (
    <>
     <UserNavBar/>
      <WelcomeBanner />
      <CompanyBanner />
    </>
  );
}
export default LandingPage;