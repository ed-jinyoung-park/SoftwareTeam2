var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');

module.exports = async function(studentId){

  var myYoram = await models.StudentYoram.findAll({
    where: {studentId: studentId},
    raw: true
  });

  var myYoram_title = await models.StudentYoram.findAll({
    where: {studentId: studentId},
    attributes: ['subject_name'],
    raw: true
  });

  var myYoram_title_list=[];
  
  for(idx in myYoram_title){
    myYoram_title_list.push(myYoram_title[idx].subject_name);
  }

  // 수강가능한 과목 리스트
  var OpencoursesForme = await models.Opencourse.findAll({
    where: {subject_title: myYoram_title_list},
    raw:true
  })
  
  console.log(OpencoursesForme);

  

}