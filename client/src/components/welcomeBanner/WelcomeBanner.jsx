import React from "react";
import "./WelcomeBanner.css";
function WelcomeBanner() {
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
          <button className="bannerGetStartedbtn">Get Started</button>
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
// {/ https://img.freepik.com/free-vector/online-job-interview-concept_23-2148626346.jpg?size=626&ext=jpg&ga=GA1.1.1478787354.1678959639&semt=ais
//https://img.freepik.com/free-vector/man-having-online-job-interview_52683-43379.jpg?size=626&ext=jpg&ga=GA1.1.1478787354.1678959639&semt=sph}
