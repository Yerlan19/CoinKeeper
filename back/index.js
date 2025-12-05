require('dotenv').config();
const sequelize = require("./db");
const User = require("./models/User");
const Category = require("./models/Category");
const Transaction = require("./models/Transaction");
const Settings = require("./models/Settings");
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Настройка CORS
// Разрешенные домены для production
const allowedOrigins = [
  // Локальная разработка
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  // Vercel домены
  /^https:\/\/.*\.vercel\.app$/,
  // Кастомный домен из переменных окружения
  process.env.FRONTEND_URL,
].filter(Boolean); // Убираем undefined значения

app.use(cors({
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (например, Postman, мобильные приложения)
    if (!origin) {
      return callback(null, true);
    }
    
    // Проверяем каждый разрешенный origin
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // В production логируем заблокированные запросы для отладки
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️ CORS blocked origin:', origin);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Middleware для JSON
app.use(express.json());

// ✅ Подключение маршрутов
app.use('/users', require('./routes/user'));
app.use('/transactions', require('./routes/transactions'));
app.use('/categories', require('./routes/categories'));
app.use('/statistics', require('./routes/statistics'));
app.use('/settings', require('./routes/settings'));
app.use('/exchange', require('./routes/exchange'));

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
