module.exports = function(){
  var fs = require('fs');
  var csv = require('csv');
  var Subject = require('./models').subject;

  var input = fs.createReadStream('./subject.csv');
  var parser = csv.parse({
    delimiter: ',',
    columns: true
  })

  var transform = csv.transform(function(row) {
    var resultObj = {
      code: row['subject_code'],
      title: row['title']
    }
    Subject.create(resultObj)
      .then(function() {
        console.log('Record created')
      })
      .catch(function(err) {
        console.log('Error encountered: ' + err)
      })
  })

  input.pipe(parser).pipe(transform);
}