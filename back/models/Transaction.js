const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Category = require("./Category");

const Transaction = sequelize.define("Transaction", {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  type: { type: DataTypes.ENUM("income", "expense"), allowNull: false },
  description: { type: DataTypes.STRING },
  comment: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  currency: { type: DataTypes.STRING, defaultValue: 'KZT' } // Валюта, в которой была создана транзакция
});

// Связи
User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User);

Category.hasMany(Transaction, { foreignKey: "categoryId" });
Transaction.belongsTo(Category);

module.exports = Transaction;
