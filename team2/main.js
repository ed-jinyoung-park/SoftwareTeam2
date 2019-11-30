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
var studentRouter = require('./controllers/schedule_recommendation.js');
var ejsLocals = require('ejs-locals');
var {sequelize} = require('./models/index');

app.set('view engine', 'ejs');
app.set('views', './boundaries');
app.engine('ejs',ejsLocals);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/student', express.static(path.join(__dirname, 'public')));

// student create, read, update, delete 등 모든 router
app.use('/student', studentRouter);

// main page
app.get('/', function(req, res) {
  res.render('index');
});


// sequelize module로 DB 연결 
sequelize.sync()
  .then(() => {
    console.log('Connection has been established successfully .');
  })
  .catch(err =>{
    console.log('Unable to Connect to the database:',err);
  });

app.listen(port, () => console.log(`app listening on port ${port}!`))
