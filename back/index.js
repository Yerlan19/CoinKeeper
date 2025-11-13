const sequelize = require("./db");
const User = require("./models/User");
const Category = require("./models/Category");
const Transaction = require("./models/Transaction");
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Настройка CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware для JSON
app.use(express.json());

// ✅ Подключение маршрутов
app.use('/users', require('./routes/user'));
app.use('/transactions', require('./routes/transactions'));
app.use('/categories', require('./routes/categories'));
app.use('/statistics', require('./routes/statistics'));
app.use('/settings', require('./routes/settings'));

// ✅ Список доступных эндпоинтов (для проверки в браузере)
const explonation = {
  users: {
    "/": "GET all users",
    "/me": "GET current user (requires authentication)",
    "/register": "POST register new user",
    "/login": "POST login existing user",
  },
  transactions: {
    "/": "GET all transactions",
    "/user/:userId": "GET all transactions for specific user",
    "/new-transaction": "POST create new transaction",
  },
  categories: {
    "/": "GET all categories",
    "/new-category": "POST create new category",
  },
  statistics: {
    "/user/:userId": "GET financial statistics for user",
  },
  settings: {
    "/user/:userId": "GET user settings",
  }
};

// ✅ Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Personal Finance API",
    endpoints: explonation,
    note: "Use Authorization header for protected routes"
  });
});

// ✅ Запуск сервера (только если не тест)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  sequelize.sync({ alter: true })
    .then(() => {
      console.log("✅ Database synced");
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err);
    });
}

// ✅ Экспорт приложения для тестов
module.exports = app;
