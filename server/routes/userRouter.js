const router = require("express").Router();

// import controllers 
const { JobDetails } = require("../controllers/jobsController");
const { login, Jobs, appliedJobs, applyJob, cancelJobApplication, addBasicInfo, changePassword,
    addCertifications, addEducation, addSkills, addProjects, addAttachments, addExperiences, updateProfilePhoto,
    updateCoverPhoto, getUserProfile, deleteExperience, deleteCertification, deleteSkill, deleteProject, deleteAttachment, deleteEducation, editExperience, editSkill, editCertification, editEducation, editProject, getNotifications, ClearNotification, markAsRead } = require("../controllers/userController");
const {imageUpload,documentUpload} = require("../middlewares/multer");


//  MIDDLEWARES..
const userAuth = require("../middlewares/userAuth");


// Login 
router.post("/login", login);

// fetching all jobs   
router.get("/getJobs", userAuth, Jobs);

// get a single job details
router.get("/getJob/:id", userAuth, JobDetails);

// applying for the job   
router.post("/applyforJob/:id", userAuth, applyJob);

// canceling the job application  
router.post("/cancelJobapplication/:id", userAuth, cancelJobApplication);

// fetching user details 
router.get("/getUserDetails", userAuth, getUserProfile);

// fetching already applied jobs  
router.get("/appliedJobs", userAuth, appliedJobs);

// adding basic information 
router.post("/basicInfo", userAuth, addBasicInfo);

// updating password 
router.put("/changePassword", userAuth, changePassword);

// adding Certifications
router.post("/addCertifications", userAuth, addCertifications);

// delete Certification
router.delete("/deleteCertification/:id", userAuth, deleteCertification);

// editing Certification
router.patch("/editCertification/:id", userAuth, editCertification);

// adding education history 
router.post("/addEducation", userAuth, addEducation);

// delete education history 
router.delete("/deleteEducation/:id", userAuth, deleteEducation);

// editing education history 
router.patch("/editEducation/:id", userAuth, editEducation);

// adding users skills 
router.post("/addSkills", userAuth, addSkills);

// delete users skills 
router.delete("/deleteSkill/:id", userAuth, deleteSkill);

// editing users skills 
router.patch("/editSkill/:id", userAuth,editSkill);

// adding projects by user 
router.post("/addProjects", userAuth, addProjects);

// delete projects by user 
router.delete("/deleteProject/:id", userAuth, deleteProject);

// edit projects by user 
router.patch("/editProject/:id", userAuth, editProject);

// adding experience  
router.post("/addExperiences", userAuth, addExperiences);

// delete experience  
router.delete("/deleteExperience/:id", userAuth, deleteExperience);

// edit experience  
router.patch("/editExperience/:id", userAuth, editExperience);

// adding attachments like resume and othey certificates 
router.post("/addAttachments", userAuth,documentUpload.single("file"), addAttachments);

// deleting attachments
router.delete("/deleteAttachment/:id", userAuth, deleteAttachment);

// adding profile pic  
router.post("/addProfilePhoto", userAuth, imageUpload.single("image"), updateProfilePhoto);

// adding cover pic 
router.post("/addCoverPhoto", userAuth, imageUpload.single("image"), updateCoverPhoto);

// fetching notifications 
router.get("/getNotifications", userAuth,  getNotifications);

// fetching notifications 
router.delete("/clearNotification/:id", userAuth,  ClearNotification);

// marking as read 
router.patch("/markAsRead", userAuth,  markAsRead);


module.exports = router;