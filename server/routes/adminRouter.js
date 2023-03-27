const router = require("express").Router();

// import controllers 
const { login,addUsers, addHrManager } = require("../controllers/adminController");

// import middlewares 
const verifyAdmin=require("../middlewares/adminAuth");

// api routes   
router.post("/login", login);
router.post("/",verifyAdmin, login);
router.post("/addUsers",verifyAdmin, addUsers);
router.post("/addHrManagers",verifyAdmin,addHrManager);



module.exports = router;