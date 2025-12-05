const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Общая статистика по пользователю
router.get('/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const transactions = await Transaction.findAll({ where: { userId }});
  const categories = await Category.findAll();

  // Посчитать баланс, доходы, расходы
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  // Статистика по категориям
  const categoryStats = categories.map(category => {
    const catTransactions = transactions.filter(t => t.categoryId === category.id);
    const catTotal = catTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      category_id: category.id,
      category_name: category.name,
      total: catTotal,
      type: category.type,
      transaction_count: catTransactions.length
    };
  });

  res.json({
    user_id: userId,
    balance,
    total_income: income,
    total_expenses: expenses,
    transaction_count: transactions.length,
    category_stats: categoryStats,
    recent_transactions: transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  });
});

// GET статистика по определенной категории
router.get('/category/:categoryIds', (req, res) => {
  const { transactions, categories } = getFreshData();
  
  // Разделить идентификаторы категорий, разделенные запятыми, и преобразовать в числа
  const categoryIds = req.params.categoryIds.split(',').map(id => parseInt(id.trim()));
  
  // Проверить наличие всех идентификаторов категорий
  const invalidCategories = categoryIds.filter(id => 
    !categories.some(c => c.id === id)
  );
  
  if (invalidCategories.length > 0) {
    return res.status(404).json({ 
      message: 'Some categories not found',
      invalidCategories 
    });
  }
  
  // Получить данные по всем запрошенным категориям
  const categoryStats = categoryIds.map(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    const catTransactions = transactions.filter(t => 
      t.category_id.includes(categoryId)
    );
    
    const catTotal = catTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      category_id: categoryId,
      category_name: category.name,
      type: category.type,
      total_amount: catTotal,
      transaction_count: catTransactions.length,
      average_amount: catTotal / (catTransactions.length || 1),
      transactions: catTransactions
    };
  });
  
  // Рассчитать общие итоги
  const combinedStats = {
    total_amount: categoryStats.reduce((sum, cat) => sum + cat.total_amount, 0),
    transaction_count: categoryStats.reduce((sum, cat) => sum + cat.transaction_count, 0),
    categories: categoryStats
  };
  
  res.json(combinedStats);
});

// GET статистика по определенной категории по конкретному пользователю
router.post('/user/categories', (req, res) => {
  const { transactions, categories } = getFreshData();
  const { userId, categoryIds } = req.body;
  
  // Проверить наличие userId и categoryIds в теле запроса
  if (!userId || !categoryIds) {
    return res.status(400).json({ 
      message: 'userId and categoryIds are required in the request body' 
    });
  }
  
  // Преобразовать categoryIds в массив чисел (если это строка с разделителями)
  const categoryIdsArray = Array.isArray(categoryIds) 
    ? categoryIds.map(id => parseInt(id))
    : String(categoryIds).split(',').map(id => parseInt(id.trim()));
  
  // Проверить наличие всех идентификаторов категорий
  const invalidCategories = categoryIdsArray.filter(id => 
    !categories.some(c => c.id === id)
  );
  
  if (invalidCategories.length > 0) {
    return res.status(404).json({ 
      message: 'Some categories not found',
      invalidCategories 
    });
  }
  
  // Получить данные по всем запрошенным категориям
  const categoryStats = categoryIdsArray.map(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    const catTransactions = transactions.filter(t => 
      t.category_id.includes(categoryId) && t.user_id === userId
    );
    
    const catTotal = catTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      category_id: categoryId,
      category_name: category.name,
      type: category.type,
      total_amount: catTotal,
      transaction_count: catTransactions.length,
      average_amount: catTotal / (catTransactions.length || 1),
      transactions: catTransactions
    };
  });
  
  // Рассчитать общие итоги
  const combinedStats = {
    user_id: userId,
    total_amount: categoryStats.reduce((sum, cat) => sum + cat.total_amount, 0),
    transaction_count: categoryStats.reduce((sum, cat) => sum + cat.transaction_count, 0),
    categories: categoryStats
  };
  
  res.json(combinedStats);
});

router.get('/user/:userId/transactions-by-month', (req, res) => {
  const { transactions, categories } = getFreshData();
  const userId = parseInt(req.params.userId);

  // Фильтруем транзакции по пользователю
  const userTransactions = transactions.filter(t => t.user_id === userId);

  if (userTransactions.length === 0) {
    return res.status(404).json({ 
      message: 'No transactions found for this user'
    });
  }

  // Группируем транзакции по месяцам
  const transactionsByMonth = userTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        transactions: [],
        total_amount: 0,
        categories: {}
      };
    }

    acc[monthYear].transactions.push(transaction);
    acc[monthYear].total_amount += transaction.amount;

    // Группируем по категориям внутри месяца
    transaction.category_id.forEach(catId => {
      if (!acc[monthYear].categories[catId]) {
        const category = categories.find(c => c.id === catId);
        acc[monthYear].categories[catId] = {
          category_id: catId,
          category_name: category?.name || 'Unknown',
          type: category?.type || 'other',
          total_amount: 0,
          transaction_count: 0
        };
      }
      acc[monthYear].categories[catId].total_amount += transaction.amount;
      acc[monthYear].categories[catId].transaction_count += 1;
    });

    return acc;
  }, {});

  // Преобразуем объект в массив и добавляем дополнительную статистику
  const result = Object.values(transactionsByMonth).map(monthData => ({
    month: monthData.month,
    total_amount: monthData.total_amount,
    transaction_count: monthData.transactions.length,
    average_amount: monthData.total_amount / (monthData.transactions.length || 1),
    categories: Object.values(monthData.categories),
    transactions: monthData.transactions
  }));

  // Сортируем по дате (от новых к старым)
  result.sort((a, b) => new Date(b.month) - new Date(a.month));

  res.json({
    user_id: userId,
    total_transactions: userTransactions.length,
    total_amount: userTransactions.reduce((sum, t) => sum + t.amount, 0),
    months: result
  });
});

module.exports = router;