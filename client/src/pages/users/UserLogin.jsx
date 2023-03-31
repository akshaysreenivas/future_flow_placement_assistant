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
    <Login role={"Student"} url={"https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg?size=626&ext=jpg&ga=GA1.2.1478787354.1678959639&semt=ais"} />
  )
}

export default UserLogin