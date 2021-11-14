const express = require('express');
const app = express();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const secret = 'LC_Project_secret';  //自定义密匙
const path = require('path'); //系统路径模块
const fs = require("fs")//文件模块
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const connection = mysql.createConnection({
    host:'127.0.0.1',
    port:'3306',
    user: 'root',
    password: 'root',     // 改成你自己的密码
    database: 'backserver'    // 改成你的数据库名称
});

connection.connect();

// 下面是解决跨域请求问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
 });

// 这里就是主要要修改的地方，其实也就一行
// 把 address 改成你自己定的地址，就是连接访问的那个地址
// app.get('/user',function(req,res){
//     const sql = 'select * from user'; // 写你需要的sql代码
//     connection.query(sql,function(err,result){
//         if(err){
//             console.log('[SELECT ERROR] - ', err.message);
//             return;
//         }
//         // result内放的就是返回的数据，res是api传数据
//         // 返回的数据需要转换成JSON格式
//         console.log(result)
//         res.json(result); 
//     }); 
// })  

//登录请求接口
app.post('/user', function(req,res){
    let username = req.body.name
    let password = req.body.pwd
	const sql = 'select * from user where name = ?'
    connection.query(sql,username,(err,result)=>{
        console.log(err,result)
        console.log(username)
        if(!result.length){
            return res.json({ status: 0, msg: '登录失败' })
        }else{
            // [ RowDataPacket { password: '123', username: 'admin', id: 1 } ]
            if(result[0].pwd==password){
                // 3. 生成token
			const token = jwt.sign(Object.assign({},  result[0]), secret, {
			    expiresIn:  60 * 60 * 2 // 过期时间
			})
                return res.json({name: result[0].name,id:result[0].id ,status: 1, msg: '登录成功' ,token})
            }
            return res.json({ status: 2, msg: '密码错误' })
        }
    })
})



//菜单请求接口
app.get('/menus',function(err,res){
        //console.log(req.body); //获取请求参数
	
        var file = path.join(__dirname, './public/dataMock/leftMenu.json'); //文件路径，__dirname为当前运行js文件的目录
        //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径
	
	//读取json文件
    fs.readFile(file, 'utf-8', function(err, data) {
        console.log(data)

        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
    });

})

var server = app.listen(3000, '127.0.0.1', function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("地址为 http://%s:%s", host, port);
})
