module.exports = function(sequelize, DataTypes) {
    var Associate = sequelize.define("Associate", {
      text: DataTypes.STRING,
      amount: DataTypes.INTEGER
      
    });
    return Associate;
  };
  