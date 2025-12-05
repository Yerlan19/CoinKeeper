interface SettingsFormProps {
  currentUser: {
    name: string;
    email: string;
    id: number;
  };
  editMode: boolean;
  name: string;
  email: string;
  password: string;
  loading: boolean;
  error: string;
  success: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onEditToggle: () => void;
}

export const SettingsForm = ({
  editMode,
  name,
  email,
  password,
  loading,
  error,
  success,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onCancel,
  onEditToggle,
}: SettingsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={!editMode}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={!editMode}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {editMode && (
        <div>
          <label className="block text-sm font-medium mb-1">Current Password (required to save changes)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex justify-between mt-4">
        {editMode ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onEditToggle}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Edit Settings
          </button>
        )}
      </div>
    </form>
  );
};
