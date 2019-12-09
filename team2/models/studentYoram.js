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
    subject_name: {type: DataTypes.STRING, allowNull: false},
    recom_year: {type: DataTypes.STRING, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: true},
    major1_prop: {type: DataTypes.STRING, allowNull: false},
    major2_prop: {type: DataTypes.STRING, allowNull: true},
    credit: {type: DataTypes.INTEGER, allowNull: false}
  }, {});
  StudentYoram.associate = function(models) {
  };
  return StudentYoram;
};