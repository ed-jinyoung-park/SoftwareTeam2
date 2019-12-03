var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');
var subject_insert = require('../subject_insert.js');
var Op = require('sequelize').Op;

module.exports = router;

// 입력 1단계 - student create
router.get('/create', function(req,res){
  var major_list = ["국어국문학","사학","철학","종교학","영미어문","미국문화","유럽문화","중국문화","사회학","정치외교학","심리학","경제학","경영학","신문방송학","미디어&엔터테인먼트","아트&테크놀로지","글로벌한국학","수학","물리학","화학","생명과학","전자공학","컴퓨터공학","화공생명공학","기계공학"];
  var minor_list = ["없음","국어국문학","사학","철학","종교학","영미어문","미국문화","유럽문화","중국문화","사회학","정치외교학","심리학","경제학","경영학","신문방송학","미디어&엔터테인먼트","아트&테크놀로지","글로벌한국학","수학","물리학","화학","생명과학","전자공학","컴퓨터공학","화공생명공학","기계공학","융합소프트웨어","스포츠미디어","바이오융합","여성학","스타트업","정치경제철학","공공인재","일본문화","빅데이터-데이터엔지니어","빅데이터-데이터분석","인공지능"];
  res.render('./student/create',{major_list: major_list, minor_list: minor_list});
});

// 입력 1단계 - student save
router.post('/create',function(req,res){
  //request로 data를 받아 user에  저장
  user = req.body;
  // student 객체에 데이터 저장
  models.student.create({
    adm_year: user.adm_year,
    semester: user.semester,
    major1: user.major1,
    major2: user.major2,
    major3: user.major3
   }).then((result)=>{
     var id = result.dataValues.id;
     
    models.subject.count().then(c=>{
      if(c==0) subject_insert();
    });

     res.redirect('/student/'+id+'/subject/create');
   });
  
});

// 입력 2단계 - subject create
router.get('/:id/subject/create',function(req,res){

  // subject_all data insert

  models.subject.findAll({
    attributes: ['title'],
    raw: true
  }).then(function(subjects){
    var subjects = subjects.map(subject => subject.title);
    res.render('./subject/create',{subjects: subjects});
  });
});

// 입력 2단계 - mysubject save
router.get('/:id/subject/create/:array', function(req,res){
  var id = req.params.id;
  var subject_array=req.params.array;
  subject_array = subject_array.split(',');
  subject_array.pop();
  
  models.subject.findAll({
    where: {title: subject_array},
    attributes: ['id']
  }).then(subjects=>{
    var subject_id_array = subjects.map(subject => subject.id);
    console.log(subject_id_array);
    
    for(var i=0; i<subject_id_array.length; i++){
      models.Mysubject.create({
        studentId: id,
        subjectId: subject_id_array[i]
      }).then(result=>{
        console.log(result);
      })
      .catch(error=>{
        console.log(error+'Mysubject create error');
      })
    }
  })

  res.redirect('/student/'+id+'/style/create/');
});

// 입력 3단계 - style create
router.get('/:id/style/create', function(req,res){
  res.render('./style/create');
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

// 수정할 data 읽어오기
router.get('/update/:id', function(req, res){
  // parameter로 수정할 student의 id 값을 받아 id변수에 저장
  var id = req.params.id;
  // 해당 id값의 student data를 update ejs에 전달
  models.student.findOne({where: {id: id}}).then(student=>{
    res.render("student/update",{student: student});
  })
  .catch(err => {
    console.log("data find error")
  });
});

// data 수정
router.post('/update/:id', function(req,res){
  // id값을 id, 수정 정보를 user에 담음
  var id = req.params.id;
  var user = req.body; 
  // update code
  models.student.update({
    st_name: user.st_name,
    adm_year: user.adm_year,
    semester: user.semester,
    major1: user.major1,
    major2: user.major2,
    major3: user.major3
  },{where: {id: id}}).then(result=>{
    console.log("data update complete");
    res.redirect("/student/show/"+id);
  })
  .catch(err=>{
    console.log("data update error");
  })
});

// data 삭제
router.get('/delete/:id', function(req,res){
  var id = req.params.id;
  // destroy module을 써서 삭제
  models.student.destroy({where: {id: id}}).then(result=>{
    console.log("data delete complete");
    res.redirect('/student/show');
  })
  .catch(err=>{
    console.log("data delete error")
  })
});



