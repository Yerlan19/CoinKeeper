import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  UserStatistics, 
  CombinedCategoryStatistics,
  MonthlyStatistics,
  UserCategoriesStatsRequest
} from '../../types/types';
import {
  getUserStatistics as getUserStatisticsApi,
  getCategoryStatistics as getCategoryStatisticsApi,
  getUserCategoriesStatistics as getUserCategoriesStatisticsApi,
  getUserMonthlyStatistics as getUserMonthlyStatisticsApi
} from '../../api/statistics';

export const fetchUserStatistics = createAsyncThunk(
  'statistics/fetchUserStatistics',
  async (userId: number) => {
    return await getUserStatisticsApi(userId);
  }
);

export const fetchCategoryStatistics = createAsyncThunk(
  'statistics/fetchCategoryStatistics',
  async (categoryIds: number | number[]) => {
    return await getCategoryStatisticsApi(categoryIds);
  }
);

export const fetchUserCategoriesStatistics = createAsyncThunk(
  'statistics/fetchUserCategoriesStatistics',
  async (request: UserCategoriesStatsRequest) => {
    return await getUserCategoriesStatisticsApi(request);
  }
);

export const fetchUserMonthlyStatistics = createAsyncThunk(
  'statistics/fetchUserMonthlyStatistics',
  async (userId: number) => {
    return await getUserMonthlyStatisticsApi(userId);
  }
);

interface StatisticsState {
  userStats: UserStatistics | null;
  categoryStats: CombinedCategoryStatistics | null;
  monthlyStats: MonthlyStatistics | null;
  userCategoriesStats: CombinedCategoryStatistics | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  userStats: null,
  categoryStats: null,
  monthlyStats: null,
  userCategoriesStats: null,
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearCategoryStats: (state) => {
      state.categoryStats = null;
    },
    clearMonthlyStats: (state) => {
      state.monthlyStats = null;
    },
    clearUserCategoriesStats: (state) => {
      state.userCategoriesStats = null;
    },
    resetStatistics: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user statistics';
      })
      .addCase(fetchCategoryStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryStats = action.payload;
      })
      .addCase(fetchCategoryStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category statistics';
      })
      .addCase(fetchUserCategoriesStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCategoriesStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.userCategoriesStats = action.payload;
      })
      .addCase(fetchUserCategoriesStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user categories statistics';
      })
      .addCase(fetchUserMonthlyStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMonthlyStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyStats = action.payload;
      })
      .addCase(fetchUserMonthlyStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch monthly statistics';
      });
  },
});

export const { 
  clearCategoryStats, 
  clearMonthlyStats, 
  clearUserCategoriesStats,
  resetStatistics 
} = statisticsSlice.actions;

export default statisticsSlice.reducer;