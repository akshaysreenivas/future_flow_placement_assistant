import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidenav from "../../components/profileSidenav/Sidenav";
import UserNavBar from "../../components/userNavbar/UserNavBar";
import { getUserDetails } from "../../services/userServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";

import EditProfilePhoto from "../../components/editProfilePic/EditProfilePhoto";
import EditCoverPhoto from "../../components/editCoverPic/EditCoverPhoto";
function ProfilePage() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [oldProfileImg, setOldProfileImg] = useState();
  const [oldCoverImg, setOldCoverImg] = useState();
  const [user, setUser] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/");
    try {
      getUserDetails().then((data) => {
        if (data.status) {
          const userDetails = data.user;
          dispatch(setUserDetails(userDetails));
          setUser(userDetails);
          const pic = userDetails?.profilePicUrl
            ? process.env.REACT_APP_BASE_URL + userDetails.profilePicUrl
            : "default_profile_pic.avif";

          const coverPhoto = userDetails?.coverPicUrl
            ? process.env.REACT_APP_BASE_URL + userDetails.coverPicUrl
            : "default_cover_photo.png";
          setProfilePic(pic);
          setCoverPic(coverPhoto);
          setOldProfileImg(userDetails.profilePicUrl);
          setOldCoverImg(userDetails.coverPicUrl);
        } else {
          toast.error(data.message + "hi", { autoClose: 1000 });
        }
      });
    } catch (error) {
      toast.error("Something Went Wrong");
    }
    // eslint-disable-next-line
  }, [navigate]);


  return (
    <div className="user_page">
      <UserNavBar user={true} />
      <div className="user_profile_page">
        <div className="profile_images ">
          <div
            className="cover_img_div"
            style={{
              background: `url(${coverPic}) no-repeat center center/cover`,
              height: "250px",
              width: "100%",
            }}
          >
            <div className="edit_cover">
              <span>
                <EditCoverPhoto
                  coverPic={coverPic}
                  oldCoverImg={oldCoverImg}
                  setOldCoverImg={setOldCoverImg}
                  setCoverPic={setCoverPic}
                />
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between px-3">
            <div className="d-flex">
              <EditProfilePhoto
                profilePic={profilePic}
                setOldProfileImg={setOldProfileImg}
                oldProfileImg={oldProfileImg}
                setProfilePic={setProfilePic}
              />
              <h3>{user?.name}</h3>
            </div>
          </div>
        </div>
        <div className="px-3 contents_profile">
          <Sidenav display={display} setDisplay={setDisplay} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
