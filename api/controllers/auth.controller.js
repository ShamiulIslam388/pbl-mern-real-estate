const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");

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

const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(401, "Invalid Credentials"));
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return next(errorHandler(401, "Invalid Credentials"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: pass, ...userWithoutPassword } = user._doc;

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

const Google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password: pass, ...userWithoutPassword } = user._doc;

      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(userWithoutPassword);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const user = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password: pass, ...userWithoutPassword } = user._doc;

      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(userWithoutPassword);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { SignUp, SignIn, Google };
