import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Transaction } from '../../types/types';
import {
  getAllTransactions,
  getTransactionsByUser,
  createTransaction as createTransactionApi,
  deleteTransaction as deleteTransactionApi,
  updateTransaction as updateTransactionApi
} from '../../api/transactions';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async () => {
    return await getAllTransactions();
  }
);

export const fetchUserTransactions = createAsyncThunk(
  'transactions/fetchByUser',
  async (userId: number) => {
    return await getTransactionsByUser(userId);
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/create',
  async (transaction: Omit<Transaction, 'id'>) => {
    return await createTransactionApi(transaction);
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: number) => {
    await deleteTransactionApi(id);
    return id;
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/edit',
  async ({ id, data }: { id: number; data: Partial<Transaction> }) => {
    return await updateTransactionApi(id, data);
  }
);

interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  items: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user transactions';
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default transactionSlice.reducer;