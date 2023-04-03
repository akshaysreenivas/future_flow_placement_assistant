import React,{useEffect} from "react";
import { useNavigate } from "react-router";
// importing aos
import TopNavbar from "../components/landingpageNavbar/Navbar";
import WelcomeBanner from "../components/welcomeBanner/WelcomeBanner";
import CompanyBanner from "../components/companysBanner/CompanyBanner";
import ChallengesBanner from "../components/challengesBanner/ChallengesBanner";
import AOS from 'aos';
import 'aos/dist/aos.css';

function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (token  && token !=="undefined") return navigate("/home");
    AOS.init();
  }, [navigate])
  return (
    <>
      <TopNavbar />
      <WelcomeBanner />
      <CompanyBanner />
      <ChallengesBanner  />
    </>
  );
}
export default LandingPage;