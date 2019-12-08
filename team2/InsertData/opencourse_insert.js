module.exports = function(){
  var fs = require('fs');
  var csv = require('csv');
  var Opencourse = require('../models').Opencourse;

  var input = fs.createReadStream(__dirname+'/opencourse.csv');
  var parser = csv.parse({
    delimiter: ',',
    columns: true
  })

  var transform = csv.transform(function(row) {
    var resultObj = {
      major: row['major'],
      subject_code: row['subject_code'],
      subject_class: row['subject_class'],
      subject_title: row['subject_title'],
      class_day: row['class_day'],
      start_time: row['start_time'],
      end_time: row['end_time'],
      prof_name: row['prof_name'],
      prof_email: row['prof_email']
    }
    Opencourse.create(resultObj)
      .then(function() {
        console.log('Record created')
      })
      .catch(function(err) {
        console.log('Error encountered: ' + err)
      })
  })

  input.pipe(parser).pipe(transform);
}