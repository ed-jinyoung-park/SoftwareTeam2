'use strict';

module.exports = function (sequelize, DataTypes) {
  
  const student = sequelize.define('student', {
    id: { field: 'id', type: DataTypes.INTEGER, unique: true, allowNull: false,primaryKey: true, autoIncrement: true },
    name: { field: 'name', type: DataTypes.STRING(30), allowNull: false },
    adm_year: { field: 'adm_year', type: DataTypes.STRING(30), allowNull: false },
    semester: { field: 'semester', type: DataTypes.STRING(30), allowNull: false },
    major1: { field: 'major1', type: DataTypes.STRING(30), allowNull: false },
    major2: { field: 'major2', type: DataTypes.STRING(30), allowNull: true },
    major3: { field: 'major3', type: DataTypes.STRING(30), allowNull: true },
  }, 
  {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    tableName: 'student'
  });
  
  return student;
};