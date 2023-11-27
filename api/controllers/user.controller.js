const { errorHandler } = require("../utils/error");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const updateUser = async (req, res, next) => {
  let { username, email, password, avatar } = req.body;
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "Unauthorized user"));
    if (password) {
      password = bcrypt.hashSync(password, 10);
    }
    const updateduser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          password,
          avatar,
        },
      },
      { new: true }
    );
    const { password: pass, ...userWithoutPassword } = updateduser._doc;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser };
