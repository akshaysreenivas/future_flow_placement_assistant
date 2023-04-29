import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getCandidateProfile } from '../../services/hrServices';
import { toast } from 'react-toastify';

function UserProfileView() {
    const [state, setState] = useState();
    const { userid } = useParams();
    useEffect(() => {
      getCandidateProfile(userid)
      .then((data) => {
        if(data.status){
            setState(data.result);
        }else{
            toast.error("Something Went Wrong");
        }
      })
      .catch((error) => {
        toast.error("Something Went Wrong");
      });
    }, [userid])
  return (
    <>
    {state ? <>
        <div>UserProfileView</div>
        </>:"couldn't find profile"}
   
    </>
  )
}

export default UserProfileView