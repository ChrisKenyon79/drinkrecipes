'use strict';
module.exports = function(sequelize, DataTypes) {
  var recipe = sequelize.define('recipe', {
    userId: DataTypes.INTEGER,
    drinkName: DataTypes.STRING,
    drinkIng1: DataTypes.STRING,
    drinkIng2: DataTypes.STRING,
    drinkIng3: DataTypes.STRING,
    drinkIng4: DataTypes.STRING,
    drinkIng5: DataTypes.STRING,
    drinkMeasure1: DataTypes.STRING,
    drinkMeasure2: DataTypes.STRING,
    drinkMeasure3: DataTypes.STRING,
    drinkMeasure4: DataTypes.STRING,
    drinkMeasure5: DataTypes.STRING,
    drinkInstruction: DataTypes.STRING,
    modification: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.recipe.belongsTo(models.user);

      }
    }
  });
  return recipe;
};