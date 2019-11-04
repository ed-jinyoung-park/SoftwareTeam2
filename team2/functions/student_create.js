var models = require('../entities');

function saveInfo(AccountInfo){
  var user = AccountInfo;
  models.student.create({
    name: user.user_name,
    adm_year: user.user_number,
    semester: user.semester,
    major1: user.major1,
    major2: user.major2,
    major3: user.major3
  });
}

module.exports=saveInfo;