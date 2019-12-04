'use strict';
module.exports = (sequelize, DataTypes) => {
  const condition = sequelize.define('condition', {
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

    //DataTypes.ARRAY(DataTypes.DECIMAL)
    grade_num: {type: DataTypes.STRING, allowNull: false},
    major_num: {type: DataTypes.INTEGER, allowNull: false},
    general_num: {type: DataTypes.INTEGER, allowNull: false},
    vacant_day: {type: DataTypes.STRING, allowNull: true,
      get() {
              return this.getDataValue('vacant_day').split(',')
          }
    },
    sub_fix_1: {type: DataTypes.STRING, allowNull: true},
    sub_fix_2: {type: DataTypes.STRING, allowNull: true},
    sub_fix_3: {type: DataTypes.STRING, allowNull: true},
    su_sub: {type: DataTypes.STRING, allowNull: true}
  }, {});
  condition.associate = function(models) {
  };
  return condition;
};
