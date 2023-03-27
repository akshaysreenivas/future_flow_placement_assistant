import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Login from '../../components/login/Login'

function UserLogin() {
    const navigate=useNavigate();
    useEffect(() => {
    const token = localStorage.getItem('userAuthToken');
    if (token) return  navigate("/home");
  }, [navigate]);
  return (
    <Login role={"Student"}/>
  )
}

export default UserLogin