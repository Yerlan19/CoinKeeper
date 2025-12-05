import axios from 'axios';

const API_URL = 'http://localhost:3000/exchange';

export interface ExchangeRates {
  KZT: number;
  USD: number;
  EUR: number;
  RUB: number;
  timestamp?: number;
  fallback?: boolean;
}

export const getExchangeRates = async (): Promise<ExchangeRates> => {
  const res = await axios.get<ExchangeRates>(`${API_URL}/rates`);
  return res.data;
};

