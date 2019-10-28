// express 호출해서 app에 할당
// 각 module 호출
const express = require('express')
const app = express();
const port = 3000;
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
var studentRouter = require('./routes/student.js');
var ejsLocals = require('ejs-locals');

app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('ejs',ejsLocals);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// student create,show 등 모든 router
app.use('/student', studentRouter);

// main page
app.get('/', function(req, res) { 
  res.render('index');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
