import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser, setAuthToken } from '../../api/users';
import type { User } from '../../types/types';

// Типы состояния
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Получаем токен из localStorage
const tokenFromStorage = localStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token: tokenFromStorage,
  loading: !!tokenFromStorage, // Включаем загрузку, если есть токен
  error: null,
};

// Thunk: Логин
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    const response = await loginUser(email, password);
    if ('token' in response) {
      setAuthToken(response.token);
      return response;
    } else {
      return thunkAPI.rejectWithValue(response.message);
    }
  }
);

// Thunk: Регистрация
export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    const response = await registerUser(name, email, password);
    if ('token' in response) {
      setAuthToken(response.token);
      return response;
    } else {
      return thunkAPI.rejectWithValue(response.message);
    }
  }
);

// Thunk: Получить текущего пользователя
export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  const token = localStorage.getItem('token');
  if (!token) return thunkAPI.rejectWithValue('No token found');

  try {
    const user = await getCurrentUser();
    return user ?? thunkAPI.rejectWithValue('User not found');
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch user');
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null; // Очищаем токен при ошибке
        state.error = action.payload as string;
        localStorage.removeItem('token');
        setAuthToken(null);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
