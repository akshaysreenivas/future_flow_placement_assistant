import React from 'react'

function EducationView({education}) {
  return (
    <div className='bg-white custom-box-Shadow my-2 p-3 px-5'>
    <h2>Education</h2>
     {education?.length ? (
          education.map((item) => {
            return (
              <div
                key={item._id}
                className="d-flex px-1 justify-content-between align-items-start"
              >
                <li>
                  <h3>{item.institution}</h3>
                  <p>
                    {item.startDate} - {item.endDate}
                  </p>
                  <p>{item.degree}</p>
                  <p>{item.fieldofStudy}</p>
                </li>
              </div>
            );
          })):""}
          </div>
  )
}

export default EducationView