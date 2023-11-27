const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database..."))
  .catch((err) => console.log(err));

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", require("./routes/user.route"));
app.use("/api/auth", require("./routes/auth.route"));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
