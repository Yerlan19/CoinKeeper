import type { Category } from '../../types/types';
import { CategorySelector } from '../CategorySelector';

interface Props {
  type: 'income' | 'expense';
  setType: (type: 'income' | 'expense') => void;
  amount: string;
  setAmount: (val: string) => void;
  category: number | null;
  setCategory: React.Dispatch<React.SetStateAction<number | null>>;
  comment: string;
  setComment: (val: string) => void;
  categoriesList: Category[];
  onCancel: () => void;
  onSave: () => void;
}

export const TransactionForm = ({
  type,
  setType,
  amount,
  setAmount,
  category,
  setCategory,
  comment,
  setComment,
  categoriesList,
  onCancel,
  onSave,
}: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white shadow rounded-md p-4 space-y-4 transition-colors">
      {/* Тип транзакции */}
      <div className="flex space-x-4">
        {['income', 'expense'].map((t) => (
          <button
            key={t}
            onClick={() => setType(t as 'income' | 'expense')}
            className={`flex-1 py-2 rounded ${
              type === t
                ? t === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Сумма */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
      />

      {/* Категории */}
      <CategorySelector
        type={type}
        selectedId={category}
        setSelectedId={setCategory}
        categoriesList={categoriesList}
      />

      {/* Комментарий */}
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment (optional)"
        className="w-full p-2 border rounded text-black"
      />

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="text-gray-500 hover:underline">
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};
