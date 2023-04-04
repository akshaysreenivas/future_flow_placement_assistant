const router = require("express").Router();

// import controllers 
const { login, addjob, getAllJobPosts, changeJobStatus } = require("../controllers/hrController");

// import middlewares 
const hrAuth = require("../middlewares/hrAuth");

// API MIDDLEWARES..

// login 
router.post("/login", login);

// adding jobs 
router.post("/addJob", hrAuth, addjob);

// fetch  jobs 
router.post("/getJobs", hrAuth, getAllJobPosts);

// changing job status 
router.post("/changeJobStatus", hrAuth, changeJobStatus);

module.exports = router;