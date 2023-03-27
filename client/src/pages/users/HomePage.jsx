import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate=useNavigate ();
    useEffect(() => {
    const token = localStorage.getItem('userAuthToken');
    if (!token) return  navigate("/login");
  }, [navigate]);
  return (
    <div><h1>Home Page</h1></div>
  )
}

export default HomePage