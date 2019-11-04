var models = require('../entities');

function readInfo(id){
  return models.student.findOne({
    where:{id: id}
  });
}

function readInfos(){
  return models.student.findAll({
  });
}

module.exports = {readInfo, readInfos};  