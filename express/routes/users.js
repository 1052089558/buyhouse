const Users = require("../model/user");
exports.userlist = async (req, res, next) => {
  const users = await Users.findAll();
  res.send({
    data: users,
  });
};
