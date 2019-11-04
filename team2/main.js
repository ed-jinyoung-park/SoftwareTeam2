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

app.set('view engine', 'ejs');
app.set('views', './boundaries');
app.engine('ejs',ejsLocals);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// student create, read, update, delete 등 모든 router
app.use('/student_form', studentRouter);

// main page
app.get('/', function(req, res) { 
  res.render('index');
});

const models = require('./entities');
models.sequelize.sync()
  .then(() => {
    console.log('✓ DB connection success.');
    console.log('  Press CTRL-C to stop\n');
  })
  .catch(err => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
  });

app.listen(port, () => console.log(`app listening on port ${port}!`))
