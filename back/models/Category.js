const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Category = sequelize.define("Category", {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM("income", "expense"), allowNull: false },
  color: { type: DataTypes.STRING },
  icon: { type: DataTypes.STRING }
});

// Связь с User (опционально, если категории персональные)
User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });

module.exports = Category;
