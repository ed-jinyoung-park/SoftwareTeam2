var express = require('express');
var SVDJS = require('svd-js');
var math = require('mathjs');
var models = require('../models/index');

// module.exports = setTimetableScore;

module.exports = async function(studentId){
  
  var student = await models.student.findOne({
    where: {id: studentId}
  });
  student = student.dataValues;
  console.log(student);

  var sameStudentList = await models.student.findAll({
    where: {semester: student.semester, major1: student.major1, major2: student.major2, major3: student.major3}
  });
  sameStudentList = sameStudentList.map(student => student.id);
  sameStudentList.splice(studentId-1,1);

  var tt_list_all = await models.Timetable.findAll({
    where: {studentId: sameStudentList},
    attributes: ['id','studentId','title','day','start_time','end_time'],
    raw: true
  });

  
  var tt_matrix_list=[];
  
  for(i in sameStudentList){
    var tt_list_one=[]; // student 1명의 시간표
    var id = sameStudentList[i];
    for(j in tt_list_all){
      if(sameStudentList[i]==tt_list_all[j].studentId){
        tt_list_one.push(tt_list_all[j]);
      }
    }

    // student 1명의 시간표 matrix  
    var tt_matrix = math.matrix([
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ]);

    var title_matrix=[
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ]

    // 1개의 matrix 생성
    for (k in tt_list_one){
      tt_matrix = makeMatrix(tt_list_one[k], tt_matrix);
      title_matrix = makeTitleMatrix(tt_list_one[k],title_matrix); 
    }

    var svd_q = math.sum(SVDJS.SVD(tt_matrix._data).q);
    
    var tt_matrix_json={id: id, matrix: tt_matrix._data, title_matrix: title_matrix, timetable: tt_list_one, score: svd_q}
    // matrix List에 id 값과 함께 matrix를 push
    tt_matrix_list.push(tt_matrix_json);
  }

  console.log(tt_matrix_list);

  return tt_matrix_list;
}


// 수업 1개에 대해 matrix 만들기
var makeMatrix= function(tt_list_one_class, tt_matrix){
  
  var day_list=changeDayToNum(tt_list_one_class.day);

  var start_time = tt_list_one_class.start_time.trim();
  var end_time = tt_list_one_class.end_time.trim();
  start_time = parseInt(start_time)-1;
  end_time = parseInt(end_time)-1;

  // index(행,열),값
  for(i in day_list){
    if(start_time==end_time){
      tt_matrix = math.subset(tt_matrix, math.index(start_time,day_list[i]),1);
    }
    else{
      tt_matrix = math.subset(tt_matrix, math.index([start_time,end_time],day_list[i]),[1,1])
    }
  }
  return tt_matrix;
}

var makeTitleMatrix = function(tt_list_one_class, title_matrix){
  var day_list=changeDayToNum(tt_list_one_class.day);

  var start_time = tt_list_one_class.start_time.trim();
  var end_time = tt_list_one_class.end_time.trim();
  start_time = parseInt(start_time)-1;
  end_time = parseInt(end_time)-1;

  // index(행,열),값
  for(i in day_list){
    if(start_time==end_time){
      title_matrix[start_time][day_list[i]]=tt_list_one_class.title;
    }
    else{
      title_matrix[start_time][day_list[i]]=tt_list_one_class.title;
      title_matrix[end_time][day_list[i]]=tt_list_one_class.title;
    }
  }
  return title_matrix;

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