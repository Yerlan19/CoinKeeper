import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserSettings } from '../../types/types';
import {
  getUserSettings,
  updateUserSettings,
  verifyPassword as verifyPasswordAPI,
} from '../../api/settings';

type SecureUpdate = {
  userId: number;
  email: string;
  settings: Partial<UserSettings>;
  password: string;
};

type RegularUpdate = {
  userId: number;
  settings: Partial<UserSettings>;
};

export const fetchUserSettings = createAsyncThunk(
  'settings/fetchUserSettings',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await getUserSettings(userId);
    } catch {
      return rejectWithValue('Failed to fetch user settings');
    }
  }
);

export const verifyPassword = createAsyncThunk(
  'settings/verifyPassword',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const isValid = await verifyPasswordAPI(email, password);
      if (!isValid) {
        return rejectWithValue('Invalid password');
      }
      return true;
    } catch {
      return rejectWithValue('Failed to verify password');
    }
  }
);

export const updateSecureSettings = createAsyncThunk(
  'settings/updateSecureSettings',
  async (
    { userId, email, settings, password }: SecureUpdate,
    { rejectWithValue }
  ) => {
    try {
      const isValid = await verifyPasswordAPI(email, password);
      if (!isValid) {
        return rejectWithValue('Invalid password');
      }

      const updated = await updateUserSettings(userId, settings);
      return updated;
    } catch {
      return rejectWithValue('Failed to update settings');
    }
  }
);

export const updateRegularSettings = createAsyncThunk(
  'settings/updateRegularSettings',
  async ({ userId, settings }: RegularUpdate, { rejectWithValue }) => {
    try {
      return await updateUserSettings(userId, settings);
    } catch {
      return rejectWithValue('Failed to update settings');
    }
  }
);

interface SettingsState {
  currentSettings: UserSettings | null;
  loading: boolean;
  error: string | null;
  passwordVerified: boolean;
}

const initialState: SettingsState = {
  currentSettings: null,
  loading: false,
  error: null,
  passwordVerified: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearPasswordVerification: (state) => {
      state.passwordVerified = false;
    },
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSettings = action.payload;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordVerified = true;
      })
      .addCase(verifyPassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordVerified = false;
        state.error = action.payload as string;
      })

      .addCase(updateSecureSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSecureSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSettings = action.payload;
        state.passwordVerified = false;
      })
      .addCase(updateSecureSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateRegularSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegularSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSettings = action.payload;
      })
      .addCase(updateRegularSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPasswordVerification, clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
