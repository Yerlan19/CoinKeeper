const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Category = require("./Category");

const Transaction = sequelize.define("Transaction", {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING }
});

// Связи
User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User);

Category.hasMany(Transaction, { foreignKey: "categoryId" });
Transaction.belongsTo(Category);

module.exports = Transaction;
