'use strict';
module.exports = (sequelize, DataTypes) => {
  const subject = sequelize.define('subject', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false, 
      autoIncrement: true
    },
    code: {type: DataTypes.STRING, allowNull: false},
    title:{type: DataTypes.STRING, allowNull: false}
  }, {});
  subject.associate = function(models) {
    // associations can be defined here
  };
  return subject;
};