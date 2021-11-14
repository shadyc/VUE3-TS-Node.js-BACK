const express = require('express');
const app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
 });

var mysql = {
    host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'backserver'
}

module.exports = {mysql}