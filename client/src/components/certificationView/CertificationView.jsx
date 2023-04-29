import React from 'react'

function CertificationView({certifications}) {
  return (
    <div className='bg-white custom-box-Shadow rounded px-5 p-3 m-2'>
    <h3>Certification</h3>
     {certifications?.length ? (
        certifications.map((item) => {
          
          return (
            <div  key={item._id}  className="single-exp-div p-3 border rounded m-1 border-secondary border-1">
              <div className="d-flex align-items-center justify-content-between">
                <h4>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </h4>
              </div>
              <p className="text-secondary lead">{item.issuingOrganization}</p>
              <p className="text-muted">
                <small>issued {item.date}</small>
              </p>
            </div>
          );
        })):""}
        </div>
  )
}

export default CertificationView