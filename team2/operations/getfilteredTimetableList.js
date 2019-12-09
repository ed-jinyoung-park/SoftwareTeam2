var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');
var math = require('mathjs');

var aaa = async function(tt_matrix_list, studentId){
  
  // 고정 과목 리스트 추출 - sub_fix_list
  var condition = await models.condition.findOne({
    where: {studentId: studentId}
  });
  condition = condition.dataValues;
  var sub_fix_list = [];
  if (condition.sub_fix_1 != undefined){
    sub_fix_list.push(condition.sub_fix_1);
  }
  if (condition.sub_fix_2 != undefined){
    sub_fix_list.push(condition.sub_fix_2);
  }
  if(condition.sub_fix_3 != undefined){
    sub_fix_list.push(condition.sub_fix_3);
  }
  console.log(sub_fix_list);

  // 개설과목리스트(Opencourses)에서 고정과목 개설정보 찾기
  var Opencourses = await models.Opencourse.findAll({
    where: {subject_title: sub_fix_list},
    attributes: ['subject_title','class_day','start_time','end_time'],
    raw: true
  });

  console.log(Opencourses);
  var sub_fix_timetable_list=[]
  for (i in sub_fix_list){
    sub_fix_timetable_json=[];
    for(j in Opencourses){
      if (Opencourses[j].subject_title==sub_fix_list[i]){
        var sub_fix_timetable={class_day: Opencourses[j].class_day, start_time: Opencourses[j].start_time, end_time: Opencourses[j].end_time}
        sub_fix_timetable_json.push(sub_fix_timetable);
      }
    }
    var title =sub_fix_list[i];
    sub_fix_timetable_with_title={title: title, timetable: sub_fix_timetable_json};
    sub_fix_timetable_list.push(sub_fix_timetable_with_title);
  }

  console.log(sub_fix_timetable_list);

  var tt_matrix_list_new=[];

  for(i in tt_matrix_list){
    var tt_matrix = tt_matrix_list[i].matrix;
      for (j in sub_fix_timetable_list[0].timetable){
        // 고정과목 1 분반리스트 중 하나가 timetable이랑 맞으면 true, 아니면 false
        matchTimetable(tt_matrix, sub_fix_timetable_list[j].timetable[k]); 
      }
  }

}


var matchTimetable = function(tt_matrix, time){

  var day_list = changeDayToNum(time.class_day);
  var start_time = time.start_time;
  var end_time = time.end_time;
  start_time = parseInt(start_time)-1;
  end_time = parseInt(end_time)-1;

  for(i in day_list){
    if(start_time == end_time){
      var a = tt_matrix.subset(math.index(start_time,day_list[i]));
      console.log(a);
      if (!(math.equal(a,1))) return false;
    }
    else{
      var a = tt_matrix.subset(math.index([start_time,end_time],day_list[i]));
      console.log(a);
      if (!(math.deepEqual(a,[1,1]))) return false;
    }
  }
  return true;
}



// day data int로 변경
var changeDayToNum= function(day){
  var day_list=[];

  if(day.includes(',')){
    day_list=day.split(',');
  }
  else day_list=[day];
  
  for(i in day_list){
    if (day_list[i]=='월') day_list[i]=0;
    else if (day_list[i]=='화') day_list[i]=1;
    else if (day_list[i]=='수') day_list[i]=2;
    else if (day_list[i]=='목') day_list[i]=3;
    else day_list[i]=4;
  }

  return day_list;
}