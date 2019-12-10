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
var getYoramListForTimetable = require('../operations/getYoramListForTimetable');
var math = require('mathjs');

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
          major1: '컴퓨터공학',
          major2: '없음',
          major3: '없음'
        })
      }
      for(var i=21; i<=40;i++){
        models.student.create({
          adm_year: '19',
          semester: '2',
          major1: '경영학',
          major2: '없음',
          major3: '없음'
        })
      }
      for(var i=41; i<=60;i++){
        models.student.create({
          adm_year: '17',
          semester: '4',
          major1: '경제학',
          major2: '융합소프트웨어',
          major3: '없음'
        })
      }
      for(var i=61; i<=80;i++){
        models.student.create({
          adm_year: '19',
          semester: '4',
          major1: '사회학',
          major2: '경영학',
          major3: '없음'
        })
      }
      for(var i=81; i<=100;i++){
        models.student.create({
          adm_year: '18',
          semester: '3',
          major1: '신문방송학',
          major2: '없음',
          major3: '없음'
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
  var id=req.params.id;
  models.subject.findAll({
    attributes: ['title'],
    raw: true
  }).then(function(subjects){
    var subjects = subjects.map(subject => subject.title);
    res.render('./subject/create',{subjects: subjects, id: id});
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
  
  // 추천 0단계 - 같은 학기, 전공 학생들의 시간표 패턴 유사도 점수 구하기
  var tt_matrix_list=[];
  
  setTimetableScore(id).then(result=>{
    
    tt_matrix_list=result;

    var tt_matrix_am;
    var tt_matrix_pm;

    // score 순으로 sort
    var tt_matrix_median=getMedian(tt_matrix_list);
    
    // 오전대 많은 시간표, 오후대 많은 시간표 설정
    var tt_matrix_count = {am: 0, pm: 0};
    for (idx in tt_matrix_list){
      if(countTimetableRange(tt_matrix_list[idx].matrix).am>=tt_matrix_count.am){
        tt_matrix_count.am = countTimetableRange(tt_matrix_list[idx].matrix).am;
        tt_matrix_am=tt_matrix_list[idx];
      }
      if(countTimetableRange(tt_matrix_list[idx].matrix).pm>=tt_matrix_count.pm){
        tt_matrix_count.pm = countTimetableRange(tt_matrix_list[idx].matrix).pm;
        tt_matrix_pm=tt_matrix_list[idx];
      }
    }

    console.log(tt_matrix_median);
    console.log(tt_matrix_am);
    console.log(tt_matrix_pm);
    console.log(tt_matrix_median.timetable[0]);
    models.student.findOne({
      where: {id: id}
    }).then(student=>{
      res.render('./recomm/first',{
        tt_matrix_list: tt_matrix_list,
        tt_matrix_median: tt_matrix_median,
        tt_matrix_am: tt_matrix_am,
        tt_matrix_pm: tt_matrix_pm,
        student: student
      });
    })



  })
  .catch(err=>{
    console.log(err);
  })

  // getfilteredTimetableList(tt_matrix_list, 1);
 
});

// 추천 1단계 저장
router.post('/:id/recomm/second',function(req,res){
  var id = req.params.id;
  var selected = req.body.selected;
  // setYoramListForRecommendation(id).then(result=>{
  res.redirect('/student/'+id+'/recomm/second/'+selected);
  // });
})
 
router.get('/:id/recomm/second/:selected', function(req,res){
  var id = req.params.id;
  var selected = req.params.selected;
  console.log(selected);

  var tt_matrix_list=[];
  
  setTimetableScore(id).then(result=>{
    
    tt_matrix_list=result;

    var tt_matrix_am;
    var tt_matrix_pm;

    // score 순으로 sort
    var tt_matrix_median=getMedian(tt_matrix_list);
    
    // 오전대 많은 시간표, 오후대 많은 시간표 설정
    var tt_matrix_count = {am: 0, pm: 0};
    for (idx in tt_matrix_list){
      if(countTimetableRange(tt_matrix_list[idx].matrix).am>=tt_matrix_count.am){
        tt_matrix_count.am = countTimetableRange(tt_matrix_list[idx].matrix).am;
        tt_matrix_am=tt_matrix_list[idx];
      }
      if(countTimetableRange(tt_matrix_list[idx].matrix).pm>=tt_matrix_count.pm){
        tt_matrix_count.pm = countTimetableRange(tt_matrix_list[idx].matrix).pm;
        tt_matrix_pm=tt_matrix_list[idx];
      }
    }

    console.log(tt_matrix_median.timetable[0]);
    //console.log(tt_matrix_am);
    //console.log(tt_matrix_pm);

    models.student.findOne({
      where: {id: id}
    }).then(student=>{
      if(selected == 1){
        res.render('./recomm/second',{
          selectedMatrix: tt_matrix_median,
          student: student,
          selectedNum: 1
        });
      }
      else if(selected == 2){
        res.render('./recomm/second',{
          selectedMatrix: tt_matrix_am,
          student: student,
          selectedNum: 2
        });
      }
      else if(selected == 3){
        res.render('./recomm/second',{
          selectedMatrix: tt_matrix_pm,
          student: student,
          selectedNum: 3
        });
      }

    })
  })
  .catch(err=>{
    console.log(err);
  })

});

// 최종 추천 저장
router.post('/:id/recomm/save', function(req,res){
  var id = req.params.id;
  var selectedNum = req.body.selectedNum;
  console.log(selectedNum);

  var tt_matrix_list=[];
  
  setTimetableScore(id).then(result=>{
    
    tt_matrix_list=result;

    var tt_matrix_am;
    var tt_matrix_pm;

    // score 순으로 sort
    var tt_matrix_median=getMedian(tt_matrix_list);
    
    // 오전대 많은 시간표, 오후대 많은 시간표 설정
    var tt_matrix_count = {am: 0, pm: 0};
    for (idx in tt_matrix_list){
      if(countTimetableRange(tt_matrix_list[idx].matrix).am>=tt_matrix_count.am){
        tt_matrix_count.am = countTimetableRange(tt_matrix_list[idx].matrix).am;
        tt_matrix_am=tt_matrix_list[idx];
      }
      if(countTimetableRange(tt_matrix_list[idx].matrix).pm>=tt_matrix_count.pm){
        tt_matrix_count.pm = countTimetableRange(tt_matrix_list[idx].matrix).pm;
        tt_matrix_pm=tt_matrix_list[idx];
      }
    }

    console.log(tt_matrix_median.timetable[0]);
    //console.log(tt_matrix_am);
    //console.log(tt_matrix_pm);
    if (selectedNum ==1){
      for(idx in tt_matrix_median.timetable){
        models.Timetable.create({
          studentId: id,
          title: tt_matrix_median.timetable[idx].title,
          day: tt_matrix_median.timetable[idx].day,
          start_time: tt_matrix_median.timetable[idx].start_time,
          end_time: tt_matrix_median.timetable[idx].end_time,
        }).then(result=>{
          res.redirect('/');
        })
      }
    }
    if (selectedNum ==2){
      for(idx in tt_matrix_am.timetable){
        models.Timetable.create({
          studentId: id,
          title: tt_matrix_am.timetable[idx].title,
          day: tt_matrix_am.timetable[idx].day,
          start_time: tt_matrix_am.timetable[idx].start_time,
          end_time: tt_matrix_am.timetable[idx].end_time,
        }).then(result=>{
          res.redirect('/');
        })
      }
    }
    if (selectedNum ==3){
      for(idx in tt_matrix_pm.timetable){
        models.Timetable.create({
          studentId: id,
          title: tt_matrix_pm.timetable[idx].title,
          day: tt_matrix_pm.timetable[idx].day,
          start_time: tt_matrix_pm.timetable[idx].start_time,
          end_time: tt_matrix_pm.timetable[idx].end_time,
        }).then(result=>{
          res.redirect('/');
        })
      }
    }
    

  })
  .catch(err=>{
    console.log(err);
  })

});

// 중간값 구하는 함수
var getMedian= function(tt_matrix_list){
  var sorted=tt_matrix_list.sort(function(a, b){
    if(a.score > b.score){
      return 1;
    }
    if(a.score < b.score){
      return -1;
    }
    return 0;
  });

  var half = Math.floor(sorted.length/2);

  if(sorted.length % 2){
    return sorted[half];
  }
  else return sorted[half-1];
}

// 시간표 오전대, 오후대 시간 설정
var countTimetableRange= function(tt_matrix){
  var tt_matrix = math.matrix(tt_matrix);
  // 오전
  var tt_list_am = tt_matrix.subset(math.index([0,1],[0,1,2,3,4]))._data;
  var tt_list_am_count = 0;
  
  for(i in tt_list_am){
    for (j in tt_list_am[i]){
      if((tt_list_am[i][j])==1) tt_list_am_count+=1;
    }
  }

  var tt_list_pm= tt_matrix.subset(math.index([4,5],[0,1,2,3,4]))._data;
  var tt_list_pm_count = 0;
  
  for(i in tt_list_pm){
    for (j in tt_list_pm[i]){
      if((tt_list_pm[i][j])==1) tt_list_pm_count+=1;
    }
  }

  var tt_matrix_count={am: tt_list_am_count, pm: tt_list_pm_count};

  console.log(tt_matrix_count);
  return tt_matrix_count;
}
