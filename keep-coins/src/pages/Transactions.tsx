import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchTransactions } from '../redux/slices/transactionSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchUserSettings } from '../redux/slices/settingsSlice';
import { removeTransaction, editTransaction } from '../redux/slices/transactionSlice';
import { createTransaction } from '../api/transactions';
import type { Transaction } from '../types/types';

// MUI DataGrid imports
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef, GridCellParams, GridValueFormatter, GridValueGetter } from '@mui/x-data-grid';

// Material UI imports
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { formatCurrency } from '../utils/currency';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const Transactions = () => {
  const dispatch = useAppDispatch();
  const { items: transactions } = useAppSelector((state) => state.transactions);
  const { items: categories } = useAppSelector((state) => state.categories);
  const { currentSettings } = useAppSelector((state) => state.settings);
  const token = useAppSelector((state) => state.auth.token);
  const currency = currentSettings?.currency || 'KZT';
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'income' as 'income' | 'expense',
    category_id: '',
    comment: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchTransactions());
      dispatch(fetchCategories());
      dispatch(fetchUserSettings(userId));
    }
  }, [dispatch, userId]);

  // MUI DataGrid column definitions
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, sortable: true },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      sortable: true,
      valueFormatter: ((value) => {
        if (!value) return '';
        return new Date(value as string).toLocaleDateString();
      }) as GridValueFormatter,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      sortable: true,
      renderCell: (params: GridCellParams<Transaction>) => (
        <span style={{ color: params.value === 'income' ? 'green' : 'red', fontWeight: 'bold' }}>
          {String(params.value)}
        </span>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      sortable: true,
      valueFormatter: ((value, row) => {
        if (!value) return '';
        const txCurrency = (row as Transaction)?.currency || 'KZT';
        return formatCurrency(value as number, txCurrency);
      }) as GridValueFormatter,
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 150,
      sortable: true,
      valueGetter: ((_value, row) => {
        const transaction = row as Transaction;
        const category = categories.find((c) => c.id === transaction?.category_id);
        return category?.name || 'Unknown';
      }) as GridValueGetter,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1,
      sortable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit transaction">
            <IconButton aria-label="edit" size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete transaction">
            <IconButton aria-label="delete" size="small" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = () => {
    setEditingTransaction(null);
    setFormData({
      amount: '',
      type: 'income',
      category_id: '',
      comment: '',
      date: new Date().toISOString().split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount?.toString() || '',
      type: transaction.type || 'income',
      category_id: transaction.category_id?.toString() || '',
      comment: transaction.comment || '',
      date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await dispatch(removeTransaction(id));
      dispatch(fetchTransactions());
    }
  };

  const handleSave = async () => {
    if (!userId || !formData.amount || !formData.category_id) {
      alert('Please fill in all required fields');
      return;
    }

    const transactionData = {
      user_id: userId,
      userId: userId, // Поддержка обоих форматов
      amount: parseFloat(formData.amount),
      type: formData.type,
      category_id: parseInt(formData.category_id),
      categoryId: parseInt(formData.category_id), // Поддержка обоих форматов
      comment: formData.comment,
      date: formData.date,
      currency: currency,
    };

    try {
      if (editingTransaction?.id) {
        await dispatch(editTransaction({ id: editingTransaction.id, data: transactionData })).unwrap();
      } else {
        await createTransaction(transactionData);
      }
      // Обновляем список транзакций после успешного сохранения
      await dispatch(fetchTransactions());
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      alert(error?.message || 'Failed to save transaction. Please try again.');
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['ID', 'Date', 'Type', 'Amount', 'Category', 'Comment', 'Currency'];
    const rows = transactions.map((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      return [
        t.id || '',
        t.date ? new Date(t.date).toLocaleDateString() : '',
        t.type,
        t.amount.toString(),
        category?.name || 'Unknown',
        t.comment || '',
        t.currency || 'KZT',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="xl">
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Transactions Management
          </Typography>
          <Button color="inherit" onClick={handleOpenDialog} sx={{ mr: 2 }}>
            + CREATE
          </Button>
          <Button color="inherit" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </Toolbar>
      </AppBar>

      {/* MUI DataGrid Table */}
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          getRowId={(row: Transaction) => row.id || 0}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </div>

      {/* Modal Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category_id}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                {categories
                  .filter((c) => c.type === formData.type)
                  .map((cat) => (
                    <MenuItem key={cat.id} value={cat.id?.toString() || ''}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

