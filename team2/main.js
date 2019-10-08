// express 호출해서 app에 할당
// 각 module 호출
const express = require('express')
const app = express();
const port = 3000;
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
var userRouter = require('./routes/user.js');
// var sanitizeHTML = require('sanitize-html');


// Middle Ware
// bodyParser - data 들어올때마다 자동으로 읽어줌
app.use(bodyParser.urlencoded({ extended: false }));
// data 압축
app.use(compression())
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list=filelist;
    next();
  })
});

app.use('/user', userRouter);

app.get('/', function(request, response) { 
  fs.readdir('./data', function(error, filelist){
  var title = '취향에 맞는 시간표를 만들어드립니다';
  var description = '';
  var list = template.list(filelist);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<a href="/user/create">시작하기</a>`,
    //authStatusUI(request, response)
  );
  response.send(html);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
