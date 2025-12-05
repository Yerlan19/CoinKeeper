import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchTransactions } from '../redux/slices/transactionSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchUserSettings } from '../redux/slices/settingsSlice';
import { createTransaction } from '../api/transactions';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { formatCurrency, convertCurrency } from '../utils/currency';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { items: transactions } = useAppSelector((state) => state.transactions);
  const { items: categoriesList } = useAppSelector((state) => state.categories);
  const { currentSettings } = useAppSelector((state) => state.settings);
  const token = useAppSelector((state) => state.auth.token);
  const currency = currentSettings?.currency || 'KZT';

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchTransactions());
      dispatch(fetchCategories());
      dispatch(fetchUserSettings(userId));
    }
  }, [dispatch, userId]);

  const [convertedBalance, setConvertedBalance] = useState<number>(0);

  // Конвертируем баланс в выбранную валюту
  useEffect(() => {
    let cancelled = false;
    
    const calculateBalance = async () => {
      try {
        let total = 0;
        for (const t of transactions) {
          if (cancelled) return;
          const txCurrency = t.currency || 'KZT';
          const convertedAmount = await convertCurrency(t.amount, txCurrency, currency);
          total += t.type === 'income' ? convertedAmount : -convertedAmount;
        }
        if (!cancelled) {
          setConvertedBalance(total);
        }
      } catch (error) {
        console.error('Error converting balance:', error);
        if (!cancelled) {
          // Fallback: просто суммируем без конвертации
          const total = transactions.reduce(
            (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
            0
          );
          setConvertedBalance(total);
        }
      }
    };
    
    if (transactions.length > 0) {
      calculateBalance();
    } else {
      setConvertedBalance(0);
    }
    
    return () => {
      cancelled = true;
    };
  }, [transactions, currency]);

  const handleAddTransaction = async () => {
    if (!amount || !category || !userId) return;

    const newTransaction = {
      user_id: userId,
      amount: parseFloat(amount),
      type,
      category_id: category,
      comment,
      date: new Date().toISOString().split('T')[0],
      currency: currency, // Сохраняем валюту, в которой создана транзакция
    };

    try {
      await createTransaction(newTransaction);
      dispatch(fetchTransactions());
    } catch (err) {
      console.error('Create error:', err);
    }

    setAmount('');
    setCategory(null);
    setComment('');
    setType('income');
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white dark:bg-slate-900 min-h-screen transition-colors text-black dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>

      <div className="bg-white dark:bg-gray-800 shadow rounded-md p-4 mb-6 transition-colors">
        <p className="text-lg font-medium">Current Balance:</p>
        <p
          className={`text-2xl font-bold ${
            convertedBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {formatCurrency(convertedBalance, currency)}
        </p>
      </div>

      <TransactionList transactions={transactions} categories={categoriesList} />

      <div className="text-center mt-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            + Add Transaction
          </button>
        ) : (
          <TransactionForm
            type={type}
            setType={setType}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            comment={comment}
            setComment={setComment}
            categoriesList={categoriesList}
            onCancel={() => setShowForm(false)}
            onSave={handleAddTransaction}
          />
        )}
      </div>
    </div>
  );
};
