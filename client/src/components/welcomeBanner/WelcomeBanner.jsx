import React from "react";
import { useNavigate } from "react-router";
import "./WelcomeBanner.css";
import { Link } from 'react-router-dom';

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
          Get your dream job with our advanced networking and modern career tools. Achieve your career goals with ease by building an attractive profile that will grab the attention of employers. 
          </p>
           <Link to="/profile" className="text-decoration-none">
           <button className="bannerGetStartedbtn">Get Started</button>
           </Link>
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
