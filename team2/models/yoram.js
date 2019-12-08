'use strict';
module.exports = (sequelize, DataTypes) => {
  const Yoram = sequelize.define('Yoram', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false, 
      autoIncrement: true
    },
    yoram_year: {type: DataTypes.INTEGER, allowNull: false},
    major: {type: DataTypes.STRING, allowNull: false},
    subject_name: {type: DataTypes.STRING, allowNull: false},
    recom_year: {type: DataTypes.STRING, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: true},
    major1_prop: {type: DataTypes.STRING, allowNull: false},
    major2_prop: {type: DataTypes.STRING, allowNull: true},
    credit: {type: DataTypes.INTEGER, allowNull: false}
  }, {});
  Yoram.associate = function(models) {
  };
  return Yoram;
};
