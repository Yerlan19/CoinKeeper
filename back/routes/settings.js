const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const User = require('../models/User');

// GET settings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let settings = await Settings.findOne({ where: { userId }, include: [User] });
    
    if (!settings) {
      // Создаём настройки по умолчанию
      settings = await Settings.create({ 
        userId, 
        theme: 'dark',
        currency: 'KZT',
        language: 'en'
      });
    }
    
    // Если есть связанный User, добавляем name и email из него
    const user = await User.findByPk(userId);
    const response = {
      id: settings.id,
      user_id: userId,
      currency: settings.currency || 'KZT',
      language: settings.language || 'en',
      theme: settings.theme || 'dark',
      name: settings.name || user?.username || '',
      email: settings.email || user?.username || ''
    };
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user settings
router.put('/update/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let settings = await Settings.findOne({ where: { userId } });
    
    if (!settings) {
      settings = await Settings.create({ userId, ...req.body });
    } else {
      await settings.update(req.body);
    }
    
    // Если есть связанный User, добавляем name и email из него
    const user = await User.findByPk(userId);
    const response = {
      id: settings.id,
      user_id: userId,
      currency: settings.currency || 'KZT',
      language: settings.language || 'en',
      theme: settings.theme || 'dark',
      name: settings.name || user?.username || '',
      email: settings.email || user?.username || ''
    };
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;