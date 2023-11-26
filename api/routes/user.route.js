const express = require("express");
const { Test } = require("../controllers/user.controller");

const router = express.Router();

router.get("/test", Test);

module.exports = router;
