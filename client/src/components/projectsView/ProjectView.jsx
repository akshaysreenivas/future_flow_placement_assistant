import React from 'react'
import { IoIosShareAlt } from 'react-icons/io';

function ProjectView({projects}) {
  return (
    <div className='bg-white custom-box-Shadow my-3 p-3 px-5'>
    <div className="d-flex gap-2 my-3 align-items-center">
    <img
      className="mx-2 border-1"
      src="/content-management.png"
      width={35}
      alt=""
    />
        <h3>
          Projects
        </h3>

      </div>
    {projects?.length ? (
        projects.map((item) => {
       
          return (
            <div  key={item._id}  className="single-exp-div p-3 border-bottom border-secondary border-1">
              <div className="d-flex align-items-center justify-content-between">
                <h4>{item.name}</h4>
              </div>
              <span className="text-muted">
                <small> {item.company}</small>
              </span>
              <p className="text-muted">
                <small>
                  {item.startDate} to {item.endDate}
                </small>
              </p>
              <button className="d-flex bg-primary px-3 py-1 m-1  text-white rounded border-0">
                <a
                  href={`https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  Show Project <IoIosShareAlt />
                </a>
              </button>

              <p className="text-secondary lead">{item.description}</p>
            </div>
          );
        })):""}
      </div>
  )
}

export default ProjectView