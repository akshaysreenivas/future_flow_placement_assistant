import React from "react";
import { useNavigate } from "react-router";
import "./WelcomeBanner.css";

function WelcomeBanner() {
  const navigate = useNavigate()
  return (
    <>
      <div className="bannerDiv">
        <div className="bannerCaptionDiv">
          <h1>
            <span className="text-uppercase">Welcome !</span> To Your
            Ultimate Job Placement Assistant
          </h1>
          <p>
            Get your dream job with our networking and modern career tools.
            Achieve your goals with us
          </p>
          <button onClick={()=> navigate("/login")} className="bannerGetStartedbtn">Get Started</button>
        </div>
       <div>
       <img
       className="img-fluid"
       src="./banner1.avif"
       alt="First slide"
       />
       </div>
      </div>
    </>
  );
}
export default WelcomeBanner;
