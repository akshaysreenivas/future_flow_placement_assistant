import React from "react";

function EducationView({ education }) {
  return (
    <div className="bg-white custom-box-Shadow my-3  px-5 p-3">
      <div className="d-flex gap-2 my-3 align-items-center">
        <img
          className="mx-2 border-1"
          src="/education.avif"
          width={25}
          alt=""
        />
        <h3>Education</h3>
      </div>
      {education?.length
        ? education.map((item) => {
            return (
              <div
                key={item._id}
                className="d-flex px-1 justify-content-between align-items-start"
              >
                <li>
                  <h4>{item.institution}</h4>
                  <p>
                    {item.startDate} - {item.endDate}
                  </p>
                  <p>{item.degree}</p>
                  <p>{item.fieldofStudy}</p>
                </li>
              </div>
            );
          })
        : ""}
    </div>
  );
}

export default EducationView;
