var express = require("express");
var mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();
dotenv.config({ path: `../.env.local`, override: true });

var app = express();

module.exports = function () {
  var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
  });

  connection.connect(function (err) {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }
    console.log("Connected to database.");
  });

  return connection;
};
