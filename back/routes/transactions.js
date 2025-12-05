const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Category = require('../models/Category');

// GET all transactions
router.get('/', async (req, res) => {
  const transactions = await Transaction.findAll({
    include: [User, Category]
  });
  res.json(transactions);
});

// GET all transactions for specific user
router.get('/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const transactions = await Transaction.findAll({
    where: { userId },
    include: [User, Category],
  });
  res.json(transactions);
});

// GET all transactions by category
router.get('/category/:categoryId', async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const transactions = await Transaction.findAll({
    where: { categoryId },
    include: [User, Category],
  });
  res.json(transactions);
});

// GET transaction by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const transaction = await Transaction.findByPk(id, { include: [User, Category] });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json(transaction);
});

// POST new transaction
router.post('/new-transaction', async (req, res) => {
  const { user_id, userId, amount, type, category_id, categoryId, comment, description, date, currency } = req.body;
  try {
    const transaction = await Transaction.create({
      userId: userId || user_id,
      amount,
      type,
      categoryId: categoryId || category_id,
      description: description || comment,
      comment: comment || description,
      date: date || new Date().toISOString(),
      currency: currency || 'KZT' // Сохраняем валюту транзакции
    });
    res.status(201).json(transaction);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// UPDATE transaction
router.put('/update/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    
    // Нормализуем поля (поддержка обоих форматов)
    const updateData = {
      ...req.body,
      userId: req.body.userId || req.body.user_id,
      categoryId: req.body.categoryId || req.body.category_id,
      comment: req.body.comment || req.body.description,
      description: req.body.description || req.body.comment,
    };
    
    // Удаляем дубликаты
    delete updateData.user_id;
    delete updateData.category_id;
    
    await transaction.update(updateData);
    
    // Перезагружаем транзакцию с связанными данными
    const updatedTransaction = await Transaction.findByPk(id, { include: [User, Category] });
    res.json(updatedTransaction);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE transaction
router.delete('/delete/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await Transaction.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;