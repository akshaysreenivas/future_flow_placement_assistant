import React from "react";

function SkillsView({ skills }) {
  return (
    <div className="bg-white custom-box-Shadow my-3 p-3 px-5">
      <div className="d-flex gap-2 my-3 align-items-center">
        <img
          className=" mx-1 border-1"
          src="/creativity.png"
          width={30}
          alt=""
        />
        <h3>Skills</h3>
      </div>
      {skills?.length ? (
        <div className="row   row-cols-md-1 row-cols-lg-2">
          {skills.map((item) => {
            return (
              <div
              key={item._id}
                className="single_skill_div  px-3 py-2  rounded col"
              >
                <div>
                  <h4>{item.name}</h4>
                  <small>{item.level}</small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default SkillsView;
