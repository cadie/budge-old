module.exports = function(sequelize, DataTypes) {
    var Budget = sequelize.define("Budget", {
      text: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      email:DataTypes.STRING,
      fullname:DataTypes.STRING,
      income: DataTypes.INTEGER,
      sum: DataTypes.INTEGER,
      
    });
    return Budget;
  };
  