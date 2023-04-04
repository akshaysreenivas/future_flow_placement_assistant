const router = require("express").Router();

// import controllers 
const { login, addStudents, addHrManager, getAllStudents, getHRManagers, changeUserStatus, changeHRStatus } = require("../controllers/adminController");

// import middlewares 
const verifyAdmin = require("../middlewares/adminAuth");


// API MIDDLEWARES..

// login 
router.post("/login", login);

// adding users 
router.post("/addUsers", verifyAdmin, addStudents);

// adding HR managers 
router.post("/addHrManagers", verifyAdmin, addHrManager);

// fetch all students 
router.get("/allStudents", verifyAdmin, getAllStudents);

// fetch all HR managers
router.get("/allHRManagers", verifyAdmin, getHRManagers);

// Changeing User status 
router.patch("/ChangeUserStatus", verifyAdmin, changeUserStatus);

// changing HR Status 
router.patch("/ChangeHRStatus", verifyAdmin, changeHRStatus);




module.exports = router;