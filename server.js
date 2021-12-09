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

//商品查询请求接口
app.post('/categories', function (req, res) {
    let total = null
    let len = null
    let pageTotal = null
    let pagenum = Number(req.body.params.pagenum)
    let pagesize = Number(req.body.params.pagesize)
    let start = (pagenum - 1) * pagesize
    const sql0 = 'select count(*) pageTotal from goods'
    connection.query(sql0, function (err, result) {
        console.log(result)
        pageTotal = result[0]
    });
    const sql = `select * from goods where cat_pid = 0 limit ${start},${pagesize}`;
    //第一次查询，查找cat_pid为0的一级菜单
    connection.query(sql, function (err, result) {
        total = result
        len = result.length
        for (let i = 0; i < len; i++) {
            let pid = total[i].cat_id;
            //第二次查询，查找cat_pid为一级菜单cat_id的二级菜单
            const sql1 = `select * from goods where cat_pid = ${pid}`;
            connection.query(sql1, (err, result) => {
                let totalChild = result
                let lenChild = result.length
                total[i].children = result
                for(let j = 0;j < lenChild; j++){
                    let cid = totalChild[j].cat_id
                    //第三次查询，查找cat_pid为二级菜单cat_id的三级菜单
                    const sql2 = `select * from goods where cat_pid = ${cid}`;
                    connection.query(sql2,(err,result) => {
                        if (err) {
                            let meta = { status: 0, msg: '获取菜单列表失败' }
                            return res.json(meta)
                        }
                        total[i].children[j].children = result
                        //判断，当最后一次循环时，进行数据返回操作
                        if(i==(len-1)){
                            let meta = { status: 200, msg: '获取菜单列表成功' }
                            let obj = {
                                data: total,
                                total: pageTotal,
                                meta: meta
                            }
                            return res.json(obj);
                        }
                    })
                }
            });
        }
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
// app.get('/limits', function (err, res) {
//     //console.log(req.body); //获取请求参数

//     var file = path.join(__dirname, './public/dataMock/leftMenu-list.json'); //文件路径，__dirname为当前运行js文件的目录
//     //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

//     //读取json文件
//     fs.readFile(file, 'utf-8', function (err, data) {
//         console.log(data)

//         if (err) {
//             res.send('失败');
//         } else {
//             res.send(data);
//         }
//     });
// })

//权限列表请求接口
app.get('/limits', function (req, res) {
    const sql = 'select * from menu'
    connection.query(sql, function (err, result) {
        if (err) {
            return res.json({ status: 0, msg: '查询权限列表失败' })
        }
        let meta = { status: 200, mgs: '查询权限列表成功' }
        let obj = {
            data: result,
            meta: meta
        }
        return res.json(obj)
    })
})

//角色列表请求接口
app.get('/roles1', (req,res) => {
    // 第一次查询，查找所有角色
    const sql = 'select * from role';
    connection.query(sql,(err,result) => {
        let info = result
        let len = result.length
        for(let i = 0; i < len; i++){
            let roleId = result[i].roleId
            // 第二次查询，根据角色id对应的menu_id来查找对应角色下的菜单信息
            const sql1 = `select * from menu where id in (select distinct menu_id from role_menu where role_id = ${roleId})`
            connection.query(sql1, (err,result) => {
                let child = result
                let lenChild = result.length
                info[i].children = result
                for(let j =0;j < lenChild; j++){
                    let cid = child[j].id
                    //第三次查询，查找pid为一级菜单id的二级菜单
                    const sql2 = `select * from menu where pid = ${cid}`;
                    connection.query(sql2,(err,result) => {
                        if(err){
                            let meta = { status: 0, msg: '获取角色列表失败' }
                            return res.json(meta)
                        }
                        console.log(i)
                        console.log(len)
                        info[i].children[j].children = result
                        if(i == (len-1)){
                            let meta = { status: 200, msg: '获取角色列表成功' }
                            let obj = {
                                data: info,
                                meta: meta
                            }
                            return res.json(obj);
                        }
                    })
                }
            })
        }
    })
})

//角色列表请求接口
app.get('/roles2', (req,res) => {
    // 第一次查询，查找所有角色
    const sql = 'select * from role';
    connection.query(sql,(err,result) => {
        let info = result
        let len = result.length
        for(let i = 0; i < len; i++){
            let roleId = result[i].roleId
            // 第二次查询，根据角色id对应的menu_id来查找对应角色下的菜单信息
            const sql1 = `select * from menu where id in (select distinct menu_id from role_menu where role_id = ${roleId})`
            connection.query(sql1, (err,result) => {
                let child = result
                let lenChild = result.length
                info[i].children = result
                for(let j =0;j < lenChild; j++){
                    let cid = child[j].id
                    //第三次查询，查找pid为一级菜单id的二级菜单
                    const sql2 = `select * from menu where pid = ${cid}`;
                    connection.query(sql2,(err,result) => {
                        let childitem = result
                        let lenitem = result.length
                        info[i].children[j].children = result
                        for(let n=0; n< lenitem; n++){
                            let nid = childitem[n].id
                            console.log("这是id" + nid)
                            //第四次查询，查找pid为二级菜单id的三级菜单
                            const sql3 = `select * from menu where pid = ${nid}`;
                            connection.query(sql3,(err,result) => {
                                if(err){
                                    let meta = { status: 0, msg: '获取角色列表失败' }
                                    return res.json(meta)
                                }
                                info[i].children[j].children[n].children = result
                                console.log("长度" + len,lenChild,lenitem + "   变量" + i,j,n)
                                if(i == (len-1)){
                                    let meta = { status: 200, msg: '获取角色列表成功' }
                                    let obj = {
                                        data: info,
                                        meta: meta
                                    }
                                    return res.json(obj);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

//角色列表请求接口
// app.get('/roles', function (err, res) {
//     //console.log(req.body); //获取请求参数

//     var file = path.join(__dirname, './public/dataMock/roles.json'); //文件路径，__dirname为当前运行js文件的目录
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

//修改前查询指定修改角色信息接口
app.post('/editRole', function (req, res) {
    let roleId = req.body.roleId
    const sql = `select * from role where roleId = ${roleId}`
    connection.query(sql, function (err, result) {
        if (err) {
            let meta = { status: 0, msg: '查询角色信息失败' }
            return res.json(meta)
        }
        let meta = { status: 200, msg: '查询角色信息成功' }
        let obj = {
            data: result,
            meta: meta
        }
        return res.json(obj)
    })
})
//修改角色信息接口
app.post('/editRoleSubmit', function (req, res) {
    let {roleName, roleDesc} = req.body.params
    const sql = `update role set roleDesc = "${roleDesc}" where roleName = "${roleName}"`
    connection.query(sql, function (err, result) {
        console.log(err,result)
        if (err) {
            let meta = { status: 0, msg: '修改角色信息失败' }
            return res.json(meta)
        }
        let meta = { status: 200, msg: '修改角色信息成功' }
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

//角色列表请求接口
app.get('/roles', (req,res) => {
    let sog = 0
    // 第一次查询，查找所有角色
    const sql9 = 'select * from role';
    connection.query(sql9, (err,result) => {
        let total = result
        let len = result.length
        for(let i = 0; i< len; i++){
            let roleId = result[i].roleId
            const sql1 = `select * from menu where id in (select distinct menu_id from role_menu where role_id = ${roleId})`
            connection.query(sql1, (err,result) => {
                total[i].children = result
                let child = result
                let len1 = result.length
                for (let j = 0; j < len1; j++) {
                    let pid = child[j].id;
                    //第二次查询，查找pid为一级菜单id的二级菜单
                    const sql2 = `select  distinct * from menu where pid = ${pid}`;
                    connection.query(sql2, (err, result) => {
                        total[i].children[j].children = result
                        let totalChild = result
                        let lenChild = result.length
                        // let flag = 0
                        // if(i == (len-1)){
                        //     flag = 1
                        // }
                        for(let p = 0;p < lenChild; p++){
                            let cid = totalChild[p].id
                            //第三次查询，查找pid为二级菜单id的三级菜单
                            const sql3 = `select  distinct * from menu where pid = ${cid}`;
                            connection.query(sql3,(err,result) => {
                                if (err) {
                                    let meta = { status: 0, msg: '获取菜单列表失败' }
                                    return res.json(meta)
                                }
                                total[i].children[j].children[p].children = result
                                //判断，当最后一次循环时，进行数据返回操作
                                // console.log(flag)
                                // if(!flag){
                                //     sog++
                                // }
                                if(i == (len - 1)){
                                    let meta = { status: 200, msg: '获取菜单列表成功' }
                                    let obj = {
                                        data: total,
                                        meta: meta
                                    }
                                    return res.json(obj);
                                }
                            })
                        }
                    });
                }
            })
        }
    })
})

//菜单请求接口
app.get('/menus', function (req, res) {
    let total = null
    let len = null
    const sql = 'select * from menu where pid = 0';
    //第一次查询，查找pid为0的一级菜单
    connection.query(sql, function (err, result) {
        total = result
        len = result.length
        for (let i = 0; i < len; i++) {
            let pid = total[i].id;
            //第二次查询，查找pid为一级菜单id的二级菜单
            const sql1 = `select * from menu where pid = ${pid}`;
            connection.query(sql1, (err, result) => {
                let totalChild = result
                let lenChild = result.length
                total[i].children = result
                for(let j = 0;j < lenChild; j++){
                    let cid = totalChild[j].id
                    //第三次查询，查找pid为二级菜单id的三级菜单
                    const sql2 = `select * from menu where pid = ${cid}`;
                    connection.query(sql2,(err,result) => {
                        if (err) {
                            let meta = { status: 0, msg: '获取菜单列表失败' }
                            return res.json(meta)
                        }
                        total[i].children[j].children = result
                        //判断，当最后一次循环时，进行数据返回操作
                        if(i==(len-1)){
                            let meta = { status: 200, msg: '获取菜单列表成功' }
                            let obj = {
                                data: total,
                                meta: meta
                            }
                            return res.json(obj);
                        }
                    })
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

