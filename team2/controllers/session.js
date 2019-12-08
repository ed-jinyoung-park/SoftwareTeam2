var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var Op = require('sequelize').Op;

module.exports = router;

var authData = {
  email: 'aaaa',
  password: '1111',
  nickname: 'abcd'
}

router.post('/auth/login_process', function (request, response) {
  var post = request.body;
  var email = post.email;
  var password = post.pwd;
  if(email === authData.email && password === authData.password){
    response.redirect('/index');

  } else {
    response.send(`<script type="text/javascript">alert("로그인 정보가 잘못되었습니다");</script><a href="/">다시 로그인</a>`);
  }
  // response.redirect(`/topic/${title}`);
});

router.get('/index', function(req, res){
  res.render('./index')
})