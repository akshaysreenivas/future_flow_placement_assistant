import React from "react";

function ExperienceView({ experience }) {
  return (
    <div className="bg-white custom-box-Shadow my-3 p-3 px-5">
      <div className="d-flex gap-2 my-3 align-items-center">
        <img className="mx-2 border-1" src="/briefcase.png" width={25} alt="" />
        <h3>Experiences</h3>
      </div>
      {experience?.length
        ? experience.map((item) => {
            return (
              <div
                key={item._id}
                className="single-exp-div p-3 border-bottom border-secondary border-1"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h4>
                    {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                  </h4>
                </div>
                <span className="text-muted">
                  <small> {item.company}</small>
                </span>
                <p className="text-muted">
                  <small>
                    {item.startDate} to {item.endDate}
                  </small>
                </p>
                <p className="text-secondary lead">{item.description}</p>
              </div>
            );
          })
        : ""}
    </div>
  );
}

export default ExperienceView;
