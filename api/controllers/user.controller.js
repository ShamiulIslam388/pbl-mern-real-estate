const updateUser = (req, res) => {
  res.json(req.user);
};

module.exports = { updateUser };
