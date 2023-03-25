const router = require("express").Router();

// import controllers 
const { login,addUsers } = require("../controllers/adminController");

// import middlewares 
const verifyAdmin=require("../middlewares/adminAuth");

// api routes   
router.post("/login", login);
router.post("/",verifyAdmin, login);
router.post("/addUsers",verifyAdmin, addUsers);
// router.post("/addHrManager",verifyAdmin, addHr);



module.exports = router;