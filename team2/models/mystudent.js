'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mysubject = sequelize.define('Mysubject', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false, 
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      references:{
        model: 'students',
        key: 'id'
      },
      allowNull: false
    },
    subjectId: {
      type: DataTypes.INTEGER,
      references:{
        model: 'subjects',
        key: 'id'
      },
      allowNull: false
    },
  }, {});
  Mysubject.associate = function(models) {
  };
  return Mysubject;
};