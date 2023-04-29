import React from 'react'

function AttachmentView({attachments}) {
  return (
    <div className='bg-white p-3 m-2 px-5'>
    <h2>Attachments</h2>
    {attachments?.length ? (
        attachments.map((item) => {
          return (
            <div
              key={item._id}
              className="single-exp-div p-2 border rounded m-1 border-secondary border-1"
            >
              <div className="d-flex align-items-center justify-content-between">
                <img src="pdf.avif" width={50} alt="" />
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