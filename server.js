const express = require('express');
const uuid = require('node-uuid')
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

//商品添加分类接口
app.post('/addcategories', function (req, res) {
    let { cat_name, cat_pid, cat_level } = req.body
    let catDeleted = 'false'
    let maxCatId = 0
    if(cat_level == 0) {
        const sql = 'select max(cat_id) maxCatId from goods where cat_level = 0'
        connection.query(sql, function (err, result) {
                   maxCatId = result[0].maxCatId + 1
                   const sql1 = `insert into goods(cat_id, cat_pid, cat_name, cat_level, cat_deleted) values('${maxCatId}', 0 ,'${cat_name}', 0 ,'${catDeleted}')`
                   connection.query(sql1, function (err, result) {
                       console.log(err,result)
                       if (err) {
                           let meta = { status: 0, msg: '增加商品分类失败' }
                           return res.json(meta)
                       }
                       let meta = { status: 200, msg: '增加商品分类成功' }
                       let obj = {
                           data: result,
                           meta: meta
                       }
                       return res.json(obj)
                   })
                })
    }
    // else if(cat_level == 1) {
    //     const sql2 = `insert into goods(cat_id, cat_pdi, cat_name, cat_level, cat_deleted) values('${randomId}', 0 ,'${cat_name}', 0 ,'${catDeleted}')`
    //     randomId++
    //     connection.query(sql2, function (err, result) {
    //         console.log(result, err)
    //         if (err) {
    //             let meta = { status: 0, msg: '增加商品分类失败' }
    //             return res.json(meta)
    //         }
    //         let meta = { status: 200, msg: '增加商品分类成功' }
    //         let obj = {
    //             data: result,
    //             meta: meta
    //         }
    //         return res.json(obj)
    //     })
    // }
})

//商品查询请求接口
app.post('/categories', function (req, res) {
    let sum = 0
    let total = null
    let len = null
    let pageTotal = null
    let pagenum = Number(req.body.params.pagenum)
    let pagesize = Number(req.body.params.pagesize)
    let start = (pagenum - 1) * pagesize
    let type = req.body.params.type
    // 当传入type为2时，只查一二级菜单
    if (type == 2) {
        const sqlt = 'select * from goods where cat_pid = 0';
        //第一次查询，查找cat_pid为0的一级菜单
        connection.query(sqlt, function (err, result) {
            total = result
            len = result.length
            for (let i = 0; i < len; i++) {
                let pid = total[i].cat_id;
                //第二次查询，查找cat_pid为一级菜单cat_id的二级菜单
                const sql1 = `select * from goods where cat_pid = ${pid}`;
                connection.query(sql1, (err, result) => {
                    total[i].children = result
                    if (err) {
                        let meta = { status: 0, msg: '获取菜单一二级列表失败' }
                        return res.json(meta)
                    }
                    if (i == (len - 1)) {
                        let meta = { status: 200, msg: '获取菜单一二级列表成功' }
                        obj = {
                            data: total,
                            meta: meta
                        }
                        return res.json(obj);
                    }
                });
            }
        });
    }
    // 当传入type为3时，查询一二三级菜单
    else if(type == 3 && Object.keys(req.body.params).length == 1) {
        let total1 = null
        let len1 = null
        const sqlt = 'select * from goods where cat_pid = 0';
        //第一次查询，查找cat_pid为0的一级菜单
        connection.query(sqlt, function (err, result) {
            total1 = result
            len1 = result.length
            for (let i = 0; i < len1; i++) {
                let pid = total1[i].cat_id;
                //第二次查询，查找cat_pid为一级菜单cat_id的二级菜单
                const sql1 = `select * from goods where cat_pid = ${pid}`;
                connection.query(sql1, (err, result) => {
                    let totalChild = result
                    let lenChild = result.length
                    total1[i].children = result
                    for (let j = 0; j < lenChild; j++) {
                        let cid = totalChild[j].cat_id
                        //第三次查询，查找cat_pid为二级菜单cat_id的三级菜单
                        const sql2 = `select * from goods where cat_pid = ${cid}`;
                        connection.query(sql2, (err, result) => {
                            if (err) {
                                let meta = { status: 0, msg: '获取菜单列表失败' }
                                return res.json(meta)
                            }
                            total1[i].children[j].children = result
                            //判断，当最后一次循环时，进行数据返回操作
                            if (i == (len1 - 1)) {
                                // 在最外层定义一个sum，用于判断是否等于result.length
                                // 这里的result.length指三级菜单的长度，如果遍历完，则表示循环遍历三级菜单结束，可以调用res.json返回前端值
                                sum++
                            }
                            if (sum == result.length) {
                                let meta = { status: 200, msg: '获取菜单列表成功' }
                                obj = {
                                    data: total1,
                                    meta: meta
                                }
                                return res.json(obj);
                            }
                        })
                    }
                });
            }
        });
    }
    else {
        let total2 = null
        let len2 = null
        // 注意：由于goods商品表区分为一二三级菜单，在前端分页时不查询总条数，而是查询一级菜单的总条数，所以这时候传给前端的总条数应为一级菜单总条数
        const sql0 = 'select count(*) pageTotal from goods where cat_pid = 0'
        connection.query(sql0, function (err, result) {
            // pageTotal为一级菜单总条数
            pageTotal = result[0]
        });
        const sql = `select * from goods where cat_pid = 0 limit ${start},${pagesize}`;
        //第一次查询，查找cat_pid为0的一级菜单
        connection.query(sql, function (err, result) {
            total2 = result
            len2 = result.length
            for (let i = 0; i < len2; i++) {
                let pid = total2[i].cat_id;
                //第二次查询，查找cat_pid为一级菜单cat_id的二级菜单
                const sql1 = `select * from goods where cat_pid = ${pid}`;
                connection.query(sql1, (err, result) => {
                    let totalChild = result
                    let lenChild = result.length
                    total2[i].children = result
                    for (let j = 0; j < lenChild; j++) {
                        let cid = totalChild[j].cat_id
                        //第三次查询，查找cat_pid为二级菜单cat_id的三级菜单
                        const sql2 = `select * from goods where cat_pid = ${cid}`;
                        connection.query(sql2, (err, result) => {
                            if (err) {
                                let meta = { status: 0, msg: '获取菜单列表失败' }
                                return res.json(meta)
                            }
                            total2[i].children[j].children = result
                            //判断，当最后一次循环时，进行数据返回操作
                            if (i == (len2 - 1)) {
                                // 在最外层定义一个sum，用于判断是否等于result.length
                                // 这里的result.length指三级菜单的长度，如果遍历完，则表示循环遍历三级菜单结束，可以调用res.json返回前端值
                                sum++
                            }
                            if (sum == result.length) {
                                let meta = { status: 200, msg: '获取菜单列表成功' }
                                obj = {
                                    data: total2,
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
    }
})

app.post('/attributes', function(req, res) {
    let cat_id = req.body.params.cat_id
    let attr_sel = req.body.params.attr_sel
    console.log(cat_id, attr_sel)
    console.log(typeof attr_sel)
    const sql = `select * from attributes where cat_id = ${cat_id} and attr_sel = '${attr_sel}'`;
    connection.query(sql, function (err, result) {
        console.log(err,result)
        if (err) {
            let meta = { status: 0, msg: '查询分类参数失败!' }
            return res.json(meta)
        }
        let meta = { status: 200, msg: '查询分类参数成功!' }
        let obj = {
            data: result,
            meta: meta
        }
        return res.json(obj)
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
    let { roleName, roleDesc } = req.body.params
    const sql = `update role set roleDesc = "${roleDesc}" where roleName = "${roleName}"`
    connection.query(sql, function (err, result) {
        console.log(err, result)
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
app.get('/roles', (req, res) => {
    // 第一次查询，查找所有角色
    const sql9 = 'select * from role';
    connection.query(sql9, (err, result) => {
        let total = result
        let len = result.length
        for (let i = 0; i < len; i++) {
            let roleId = result[i].roleId
            const sql1 = `select * from menu where id in (select distinct menu_id from role_menu where role_id = ${roleId})`
            connection.query(sql1, (err, result) => {
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
                        for (let p = 0; p < lenChild; p++) {
                            let cid = totalChild[p].id
                            //第三次查询，查找pid为二级菜单id的三级菜单
                            const sql3 = `select  distinct * from menu where pid = ${cid}`;
                            connection.query(sql3, (err, result) => {
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
                                if (i == (len - 1)) {
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
                for (let j = 0; j < lenChild; j++) {
                    let cid = totalChild[j].id
                    //第三次查询，查找pid为二级菜单id的三级菜单
                    const sql2 = `select * from menu where pid = ${cid}`;
                    connection.query(sql2, (err, result) => {
                        if (err) {
                            let meta = { status: 0, msg: '获取菜单列表失败' }
                            return res.json(meta)
                        }
                        total[i].children[j].children = result
                        //判断，当最后一次循环时，进行数据返回操作
                        if (i == (len - 1)) {
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

