module.exports = function(){
  var fs = require('fs');
  var csv = require('csv');
  var Yoram = require('../models').Yoram;

  var input = fs.createReadStream(__dirname+'/yoram.csv');
  var parser = csv.parse({
    delimiter: ',',
    columns: true
  })

  var transform = csv.transform(function(row) {
    var resultObj = {
      yoram_year: row['yoram_year'],
      major: row['major'],
      subject_code: row['subject_code'],
      subject_name: row['subject_name'],
      recom_year: row['recom_year'],
      category: row['category'],
      major1_prop: row['major1_prop'],
      major2_prop: row['major2_prop'],
      credit: row['credit']
    }
    Yoram.create(resultObj)
      .then(function() {
        console.log('Record created')
      })
      .catch(function(err) {
        console.log('Error encountered: ' + err)
      })
  })

  input.pipe(parser).pipe(transform);
}