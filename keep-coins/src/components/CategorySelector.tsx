import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { createCategory } from '../api/categories';
import { fetchCategories } from '../redux/slices/categorySlice';
import type { Category } from '../types/types';

interface Props {
  type: 'income' | 'expense';
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  categoriesList: Category[];
}

export const CategorySelector = ({
  type,
  selectedId,
  setSelectedId,
  categoriesList,
}: Props) => {
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const userId = useAppSelector((s) => s.auth.user?.id);
  const dispatch = useAppDispatch();

  const filtered = categoriesList.filter(
    (cat) =>
      cat.type === type &&
      cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: number) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const handleCreate = async () => {
    if (!userId || !newName.trim()) return;
    await createCategory({
      user_id: Number(userId),
      name: newName.trim(),
      type,
      color: '#000000',
    });
    setNewName('');
    setShowInput(false);
    dispatch(fetchCategories());
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search categories"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded text-black mb-2"
      />
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {filtered.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id!)}
            className={`px-3 py-1 rounded-full border text-sm ${
              selectedId === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="text-sm text-blue-600 hover:underline mt-2"
        >
          + Add new category
        </button>
      ) : (
        <div className="flex gap-2 mt-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            className="flex-1 p-2 rounded text-black"
          />
          <button onClick={handleCreate} className="bg-green-600 text-white px-3 rounded">
            Add
          </button>
        </div>
      )}
    </div>
  );
};
