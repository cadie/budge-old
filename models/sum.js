module.exports = function(sequelize, DataTypes) {
    var Sum = sequelize.define("Sum", {
     sum_amount: DataTypes.INTEGER
      
    });
    return Sum;
  };
  