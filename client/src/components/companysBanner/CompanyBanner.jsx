import React from "react";
import "./CompanyBanner.css";
import { Link } from 'react-router-dom';

function CompanyBanner() {
  return (
    <>
      <div className="bannerDiv companyBannerdiv">
      <div  >
      <img
      className="img-fluid"
      src="/welcomebannerimg.avif"
      alt="First slide"
      />
      </div>
        <div className="bannerCaptionDiv">
          <h1>
          Platform for Connecting with the 
            <span className="text-uppercase"> future</span> 
          </h1>
          <p>
          A simple glance at your showcased projects will connect you directly with startups and top-notch companies.
          </p>
           <Link to="/jobs" className="text-decoration-none">
           <button className="bannercompaniesbtn">View Jobs</button>
           </Link>
        </div>
       
      </div>
    </>
  );
}
export default CompanyBanner;
