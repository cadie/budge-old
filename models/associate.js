module.exports = function(sequelize, DataTypes) {

  Associate = sequelize.define('Associate', {
      total: DataTypes.INTEGER
  })
   
  // User.belongsToMany(Budget, { through: Associate })
  // Budget.belongsToMany(User, { through: Associate })

  return Associate;
};
