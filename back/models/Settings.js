const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Settings = sequelize.define("Settings", {
  currency: { 
    type: DataTypes.STRING, 
    defaultValue: 'KZT' 
  },
  language: { 
    type: DataTypes.STRING, 
    defaultValue: 'en' 
  },
  theme: { 
    type: DataTypes.ENUM("light", "dark", "system"), 
    defaultValue: 'dark' 
  },
  name: { 
    type: DataTypes.STRING 
  },
  email: { 
    type: DataTypes.STRING 
  }
});

// Связь с User
User.hasOne(Settings, { foreignKey: "userId" });
Settings.belongsTo(User, { foreignKey: "userId" });

module.exports = Settings;

