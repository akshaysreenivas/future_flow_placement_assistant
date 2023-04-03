import React from "react";
import "./ChallengesBanner.css";

function ChallengesBanner() {
  return (
    <>
      <div className="bannerDiv">
        <div className="bannerCaptionDiv challengescaptionDiv">
          <h1>
            Want to Stand Out?
            <br />
            Level Up Your Profile By Participating In
            <span className="text-uppercase "> Challenges</span>
          </h1>
          <p>
            Get your dream job with our networking and modern career tools.
            Achieve your goals with us
          </p>
          
          <button  className="bannerChellengesbtn">View Challenges</button>
        
        </div>
        <div data-aos="fade-up">
          <img
            className="img-fluid"
            src="./banner2.avif"
            alt="First slide"
          />
        </div>
      </div>
    </>
  );
}
export default ChallengesBanner;
