const router = require("express").Router();

// import controllers 
const { login, Jobs } = require("../controllers/userController");

// API MIDDLEWARES..
const userAuth = require("../middlewares/userAuth");

// Login 
router.post("/login", login);

// fetching all jobs   
router.get("/getJobs", userAuth, Jobs);


module.exports = router;