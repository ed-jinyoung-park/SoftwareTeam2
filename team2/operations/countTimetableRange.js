var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var models = require('../models/index');
var math = require('mathjs');



module.exports= function(tt_matrix){
  var tt_matrix = math.matrix(tt_matrix);
  // 오전
  var tt_list_am = tt_matrix.subset(math.index([0,1],[0,1,2,3,4,5]))._data;
  var tt_list_am_count = 0;
  
  for(i in tt_list_am){
    for (j in tt_list_am[i]){
      if((tt_list_am[i][j])==1) tt_list_am_count+=1;
    }
  }

  var tt_list_pm= tt_matrix.subset(math.index([4,5],[0,1,2,3,4,5]))._data;
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
