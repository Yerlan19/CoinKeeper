import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { editTransaction, removeTransaction } from '../../redux/slices/transactionSlice';
import type { Transaction, Category } from '../../types/types';
import { formatCurrency, convertCurrency } from '../../utils/currency';

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export const TransactionList = ({ transactions, categories }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentSettings } = useAppSelector((state) => state.settings);
  const currency = currentSettings?.currency || 'KZT';
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});
  const [convertedAmounts, setConvertedAmounts] = useState<Record<number, number>>({});

  // Конвертируем суммы транзакций
  useEffect(() => {
    const convertAmounts = async () => {
      const converted: Record<number, number> = {};
      for (const t of transactions) {
        if (t.id) {
          const txCurrency = t.currency || 'KZT';
          converted[t.id] = await convertCurrency(t.amount, txCurrency, currency);
        }
      }
      setConvertedAmounts(converted);
    };
    if (transactions.length > 0) {
      convertAmounts();
    }
  }, [transactions, currency]);

  const handleDelete = (id: number) => {
    dispatch(removeTransaction(id));
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id ?? null);
    setEditData({ ...transaction });
  };

  const handleSave = () => {
    if (editingId != null) {
      dispatch(editTransaction({ id: editingId, data: editData }));
      setEditingId(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id?: number) => {
    e.stopPropagation();
    if (id !== undefined) {
      handleDelete(id);
    }
  };
  

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white shadow rounded-md p-4 mb-6 transition-colors">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((t) => {
          const categoryName =
            categories.find((c) => c.id === t.category_id)?.name || `Category #${t.category_id}`;
          const isEditing = editingId === t.id;

          return (
            <li key={t.id} className="py-2">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: +e.target.value })}
                    className="p-1 rounded text-black"
                  />
                  <input
                    type="text"
                    value={editData.comment ?? ''}
                    onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                    className="p-1 rounded text-black"
                  />
                  <div className="flex gap-2 mt-1">
                    <button onClick={handleSave} className="bg-green-600 text-white px-2 py-1 rounded">💾 Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 px-2 rounded cursor-pointer"
                  onClick={() => t.id && navigate(`/dashboard/${t.id}`)}
                >
                  <span>
                    <span className="font-medium">{categoryName}</span>{' '}
                    <span className="text-sm text-gray-500 dark:text-gray-400">({t.date})</span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                      {t.type === 'income' ? '+' : '-'}
                      {t.id && convertedAmounts[t.id] !== undefined 
                        ? formatCurrency(convertedAmounts[t.id], currency)
                        : formatCurrency(t.amount, currency)}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(t); }}>✏️</button>
                    <button onClick={(e) => handleDeleteClick(e, t.id)}>🗑</button>
                    </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
