import React from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import SearchBar from '../searchBar/SearchBar'

function ProfileHeader({setDisplay,user}) {
    const handleClick=()=>{
        setDisplay(true)
    }
  return (
    <div className='d-flex justify-content-between px-3'>
    <SearchBar/>
    <div>{user} <MdKeyboardArrowDown/> </div>
    <span onClick={handleClick}> &#9776; open</span>
    </div>
  )
}

export default ProfileHeader