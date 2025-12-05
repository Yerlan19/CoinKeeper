import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Category } from '../../types/types';
import {
  getAllCategories,
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  updateCategory as updateCategoryApi
} from '../../api/categories';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  return await getAllCategories();
});

export const addCategory = createAsyncThunk(
  'categories/create',
  async (category: Omit<Category, 'id'>) => {
    return await createCategoryApi(category);
  }
);

export const removeCategory = createAsyncThunk(
  'categories/delete',
  async (id: number) => {
    await deleteCategoryApi(id);
    return id;
  }
);

export const editCategory = createAsyncThunk(
  'categories/edit',
  async ({ id, data }: { id: number; data: Partial<Category> }) => {
    return await updateCategoryApi(id, data);
  }
);

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default categorySlice.reducer;