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
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',     // 改成你自己的密码
    database: 'backserver',  // 改成你的数据库名称
    multipleStatements: true // 支持执行多条 sql 语句
});

connection.connect();

// 下面是解决跨域请求问题
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
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
app.post('/user', function (req, res) {
    let username = req.body.name
    let password = req.body.pwd
    const sql = 'select * from user where name = ?'
    connection.query(sql, username, (err, result) => {
        console.log(err, result)
        console.log(username)
        if (!result.length) {
            let meta = { status: 0, msg: '登录失败' }
            return res.json(meta)
        } else {
            // [ RowDataPacket { password: '123', username: 'admin', id: 1 } ]
            if (result[0].pwd == password) {
                // 3. 生成token
                const token = jwt.sign(Object.assign({}, result[0]), secret, {
                    expiresIn: 60 * 60 * 2 // 过期时间
                })
                return res.json({ name: result[0].name, id: result[0].id, status: 1, msg: '登录成功', token })
            }
            return res.json({ status: 2, msg: '密码错误' })
        }
    })
})

//获取用户列表接口
app.post('/usersList', function (req, res) {
    let query = req.body.params.query
    let pagenum = Number(req.body.params.pagenum)
    let pagesize = Number(req.body.params.pagesize)
    let start = (pagenum - 1) * pagesize
    let total = null
    const sql = `select * from user where name like '%${query}%' limit ${start},${pagesize}`;
    // const sql = 'select * from user'
    const sql1 = 'select count(*) total from user'
    connection.query(sql1, function (err, result) {
        console.log(result)
        total = result[0]
    });
    connection.query(sql, function (err, result) {
        if (err) {
            let meta = { status: 0, msg: '登录失败' }
            return res.json(meta)
        }
        // result内放的就是返回的数据，res是api传数据
        // 返回的数据需要转换成JSON格式
        let meta = { status: 200, msg: '获取用户列表成功' }
        let data = result
        return res.json({ data, meta, total });
    });
})

//查询用户信息接口
app.post('/selectUser', function (req, res) {
    let id = req.body.id
    const sql = `select * from user where id = ${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            let meta = { status: 0, msg: '查询用户信息失败' }
            return res.json(meta)
        }
        let meta = { status: 200, msg: '查询用户信息成功' }
        let obj = {
            data: result,
            meta: meta
        }
        return res.json(obj)
    })
})


//菜单请求接口
// app.get('/menus', function (err, res) {
//     //console.log(req.body); //获取请求参数

//     var file = path.join(__dirname, './public/dataMock/leftMenu-tree.json'); //文件路径，__dirname为当前运行js文件的目录
//     //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

//     //读取json文件
//     fs.readFile(file, 'utf-8', function (err, data) {
//         console.log(data)

//         if (err) {
//             res.send('文件读取失败');
//         } else {
//             res.send(data);
//         }
//     });

// })

//权限列表请求接口
app.get('/limits', function (err, res) {
    //console.log(req.body); //获取请求参数

    var file = path.join(__dirname, './public/dataMock/leftMenu-list.json'); //文件路径，__dirname为当前运行js文件的目录
    //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

    //读取json文件
    fs.readFile(file, 'utf-8', function (err, data) {
        console.log(data)

        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
    });
})

//角色列表请求接口
app.get('/roles', function (err, res) {
    //console.log(req.body); //获取请求参数

    var file = path.join(__dirname, './public/dataMock/roles.json'); //文件路径，__dirname为当前运行js文件的目录
    //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

    //读取json文件
    fs.readFile(file, 'utf-8', function (err, data) {
        console.log(data)

        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
    });
})



//添加用户接口
app.post('/addUser', function (req, res) {
    let { username, pwd, email, tel, id, role } = req.body.params
    console.log(username, pwd, email, tel, id)
    const sql = `insert into user(name,email,tel,pwd,id,role) values('${username}','${email}','${tel}','${pwd}','${id}','${role}')`
    connection.query(sql, function (err, result) {
        console.log(result, err)
        if (err) {
            let meta = { status: 0, msg: '获取用户列表失败' }
            return res.json(meta)
        }
        let meta = { status: 200, msg: '获取用户列表成功' }
        let obj = {
            data: result,
            meta: meta
        }
        return res.json(obj)
    })
})

//修改用户信息接口
app.post('/updateUser', function (req, res) {
    let { username, email, tel } = req.body.params
    const sql = `update user set email = "${email}",tel = "${tel}" where name = "${username}"`
    connection.query(sql, function (err, result) {
        console.log(result, err)
        if (err) {
            let meta = { status: 0, msg: '修改用户信息失败' }
            return res.json(meta)
        }
        let meta = { status: 200, msg: '修改用户信息成功' }
        let obj = {
            data: result,
            meta: meta
        }
        return res.json(obj)
    })
})

//菜单查询接口
app.get('/menus', function (req, res) {
    let total = null
    let len = null
    const sql = 'select * from list where pid = 0';
    connection.query(sql, function (err, result) {
        total = result
        len = result.length
        for (let i = 0; i < 5; i++) {
            let pid = total[i].id;
            const sql1 = `select * from list where pid = ${pid}`;
            connection.query(sql1, function (err, result) {
                if (err) {
                    let meta = { status: 0, msg: '登录失败' }
                    return res.json(meta)
                }
                total[i].children = result
                if(i==(len-1)){
                    let meta = { status: 200, msg: '获取菜单列表成功' }
                    let obj = {
                        data: total,
                        meta: meta
                    }
                    return res.json(obj);
                }
            });
        }
    });
})

//删除用户接口
app.post('/deleteUser', function (req, res) {
    let username = req.body.name
    const sql = 'delete from user where name = ?'
    connection.query(sql, username, function (err, result) {
        console.log(result, err)
        if (err) {
            return res.json({ status: 0, msg: '删除用户失败' })
        }
        let meta = { status: 200, mgs: '删除用户成功' }
        let obj = {
            data: result,
            meta: meta
        }
        return res.json(obj)
    })
})

var server = app.listen(3000, '127.0.0.1', function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("地址为 http://%s:%s", host, port);
})

