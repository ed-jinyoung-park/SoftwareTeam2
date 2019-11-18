var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');

module.exports = router;

// data create - 입력 화면으로 이동
router.get('/create', function(req,res){
  res.render('./student/create');
});

// data save - 입력한 데이터를 post방식으로 저장.
router.post('/create',function(req,res){
  //request로 data를 받아 user에 저장
  user = req.body;
  // student 객체에 데이터 저장
  models.student.create({
    name: user.student_name,
    adm_year: user.ent_year,
    semester: user.semester,
    major1: user.major_1,
    major2: user.major_2,
    major3: user.major_3
   }).then(()=>{console.log("Create Done")});
  
  // index (home)로 이동 
  res.render('index');
});

// data를 보여주는 read 화면
router.get(['/show', '/show/:id'], function(req,res){
  // request로 id 값 받아 id에 저장
  var id= req.params.id;
  // findAll 함수로 모든 student를 찾음
  models.student.findAll().then(students =>{
    if(id){ // id 값이 있을 경우
      // findOne함수로 해당 id값을 가진 student를 찾음
      models.student.findOne({where: {id: id}}).then(student =>{
        // students에 findAll의 결과, student에 findOne의 결과를 담아 student/show.ejs에 전달 
        res.render('student/show', {students: students, student: student})
      })
    }
    // id 값이 없을 경우
    // students에 findAll의 결과, student는 null값을 담아 student/show.ejs에 전달
    else res.render('student/show', {students: students, student: undefined});
  });
});