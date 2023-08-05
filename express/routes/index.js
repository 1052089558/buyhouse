var express = require("express");
var router = express.Router();
const users = require("./users");
/* GET home page. */
router.get("/", users.userlist);
module.exports = router;
