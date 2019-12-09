var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');

// module.exports = setYoramListForRecommendation;

module.exports = async function(studentId){
  
  var student = await models.student.findOne({
    where: {id: studentId}
  });
  student = student.dataValues;
  
  var Opencourses = await models.Opencourse.findAll({
    where: {major: [student.major1, student.major2, student.major3, '전인교육원']}
  });

  var Opencourses_title_list = getOpencourseUnique(Opencourses);

  var Opencourses_all = Opencourses.map(Opencourse => [Opencourse.subject_title, Opencourse.class_day, Opencourse.start_time, Opencourse.end_time]);
  
  var Condition = await models.condition.findOne({
    where: {studentId: studentId}
  });
  Condition = Condition.dataValues;

  var recom_year_1 = parseInt(getRecomYear(student.semester))+1;
  recom_year_1=String(recom_year_1);
  var Yoram = await models.Yoram.findAll({
     where: {major: student.major1, recom_year: [getRecomYear(student.semester),recom_year_1]}
  });
  var myYoram = Yoram.map(Yoram => [Yoram.subject_name,Yoram.recom_year,Yoram.category,Yoram.major1_prop,Yoram.major2_prop,Yoram.credit]);
  var myYoram_major=[]
  var myYoram_other=[]
  for (idx in myYoram){
    if((myYoram[idx][3]).includes('전공')){
      myYoram_major.push(myYoram[idx]);
    }
    else{myYoram_other.push(myYoram[idx]);}
  }
  var CompletedSubject = await models.Mysubject.findAll({
    where: {studentId: studentId}
  });

  CompletedSubjectIdArray = CompletedSubject.map(Mysubject=>Mysubject.subjectId);
  
  var CompletedSubjectArray = await models.subject.findAll({
    where: {id: CompletedSubjectIdArray}
  });

  CompletedSubjectArray=CompletedSubjectArray.map(subject=>subject.title);
  
  // 1. myYoram에서 opencourse에 없는 과목들을 제거
  var myYoram_major_filtered=[];
  //console.log(myYoram_major);
  for (idx in myYoram_major){
    if(Opencourses_title_list.includes(myYoram_major[idx][0])){
      myYoram_major_filtered.push(myYoram_major[idx]);
    }
  }

  var myYoram_filtered =  myYoram_major_filtered.concat(myYoram_other);
  // console.log(myYoram_filtered);
  // console.log(Opencourses_title_list);
  
  // 2. Condition 공강 조건 필터링
  var vacant_day = Condition.vacant_day.split(',');
  var myYoram_filtered_2=[];

  for (k in myYoram_filtered){
    for (i in Opencourses_all){
      for (j in vacant_day){
        if(!((Opencourses_all[i][1]).includes(vacant_day[j])) && (Opencourses_all[i][0]==myYoram_filtered[k][0]))
        {
          myYoram_filtered_2.push(myYoram_filtered[k]); 
        }
      }
    }
  }

  // 중복 제거
  myYoram_filtered_2 = myYoram_filtered_2.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[])

  // 3. 수강과목 제거
  var myYoram_filtered_3=[]
  for(idx in myYoram_filtered_2){
    if(!(CompletedSubjectArray.includes(myYoram_filtered_2[idx][0]))){
      myYoram_filtered_3.push(myYoram_filtered_2[idx]);
    }
  }
  console.log(myYoram_filtered_3);

  for(idx in myYoram_filtered_3){
    models.StudentYoram.create({
      studentId: studentId,
      subject_name: myYoram_filtered_3[idx][0],
      recom_year: myYoram_filtered_3[idx][1],
      category: myYoram_filtered_3[idx][2],
      major1_prop: myYoram_filtered_3[idx][3],
      major2_prop: myYoram_filtered_3[idx][4],
      credit: myYoram_filtered_3[idx][5]
    });
  }
  
}

var getRecomYear = function(data){
  var semester = data;
  if(semester=='1'|| semester=='2') semester='1';
  else if (semester=='3'|| semester =='4') semester='2';
  else if (semester=='5'|| semester == '6') semester='3';
  else semester='4';
  return semester;
}

var getOpencourseUnique = function(data){
  var Opencourses = data.map(Opencourse => Opencourse.subject_title);
  Opencourses = Opencourses.filter((item, idx, array)=>{
  return array.indexOf(item)==idx;
  })
  return Opencourses;
}
