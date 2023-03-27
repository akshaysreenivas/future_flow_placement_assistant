const { signup, otpVerification, createAccount, login } = require("../controllers/userController");

const router = require("express").Router();

router.post("/signup",signup);
router.post("/submitOtp",otpVerification);
router.post("/createPassword",createAccount);
router.post("/login",login);

module.exports = router;