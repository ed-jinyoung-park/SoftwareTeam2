var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');

module.exports = makeMyYoram;

var makeMyYoram = async function(studentId){
  
  var student = await models.student.findOne({
    where: {id: studentId}
  });
  student = student.dataValues;
  
  var Opencourses = await models.Opencourse.findAll({
    where: {major: [student.major1, student.major2, student.major3]}
  });
  Opencourses = getOpencourseUnique(Opencourses);
  console.log(Opencourses);
  
  var Condition = await models.condition.findOne({
    where: {studentId: studentId}
  });
  Condition = Condition.dataValues;

  var Yoram = await models.Yoram.findAll({
     where: {major: student.major1, recom_year: getRecomYear(student.semester)}
  });

  var myYoram = Yoram.map(Yoram => [Yoram.subject_name,Yoram.recom_year,Yoram.category,Yoram.major1_prop,Yoram.major2_prop,Yoram.credit]);  
  console.log(myYoram);

  var CompletedSubject = await models.Mysubject.findAll({
    where: {studentId: studentId}
  });

  CompletedSubjectIdArray = CompletedSubject.map(Mysubject=>Mysubject.subjectId);
  
  var CompletedSubjectArray = await models.subject.findAll({
    where: {id: CompletedSubjectIdArray}
  });

  CompletedSubjectArray=CompletedSubjectArray.map(subject=>subject.title);
  
  // 1. myYoram에서 opencourse에 없는 과목들을 제거  
  
}

var getRecomYear = function(data){
  var semester = data.split("")[0];
  switch (semester){
    case ('1' || '2'): return '1';
    case ('3' || '4'): return '2';
    case ('5' || '6'): return '3';
    case ('7' || '8'): return '4';
  }
  return '4';
}

var getOpencourseUnique = function(data){
  var Opencourses = data.map(Opencourse => Opencourse.subject_title);
  Opencourses = Opencourses.filter((item, idx, array)=>{
  return array.indexOf(item)==idx;
  })
  return Opencourses;
}

makeMyYoram(15);