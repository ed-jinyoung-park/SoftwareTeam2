'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentYoram = sequelize.define('StudentYoram', {
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
    yoramId: {
      type: DataTypes.INTEGER,
      references:{
        model: 'Yorams',
        key: 'id'
      },
      allowNull: false
    }
  }, {});
  StudentYoram.associate = function(models) {
  };
  return StudentYoram;
};