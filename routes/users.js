var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getUserInfo',function(req,res,next){
  var user = new User();
  //解析路由参数
  var params = URL.parse(req.url, true).query;
  if(params.id=='1'){
    user.name='张三';
    user.age=20;
    user.sex='man';
  }else if(params.id=='2'){
    user.name="李四";
    user.age=30;
    user.sex='woman';
  }

  var response = {status:1,data:user}
  res.send(JSON.stringify(response))
})