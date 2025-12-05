// Утилита для форматирования и конвертации валюты

const currencySymbols: Record<string, string> = {
  KZT: '₸',
  USD: '$',
  EUR: '€',
  RUB: '₽',
};

// Кэш для курсов валют
let exchangeRatesCache: Record<string, number> | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 3600000; // 1 час

// Получить курсы валют
export const getExchangeRates = async (): Promise<Record<string, number>> => {
  const now = Date.now();
  
  // Проверяем кэш
  if (exchangeRatesCache && (now - cacheTimestamp) < CACHE_TTL) {
    return exchangeRatesCache;
  }

  try {
    // Создаём AbortController для таймаута
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_BASE_URL}/exchange/rates`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    
    // Сохраняем в кэш
    exchangeRatesCache = {
      KZT: data.KZT || 1,
      USD: data.USD || 0.0022,
      EUR: data.EUR || 0.0020,
      RUB: data.RUB || 0.20,
    };
    cacheTimestamp = now;
    
    return exchangeRatesCache;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Fallback курсы (используем кэш, если есть, иначе дефолтные)
    if (exchangeRatesCache) {
      return exchangeRatesCache;
    }
    return {
      KZT: 1,
      USD: 0.0022,
      EUR: 0.0020,
      RUB: 0.20,
    };
  }
};

// Конвертировать сумму из одной валюты в другую
export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  if (fromCurrency === toCurrency) return amount;
  
  const rates = await getExchangeRates();
  
  // Конвертируем через KZT как базовую валюту
  // Сначала в KZT, потом в целевую валюту
  const amountInKZT = amount / rates[fromCurrency];
  const convertedAmount = amountInKZT * rates[toCurrency];
  
  return convertedAmount;
};

// Форматировать валюту с конвертацией
export const formatCurrency = (amount: number, currency: string = 'KZT'): string => {
  const symbol = currencySymbols[currency] || currency;
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
};

// Форматировать валюту с конвертацией (асинхронная версия)
export const formatCurrencyWithConversion = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<string> => {
  const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
  return formatCurrency(convertedAmount, toCurrency);
};

export const getCurrencySymbol = (currency: string = 'KZT'): string => {
  return currencySymbols[currency] || currency;
};

