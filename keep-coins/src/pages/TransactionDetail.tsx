import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Transaction } from '../types/types';
import { getTransactionById, updateTransaction } from '../api/transactions';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchUserSettings } from '../redux/slices/settingsSlice';
import { removeTransaction } from '../redux/slices/transactionSlice';
import { CategorySelector } from '../components/CategorySelector';
import { formatCurrency, convertCurrency } from '../utils/currency';

export const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.categories.items);
  const { currentSettings } = useAppSelector((state) => state.settings);
  const currency = currentSettings?.currency || 'KZT';
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const token = useAppSelector((state) => state.auth.token);
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    dispatch(fetchCategories());
    if (userId) {
      dispatch(fetchUserSettings(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!id || !userId) return;

    const fetchData = async () => {
      const tx = await getTransactionById(Number(id));
      setTransaction(tx);
      setSelectedCatId(tx.category_id);
      
      // Конвертируем сумму
      if (tx) {
        const txCurrency = tx.currency || 'KZT';
        const converted = await convertCurrency(tx.amount, txCurrency, currency);
        setConvertedAmount(converted);
      }
    };

    fetchData();
  }, [id, userId, currency]);

  const handleDelete = async () => {
    if (transaction?.id && confirm('Are you sure you want to delete this transaction?')) {
      await dispatch(removeTransaction(transaction.id));
      navigate('/dashboard');
    }
  };

  const handleSaveCategories = async () => {
    if (!transaction?.id || !selectedCatId) return;
    await updateTransaction(transaction.id, { category_id: selectedCatId });
    setEditing(false);
    navigate(0); // Reload
  };

  if (!transaction) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Loading transaction...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-[#081F5C] dark:text-white">
          Transaction Details
        </h2>

        <div className="text-gray-800 dark:text-gray-200 space-y-3 mt-6">
          <p>
            <span className="font-semibold">Category:</span>{' '}
            {categories.find((cat) => transaction.category_id === cat.id)?.name || '—'}
          </p>
          <p><span className="font-semibold">Type:</span> {transaction.type}</p>
          <p>
            <span className="font-semibold">Amount:</span>{' '}
            <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-500'}>
              {convertedAmount !== null 
                ? formatCurrency(convertedAmount, currency)
                : formatCurrency(transaction.amount, currency)}
              {transaction.currency && transaction.currency !== currency && (
                <span className="text-xs text-gray-500 ml-2">
                  (was {formatCurrency(transaction.amount, transaction.currency)})
                </span>
              )}
            </span>
          </p>
          <p><span className="font-semibold">Comment:</span> {transaction.comment || '—'}</p>
          <p><span className="font-semibold">Date:</span> {new Date(transaction.date).toLocaleDateString()}</p>
        </div>

        {editing ? (
          <>
            <CategorySelector
              type={transaction.type}
              selectedId={selectedCatId}
              setSelectedId={setSelectedCatId}
              categoriesList={categories}
            />

            <div className="flex gap-3 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSaveCategories}
              >
                💾 Save
              </button>
              <button
                className="text-gray-500 hover:underline"
                onClick={() => {
                  setSelectedCatId(transaction.category_id);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            className="text-blue-600 hover:underline text-sm mt-2"
            onClick={() => setEditing(true)}
          >
            ✏️ Edit Categories
          </button>
        )}

        <div className="flex gap-3 mt-6 justify-end">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => navigate(`/edit-transaction/${transaction.id}`)}
          >
            ✏️ Edit
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={handleDelete}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};
