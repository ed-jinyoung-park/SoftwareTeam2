var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');

module.exports = router;

// db connect
var connection = mysql.createConnection ({
  host:'localhost',
  user:'root',
  password:'0107',
  database:'TEST'
});

connection.connect();


// data create - 입력 화면으로 이동
router.get('/create', function(req,res){
  res.render('./student/create');
});

// data save - 입력한 데이터를 post방식으로 저장.
router.post('/create',function(req,res){

  var user=req.body;
  console.log(req.body);

  // json 형식의 data를 user에 저장
  // 학생 개인정보 저장
  connection.query('INSERT INTO student (name, adm_year, semester, major1, major2, major3) VALUES(?, ?, ?, ?, ?, ?)', [user.user_name, user.user_number, user.semester, user.major1, user.major2, user.major3], function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
  });

  // 이수과목 저장
  var sql1 = 'INSERT INTO student_taken (major_required, major_select, general_required, general_select, id)';
  var sql2 = '(SELECT id from student where name = ?)'
  
  var major_req= user.major_req;
  var major_sel = user.major_sel;
  var general_req = user.general_req;
  var general_sel= user.general_sel;
    
  connection.query(sql1+'values (?, ?, ?, ?, '+sql2+')', [major_req.join(), major_sel.join(), general_req.join(), general_sel.join(), user.user_name], function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      console.log(results);
  });

  // 시간표 기호조건 저장
  sql3='INSERT INTO requirement (grade_range, major_req_num, major_sel_num, general_req_num, general_sel_num, blank_day, must_take, su_included, id)'
  connection.query(sql3+ 'values(?, ?, ?, ?, ?, ?, ?, ?, '+sql2+')', [user.grade_range, Number(user.major_req_num), Number(user.major_sel_num), Number(user.general_req_num), Number(user.general_sel_num), user.blank_day, user.must_take, user.su_included, user.user_name], function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
  });

  res.render('/');
});

// data를 보여주는 read 화면
router.get(['/show', '/show/:id'], function(req,res){

  var sql_show = 'SELECT * from student';

  connection.query(sql_show, function(error, results, fields ){
    
    var id= req.params.id;

    if (id){ // 특정 학생의 정보만
      var sql_show = 'SELECT s.*, r.*, st.* from student s, requirement r, student_taken st where s.id = ? and s.id=r.id and s.id=st.id';
      connection.query(sql_show, [id],function(error, result, fields){
        if (error) {
          console.log(error);
        } else{
          console.log(result);
          res.render('student/show', {students: result, student: result[0]});
        }        
      })
    } 
    else{ // 모든 학생의 정보
      res.render('student/show', {students: results, student: undefined});
    }

    if (error) {
      console.log(error);
    }
    console.log(results);
  })
});