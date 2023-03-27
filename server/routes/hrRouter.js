const { signup, login, createAccount, otpVerification } = require("../controllers/hrController");

const router = require("express").Router();

router.post("/signup",signup);
router.post("/otpVerification",otpVerification);
router.post("/createPassword",createAccount);
router.post("/login",login);

module.exports = router;