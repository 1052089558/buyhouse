const { DataTypes } = require("sequelize");

const db = require("../mysql");

// 定义model
const Users = db.define("users", {
  // primaryKey:是否为主键 allowNull是否允许为空  autoIncrement 是否 自增
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  username: { type: DataTypes.STRING(255), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

module.exports = Users;
