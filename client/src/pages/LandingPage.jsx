import React,{useEffect} from "react";
// importing aos
import AOS from 'aos';
import 'aos/dist/aos.css';
import WelcomeBanner from "../components/welcomeBanner/WelcomeBanner";
import TopNavbar from "../components/landingpageNavbar/Navbar";
import CompanyBanner from "../components/companysBanner/CompanyBanner";
import ChallengesBanner from "../components/challengesBanner/ChallengesBanner";

function LandingPage() {
  useEffect(() => {
    AOS.init();
  }, [])
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