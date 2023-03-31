const {login} = require("../controllers/hrController");

const router = require("express").Router();


router.post("/login",login);

module.exports = router;