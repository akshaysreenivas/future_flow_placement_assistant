const router = require("express").Router();

// import controllers 
const { login,addStudents, addHrManager, getAllStudents, getHRManagers ,changeUserStatus,changeHRStatus} = require("../controllers/adminController");

// import middlewares 
const verifyAdmin=require("../middlewares/adminAuth");

// api routes   
router.post("/login", login);
router.post("/",verifyAdmin, login);
router.post("/addUsers",verifyAdmin, addStudents);
router.post("/addHrManagers",verifyAdmin,addHrManager);
router.get("/allStudents",verifyAdmin,getAllStudents);
router.get("/allHRManagers",verifyAdmin,getHRManagers);
router.patch("/ChangeUserStatus",verifyAdmin,changeUserStatus);
router.patch("/ChangeHRStatus",verifyAdmin,changeHRStatus);

 

module.exports = router;