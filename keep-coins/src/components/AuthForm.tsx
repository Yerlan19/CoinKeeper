import React from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
  name?: string;
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onNameChange?: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  switchAuth: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  name,
  email,
  password,
  loading,
  error,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  switchAuth,
}) => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-md transition-colors duration-300 sm:p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {type === 'login' ? 'Login' : 'Register'}
      </h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {type === 'register' && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => onNameChange?.(e.target.value)}
            required
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          minLength={6}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Loading...' : type === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        type="button"
        onClick={switchAuth}
        className="mt-4 text-blue-600 hover:underline text-sm w-full text-center"
      >
        {type === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
};