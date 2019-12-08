'use strict';
module.exports = (sequelize, DataTypes) => {
  const Opencourse = sequelize.define('Opencourse', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false, 
      autoIncrement: true
    },
    major: {type: DataTypes.STRING, allowNull: false},
    subject_code:{type: DataTypes.STRING, allowNull: false},
    subject_class: {type: DataTypes.STRING, allowNull: false},
    subject_title: {type: DataTypes.STRING, allowNull: false},
    class_day: {type: DataTypes.STRING, allowNull: false},
    start_time: {type: DataTypes.STRING, allowNull: false},
    end_time: {type: DataTypes.STRING, allowNull: false},
    prof_name: {type: DataTypes.STRING, allowNull: true},
    prof_email: {type: DataTypes.STRING, allowNull: true},
  }, {});
  Opencourse.associate = function(models) {
  };
  return Opencourse;
};