module.exports = function(){
  var fs = require('fs');
  var csv = require('csv');
  var Student = require('../models').student;
  var Timetable = require('../models').Timetable;

  var input = fs.createReadStream(__dirname+'/testdata.csv');
  var parser = csv.parse({
    delimiter: ',',
    columns: true
  })

  var transform = csv.transform(function(row) {
    
    var resultObj ={
      studentId: row['studentId'],
      title: row['title'],
      day: row['day'],
      start_time: row['starttime'],
      end_time: row['endtime']
    }

    Timetable.create(resultObj)
    .then(function() {
      console.log('Record created')
    })
    .catch(function(err) {
      console.log('Error encountered: ' + err)
    })  

    
  })

  input.pipe(parser).pipe(transform);
}
