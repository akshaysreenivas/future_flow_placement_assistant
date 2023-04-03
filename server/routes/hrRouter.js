const {login, addjob, getAllJobPosts,changeJobStatus} = require("../controllers/hrController");
const hrAuth = require("../middlewares/hrAuth");

const router = require("express").Router();


router.post("/login",login);
router.post("/addJob",hrAuth,addjob);
router.post("/getJobs",hrAuth,getAllJobPosts);
router.post("/changeJobStatus",hrAuth,changeJobStatus);

module.exports = router;