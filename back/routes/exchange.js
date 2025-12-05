const express = require('express');
const router = express.Router();
const axios = require('axios');

// Кэш для курсов валют (обновляется раз в час)
let exchangeRatesCache = {
  data: null,
  timestamp: null,
  TTL: 3600000 // 1 час в миллисекундах
};

// Получить курсы валют
router.get('/rates', async (req, res) => {
  try {
    const now = Date.now();
    
    // Проверяем кэш
    if (exchangeRatesCache.data && exchangeRatesCache.timestamp && 
        (now - exchangeRatesCache.timestamp) < exchangeRatesCache.TTL) {
      return res.json(exchangeRatesCache.data);
    }

    // Используем бесплатный API exchangerate-api.com (без ключа для базовых валют)
    // Альтернатива: можно использовать fixer.io, openexchangerates.org и т.д.
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/KZT');
    
    const rates = {
      KZT: 1,
      USD: response.data.rates.USD || 0.0022,
      EUR: response.data.rates.EUR || 0.0020,
      RUB: response.data.rates.RUB || 0.20,
      timestamp: now
    };

    // Обновляем кэш
    exchangeRatesCache = {
      data: rates,
      timestamp: now
    };

    res.json(rates);
  } catch (error) {
    console.error('Exchange rate API error:', error.message);
    
    // Fallback: используем примерные курсы, если API недоступен
    const fallbackRates = {
      KZT: 1,
      USD: 0.0022, // ~450 KZT = 1 USD
      EUR: 0.0020, // ~500 KZT = 1 EUR
      RUB: 0.20,   // ~5 KZT = 1 RUB
      timestamp: Date.now(),
      fallback: true
    };
    
    res.json(fallbackRates);
  }
});

module.exports = router;

