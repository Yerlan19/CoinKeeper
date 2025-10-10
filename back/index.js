const sequelize = require("./db");         
const User = require("./models/User");     
const Category = require("./models/Category"); 
const Transaction = require("./models/Transaction"); 
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/users', require('./routes/user'));
app.use('/transactions', require('./routes/transactions'));
app.use('/categories', require('./routes/categories'));
app.use('/statistics', require('./routes/statistics'));
app.use('/settings', require('./routes/settings'));

const explonation = {
  "users": {
    "/": "GET all users",
    "/me": "GET current user (requires authentication)",
    "/register": "POST register new user",
    "/login": "POST login existing user",
    "/JWT_SECRET": "GET JWT secret key (for debugging)"
  },
  "transactions": {
    "/": "GET all transactions",
    "/user/:userId": "GET all transactions for specific user",
    "/category/:categoryId": "GET all transactions for specific category",
    "/:id": "GET specific transaction by ID",
    "/new-transaction": "POST create new transaction",
    "/update/:id": "PUT update existing transaction",
    "/delete/:id": "DELETE remove transaction",
    "/verify-password": "POST change password"
  },
  "categories": {
    "/": "GET all categories",
    "/user/:userId": "GET all categories for specific user",
    "/category/:categoryId": "GET specific category by ID",
    "/:id": "GET specific category by ID",
    "/new-category": "POST create new category",
    "/update/:id": "PUT update existing category",
    "/delete/:id": "DELETE remove category"
  },
  "statistics": {
    "/user/:userId": "GET financial statistics for specific user",
    "/category/:categoryIds": "GET statistics for one or multiple categories (comma-separated IDs)"
  },
  "settings": {
    "/user/:userId": "GET user settings",
    "/update/:userId": "PUT update user settings"
  }
};

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Personal Finance API",
    endpoints: explonation,
    note: "For protected routes, include Authorization header with Bearer token"
  });
});

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });