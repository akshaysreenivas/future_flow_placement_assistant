const router = require("express").Router();

// import controllers 
const { login, addjob, getAllJobPosts,editJob, changeJobStatus } = require("../controllers/hrController");
const { JobDetails } = require("../controllers/jobsController");

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

// edit job details 
router.put("/editJobdetails/:id", hrAuth,upload.single("image"), editJob);

// changing job status 
router.patch("/changeJobStatus", hrAuth, changeJobStatus);

module.exports = router;