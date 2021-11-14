var express = require('express')
var router = express.Router()
var models = require('./db')
var mysql = require('mysql')
var connection = mysql.createConnection(models.mysql)
connection.connect()

router.get('/user1',function (req,res) {
    console.log("23423432")
    var users = []
    connection.query('select * from users',function (err,result) {
        if (err) throw err
        users = result
        res.end(JSON.stringify(users))
    })
})

router.get('/user/:id',function (req,res) {
    var user = {}
    connection.query('select * from users where id = ' + req.params.id,function (err,result) {
        if (err) throw err
        user = result
        res.end(JSON.stringify(user))
    })
})


module.exports = router