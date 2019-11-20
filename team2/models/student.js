'use strict';
module.exports = (sequelize, DataTypes) => {
  const student = sequelize.define('student', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false, 
      autoIncrement: true
    },
    st_name: {type: DataTypes.STRING, allowNull: false},
    adm_year: {type: DataTypes.STRING, allowNull: false},
    semester: {type: DataTypes.STRING, allowNull: false},
    major1: {type: DataTypes.STRING, allowNull: false},
    major2: {type: DataTypes.STRING, allowNull: true},
    major3: {type: DataTypes.STRING, allowNull: true}
  }, {});
  student.associate = function(models) {
    // associations can be defined here
  };
  return student;
};