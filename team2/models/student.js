module.exports=(sequelize, DataTypes) => {
  const student = sequelize.define('student',{
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {type: DataTypes.STRING, allowNull: false},
    adm_year: {type: DataTypes.STRING, allowNull: false},
    semester: {type: DataTypes.STRING, allowNull: false},
    major1: {type: DataTypes.STRING, allowNull: false},
    major2: {type: DataTypes.STRING, allowNull: true},
    major3: {type: DataTypes.STRING, allowNull: true}     
  },
  {
    timestamps: false
  });
  return student;
};