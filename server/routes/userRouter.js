const router = require("express").Router();

// import controllers 
const { JobDetails } = require("../controllers/jobsController");
const { login, Jobs, appliedJobs, applyJob, cancelJobApplication, addBasicInfo, changePassword, addCertifications, addEducation, addSkills, addProjects, addAttachments, addExperiences, updateProfilePhoto, updateCoverPhoto, getUserProfile, } = require("../controllers/userController");
const upload = require("../middlewares/multer");


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

// fetching already applied jobs  
router.get("/getUserDetails",userAuth, getUserProfile);

// fetching already applied jobs  
router.get("/appliedJobs", appliedJobs);

// adding basic information 
router.post("/basicInfo", addBasicInfo);

// updating password 
router.post("/changePassword", changePassword);

// adding Certifications
router.post("/addCertifications", addCertifications);

// adding education history 
router.post("/addEducation", addEducation);

// adding users skills 
router.post("/addSkills", addSkills);

// adding projects by user 
router.post("/addProjects", addProjects);

// adding experience  
router.post("/addExperiences", addExperiences);


// adding attachments like resume and othey certificates 
router.post("/addAttachments",upload.single("file") ,addAttachments);


// adding profile pic  
router.post("/addProfilePhoto",userAuth,upload.single("profile"), updateProfilePhoto);

// adding cover pic 
router.post("/addCoverPhoto",userAuth,upload.single("cover"), updateCoverPhoto);



module.exports = router;