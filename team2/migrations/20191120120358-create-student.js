'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      st_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      adm_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      semester: {
        type: Sequelize.STRING,
        allowNull: false
      },
      major1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      major2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      major3: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('students');
  }
};