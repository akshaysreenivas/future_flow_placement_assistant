import React from 'react'

function AttachmentView({attachments}) {
  return (
    <div className='bg-white p-3 my-3 px-5'>
    <div className="d-flex gap-2 my-3 align-items-center">
    <img className="mx-2 border-1" src="/link.png" width={30} alt="" />
        <h3>
          Attachments
        </h3>

      </div>
    {attachments?.length ? (
        attachments.map((item) => {
          return (
            <div
              key={item._id}
              className="single-exp-div p-2 border rounded my-3 border-secondary border-1"
            >
              <div className="d-flex align-items-center justify-content-between">
                <img src="/pdf.avif" width={50} alt="" />
                <h5>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </h5>
                <a href={process.env.REACT_APP_BASE_URL+"/"+item.url} target="_blank" rel="noopener noreferrer">
                    <button className="rounded px-2 bg-info  border-0 text-white ">
                      view
                    </button>
                  </a>
               
              </div>
            </div>
          );
        })):""}
        </div>
      )
  
}

export default AttachmentView