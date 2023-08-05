var Sequelize = require("sequelize");

// 实例化数据库对象
var sequelize = new Sequelize("buyhouse", "root", "123456", {
  host: "localhost",
  // 数据库类型
  dialect: "mysql",
  // 是否打印日志
  logging: true,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  // 禁用所有时间戳开启
  define: {
    timestamps: false,
  },
  // 市区设置
  timezone: "+08:00",
});
module.exports = sequelize;
