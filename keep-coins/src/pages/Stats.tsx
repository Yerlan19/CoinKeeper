import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { getUserStatistics } from '../api/statistics';
import { useAppSelector } from '../hooks/reduxHooks';

const COLORS = ['#36B37E', '#FF6B6B', '#FFA500', '#4A90E2', '#9C27B0', '#8BC34A', '#FF5722'];

export const Stats = () => {
  const token = useAppSelector(state => state.auth.token);
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    if (userId) {
      getUserStatistics(userId).then(setStats);
    }
  }, [userId]);

  if (!stats) {
    return <div className="text-center mt-20 text-gray-500 dark:text-gray-300">Loading statistics...</div>;
  }

  const filteredCategories = stats.category_stats.filter((cat: any) => {
    if (filter === 'all') return true;
    return cat.type === filter;
  });

  const pieData = filteredCategories.map((c: any) => ({
    name: c.category_name,
    value: c.total,
  }));

  const barData = filteredCategories.map((c: any) => ({
    name: c.category_name,
    total: c.total,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-black dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8">Statistics</h2>

      {/* Баланс и фильтр */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 mb-8">
        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <p className="text-lg">Balance: <span className="font-bold">{stats.balance.toLocaleString()} ₸</span></p>
            <p className="text-green-600">+ Income: {stats.total_income.toLocaleString()} ₸</p>
            <p className="text-red-500">− Expenses: {stats.total_expenses.toLocaleString()} ₸</p>
          </div>
          <div>
            <label className="font-medium">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="ml-2 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Диаграммы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Pie Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Bar Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#7096D1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
