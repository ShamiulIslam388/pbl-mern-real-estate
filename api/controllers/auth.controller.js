const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const SignUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      username,
      email,
      password: hashPassword,
    });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { SignUp };
