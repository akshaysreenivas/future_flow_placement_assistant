import React, { useEffect } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token  || token ==="undefined") return navigate("/");
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("userAuthToken");
    return navigate("/login");
  };
  return (
    <div>
      <nav>
        <RiLogoutCircleRLine
          className="logout_btn"
          size={25}
          onClick={handleLogout}
        />
      </nav>
      <h1>Home Page</h1>
    </div>
  );
}

export default HomePage;
