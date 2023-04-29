import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCandidateProfile } from "../../services/hrServices";
import { toast } from "react-toastify";
import "./UserProfileView.css";
import BasicinfoView from "../basicInfoView/BasicinfoView";
import ExperienceView from "../experienceView/ExperienceView";
import EducationView from "../educationView/EducationView";
import CertificationView from "../certificationView/CertificationView";
import SkillsView from "../skillsView/SkillsView";
import ProjectView from "../projectsView/ProjectView";
import AttachmentView from "../attachmentView/AttachmentView";
function UserProfileView() {
  const [state, setState] = useState();
  const [profilePic, setProfilePic] = useState();
  const [coverPic, setCoverPic] = useState();
  const { userid } = useParams();
  useEffect(() => {
    getCandidateProfile(userid)
      .then((data) => {
        if (data.status) {
          setState(data.result);
          const pic = state?.profilePicUrl
            ? process.env.REACT_APP_BASE_URL + state.profilePicUrl
            : "default_profile_pic.avif";
          setProfilePic(pic);
          const coverPhoto = state?.coverPicUrl
            ? process.env.REACT_APP_BASE_URL + state.coverPicUrl
            : "default_cover_photo.png";
          setCoverPic(coverPhoto);
        } else {
          toast.error("Something Went Wrong");
        }
      })
      .catch((error) => {
        toast.error("Something Went Wrong");
      });
    //
  }, [userid]);
  return (
    <>
      {state ? (
        <div className="d-flex align-items-center justify-content-center">
          <div className="profileView">
            <div className="profile_images custom-box-Shadow bg-white">
              <div
                className="cover_img_div"
                style={{
                  background: `url(${coverPic}) no-repeat center center/cover`,
                  height: "250px",
                  width: "100%",
                }}
              ></div>
              <div className="d-flex justify-content-between px-3">
                <div className="d-flex profile_img_div">
                  <img className="profile_img" src={profilePic} alt="" />
                  <h3>{state?.name}</h3>
                </div>
              </div>

              <BasicinfoView user={state} />
            </div>
            <EducationView education={state.education} />
            <SkillsView skills={state.skills} />
            <ExperienceView experience={state.experiences} />
            <CertificationView certifications={state.certifications} />
            <ProjectView projects={state.projects} />
            <AttachmentView attachments={state.attachments} />
          </div>
        </div>
      ) : (
        "couldn't find profile"
      )}
    </>
  );
}

export default UserProfileView;

// UserProfileView
//             <CertificationView />
//             <SkillsView />
//             <ProjectView />
//             <AttachmentView/>
//             <BasicinfoView />

// <ExperienceView />
//             <EducationView />

// UserProfileView
//             <CertificationView />
//             <SkillsView />
//             <ProjectView />
//             <AttachmentView/>
//             <BasicinfoView />

// <ExperienceView />
//             <EducationView />

// UserProfileView
