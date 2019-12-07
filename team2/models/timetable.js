'use strict';
module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define('Timetable', {
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
    title: {type: DataTypes.STRING, allowNull: false},
    day:{type: DataTypes.STRING, allowNull: false},
    start_time: {type: DataTypes.STRING, allowNull: false},
    end_time: {type: DataTypes.STRING, allowNull: false}
  }, {});
  Timetable.associate = function(models) {
  };
  return Timetable;
};