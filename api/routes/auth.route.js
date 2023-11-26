const express = require("express");
const router = express.Router();
const { SignUp } = require("../controllers/auth.controller");

router.post("/signup", SignUp);

module.exports = router;
