const router = require("express").Router();

// import controllers 
const { login } = require("../controllers/userController");

// API MIDDLEWARES..

// Login 
router.post("/login", login);


module.exports = router;