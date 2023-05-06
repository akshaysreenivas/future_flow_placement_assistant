const router = require("express").Router();

// import controllers 
const { login, addjob, getAllJobPosts, editJob, changeJobStatus, getCandidates, changeCandidateStatus, changeHRPassword, getHRDashboardDatas } = require("../controllers/hrController");
const { JobDetails } = require("../controllers/jobsController");
const { getUserProfileDetails } = require("../controllers/userController");

// import middlewares 
const hrAuth = require("../middlewares/hrAuth");
const upload = require("../middlewares/multer");

// API MIDDLEWARES..

// login 
router.post("/login", login);

// adding jobs 
router.post("/addJob", hrAuth, upload.imageUpload, addjob);

// fetch all jobs 
router.get("/getJobs", hrAuth, getAllJobPosts);

// fetch single job details 
router.get("/getJobs/getdetails/:id", hrAuth, JobDetails);

// edit job details 
router.put("/editJobdetails/:id", hrAuth, upload.imageUpload, editJob);

// changing job status 
router.patch("/changeJobStatus", hrAuth, changeJobStatus);

// fetching list of candidates for a  job 
router.get("/getCandidates/:id", hrAuth, getCandidates);

// fetching details of a candidate 
router.get("/getCandidateProfile/:id", hrAuth, getUserProfileDetails);

//chnage candidate password
router.patch("/changeCandidateStatus/:id", hrAuth, changeCandidateStatus);

// changing password 
router.put("/changePassword", hrAuth, changeHRPassword);

// fetching dashboard datas
router.get("/getHRDashboardDatas", hrAuth, getHRDashboardDatas);

module.exports = router;