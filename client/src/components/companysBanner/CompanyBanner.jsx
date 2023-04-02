import React from "react";
import "./CompanyBanner.css";

function CompanyBanner() {
  return (
    <>
      <div className="bannerDiv companyBannerdiv">
      <div data-aos="zoom-in-up" >
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
          <button className="bannercompaniesbtn">View Companies</button>
        </div>
       
      </div>
    </>
  );
}
export default CompanyBanner;
