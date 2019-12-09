var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');
var subject_insert = require('../InsertData/subject_insert.js');
var opencourse_insert = require('../InsertData/opencourse_insert.js');
var yoram_insert = require('../InsertData/yoram_insert.js');
var testdata_insert = require('../InsertData/testdata_insert.js');
var Op = require('sequelize').Op;
var setYoramListForRecommendation = require('../operations/setYoramListForRecommendation.js');
var setTimetableScore = require('../operations/SetTimetableScore');
var getfilteredTimetableList = require('../operations/getfilteredTimetableList');
module.exports = router;

// data insert
router.get('/data_insert', function(req,res){
  // subject data insert
  models.subject.count().then(c=>{
    if(c==0) subject_insert();
  });
  // opencourse data insert
  models.Opencourse.count().then(c=>{
    if(c==0) opencourse_insert();
  });
  // yoram data insert
  models.Yoram.count().then(c=>{
    if(c==0) yoram_insert();
  });
  
  // test data insert
  models.student.count().then(c=>{
    if(c==0){
      for(var i=1; i<=20;i++){
        models.student.create({
          adm_year: '18',
          semester: '4',
          major1: '컴퓨터공학'
        })
      } 
    }
  })

  models.Timetable.count().then(c=>{
    if(c==0) testdata_insert();
  });

  res.redirect('/index');
});
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
     res.redirect('/student/'+id+'/subject/create');
   });
  
});

// 입력 2단계 - subject create
router.get('/:id/subject/create',function(req,res){
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
  res.redirect('/student/'+id+'/condition/create');
});

// 입력 3단계 - condition create
router.get('/:id/condition/create', function(req,res){
  var id = req.params.id;
  models.subject.findAll({
    attributes: ['title'],
    raw: true
  }).then(function(subjects){
    var subjects = subjects.map(subject => subject.title);
    res.render('./condition/create',{id: id, subjects: subjects});
  });
});

//입력 3단계 - condition save
router.post('/:id/condition/create', function(req,res){
  user_condition = req.body;
  console.log(user_condition);
  var id = req.params.id;
  var vacant_day = user_condition.vacant_day;
  if(typeof vacant_day == 'object'){
    vacant_day = vacant_day.join();
  }
  models.condition.create({
    studentId: id,
    grade_num: user_condition.totalCredit,
    major_num: user_condition.majorCredit,
    general_num: user_condition.generalCredit,
    vacant_day: vacant_day,
    sub_fix_1:user_condition.sub_fix_1,
    sub_fix_2:user_condition.sub_fix_2,
    sub_fix_3:user_condition.sub_fix_3,
    su_sub:user_condition.su
  })
  
  res.redirect('/student/'+id+'/recomm/first');
});

//추천 1단계
router.get('/:id/recomm/first', function(req, res){
  
  var id=req.params.id;
  // 개인조건, 개설과목에 맞는 요람을 필터링해서 StudentYoram 테이블에 저장
  // setYoramListForRecommendation(id);
  
  // 추천 0단계 - 같은 학기, 전공 학생들의 시간표 패턴 유사도 점수 구하기
  var tt_matrix_list=[];
  
  setTimetableScore(id).then(result=>{
    tt_matrix_list=result;
  });

  
  for (matrix in tt_matrix_list){
    console.log(matrix);
  }

  getfilteredTimetableList(tt_matrix_list, 1);

  res.render('./recomm/first'); 
});



