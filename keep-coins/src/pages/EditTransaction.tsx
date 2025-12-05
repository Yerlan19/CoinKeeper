import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTransactionById, updateTransaction } from '../api/transactions';
import { fetchCategories } from '../redux/slices/categorySlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import type { Transaction } from '../types/types';

export const EditTransaction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories.items);

  const [form, setForm] = useState<Partial<Transaction>>({});

  useEffect(() => {
    if (id) {
      getTransactionById(Number(id)).then(setForm);
    }
    dispatch(fetchCategories());
  }, [id, dispatch]);

  const handleSelectCategory = (cid: number) => {
    setForm({ ...form, category_id: cid });
  };

  const handleSubmit = async () => {
    if (!id) return;
    await updateTransaction(Number(id), form);
    navigate(`/dashboard/${id}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Transaction</h2>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount ?? ''}
        onChange={(e) => setForm({ ...form, amount: +e.target.value })}
        className="w-full mb-3 p-2 rounded text-black"
      />

      <input
        type="text"
        placeholder="Comment"
        value={form.comment ?? ''}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        className="w-full mb-3 p-2 rounded text-black"
      />

      <div className="mb-4">
        <label className="block mb-1">Category:</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id!)}
              className={`px-3 py-1 rounded-full border text-sm ${
                form.category_id === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
          💾 Save
        </button>
        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};
