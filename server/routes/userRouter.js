const { signup, otpVerification } = require("../controllers/userController");

const router = require("express").Router();

router.post("/signup",signup);
router.post("/submitOtp",otpVerification);

module.exports = router;