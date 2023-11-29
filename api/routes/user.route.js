const express = require("express");
const {
  updateUser,
  deleteUser,
  getUserListing,
} = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListing);

module.exports = router;
