var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ===路由信息（接口地址）开始存放在./routes目录下===
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



app.get('/', function(req, res){
  res.send('Hello,myServer'); //服务器响应请求
});
app.listen(3000,function(){   //监听3000端口
  console.log("Server running at 3000 port");
});


// view engine setup
//配置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// === 模板开始 ===

//设置中间件
app.use(logger('dev'));
app.use(express.json());
// //应用cookie，session为中间件
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// //设置静态资源托管
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


// var express = require('express');   //引入express模块
// var mysql = require('mysql');     //引入mysql模块
// var app = express();        //创建express的实例
 
// var connection = mysql.createConnection({      //创建mysql实例
//     host:'127.0.0.1',
//     port:'3306',
//     user:'root',
//     password:'root',
//     database:'backserver'
// });
// connection.connect();
// var sql = 'SELECT * FROM user';
// connection.query(sql, function (err,result) {
//     if(err){
//         console.log('[SELECT ERROR]:',err.message);
//     }
//     console.log(result);  //数据库查询结果返回到result中
 
// });
// app.get('/',function (req,res) {
//     res.send('Hello,myServer');  
// });
// connection.end();
// app.listen(3000,function () {    
//     console.log('Server running at 3000 port');
// });




// var express = require('express');  //引入express模块
// var app = express();  //创建express的实例
// app.get('/', function(req, res){
//     res.send('Hello,myServer'); //服务器响应请求
// });
// app.listen(3000,function(){   //监听3000端口
//     console.log("Server running at 3000 port");
// });