var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../entities');
var saveInfo = require('../functions/student_create')
var read = require('../functions/student_read');

module.exports = router;

// db connect


// data create - 입력 화면으로 이동
router.get('/create', function(req,res){
  res.render('./student_form/create');
});

// data save - 입력한 데이터를 post방식으로 저장.
router.post('/create',function(req,res){
  // SaveInfo function - student entity에 data 저장
  saveInfo(req.body);
  res.render('index');
});

// data를 보여주는 read 화면
router.get(['/show', '/show/:id'], function(req,res){
  var id= req.params.id;
  var findAllStudent = read.readInfos();

  findAllStudent.then(function(results){
    if(id){ // student id 값이 있을 경우, 즉 특정 student의 정보
      var findOneStudent = read.readInfo(id);
      findOneStudent.then(function(result){
        res.render('student_form/show', {students: results, student: result});
      })
    }
    else{ // 모든 student의 정보
      res.render('student_form/show', {students: results, student: undefined});
    }
  });
});