import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../../components/userNavbar/UserNavBar";


function HomePage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/");
  }, [navigate, user]);

  return (
    <div className="user_page">
      <UserNavBar user={true} />
      <div className="bg-white">
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>
      <h1 className="px-5"> Home Page gkgkjgj ggkgkgjjgc gfffhjfhyfyfyfyy hgghdggdgdg jfjffhfhjjh jdfgdu </h1>  
      </div>
    </div>
  );
}

export default HomePage;
