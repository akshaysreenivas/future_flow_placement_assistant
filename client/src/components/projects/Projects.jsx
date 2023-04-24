import React from 'react'

function Projects() {
    const handleClick=()=>{
        alert("clicked")
    }
  return (
      <div>
      <div onClick={handleClick}>hiiiiiiia</div>
    </div>
    )
}

export default Projects