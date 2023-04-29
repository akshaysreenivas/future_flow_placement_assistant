import React from "react";

function SkillsView({ skills }) {
  return (
    <div className='bg-white custom-box-Shadow m-2 p-3 px-5'>
    <h2>Skills</h2>
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
