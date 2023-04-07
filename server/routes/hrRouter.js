const router = require("express").Router();

// import controllers 
const { login, addjob, getAllJobPosts, changeJobStatus, JobDetails } = require("../controllers/hrController");

// import middlewares 
const hrAuth = require("../middlewares/hrAuth");
const upload = require("../middlewares/multer");

// API MIDDLEWARES..

// login 
router.post("/login", login);

// adding jobs 
router.post("/addJob", hrAuth,upload.single("image"), addjob);

// fetch all jobs 
router.get("/getJobs", hrAuth, getAllJobPosts);

// fetch single job details 
router.get("/getJobs/getdetails/:id", hrAuth, JobDetails);

// changing job status 
router.put("/changeJobStatus", hrAuth, changeJobStatus);

module.exports = router;