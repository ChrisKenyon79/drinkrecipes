'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      drinkName: {
        type: Sequelize.STRING
      },
      drinkIng1: {
        type: Sequelize.STRING
      },
      drinkIng2: {
        type: Sequelize.STRING
      },
      drinkIng3: {
        type: Sequelize.STRING
      },
      drinkIng4: {
        type: Sequelize.STRING
      },
      drinkIng5: {
        type: Sequelize.STRING
      },
      drinkMeasure1: {
        type: Sequelize.STRING
      },
      drinkMeasure2: {
        type: Sequelize.STRING
      },
      drinkMeasure3: {
        type: Sequelize.STRING
      },
      drinkMeasure4: {
        type: Sequelize.STRING
      },
      drinkMeasure5: {
        type: Sequelize.STRING
      },
      drinkInstruction: {
        type: Sequelize.STRING
      },
      modification: {
        type: Sequelize.TEXT
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('recipes');
  }
};