const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database..."))
  .catch((err) => console.log(err));

const app = express();

app.use("/api/user", require("./routes/user.route"));

app.listen(3000, () => console.log("Server is running on port 3000"));
