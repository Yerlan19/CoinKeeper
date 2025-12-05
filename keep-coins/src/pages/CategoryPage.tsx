import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCategories } from '../redux/slices/categorySlice';
import { createCategory, deleteCategory } from '../api/categories';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export const CategoryPage = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, sortable: true },
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    {
      field: 'type', headerName: 'Type', width: 120, sortable: true,
      renderCell: (params) => (
        <span style={{ color: params.value === 'income' ? 'green' : 'red' }}>{params.value}</span>
      )
    },
    {
      field: 'color', headerName: 'Color', width: 100,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div style={{ backgroundColor: params.value, width: 20, height: 20, borderRadius: '50%', border: '1px solid #ccc', marginRight: 8 }} />
          {params.value}
        </div>
      )
    },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false, filterable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Delete category">
          <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  const handleOpenDeleteDialog = (id: number) => {
    setCategoryIdToDelete(id);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryIdToDelete(null);
  };
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !name) return;
    await createCategory({ user_id: Number(userId), name, color, type });
    dispatch(fetchCategories());
    setName('');
  };
  const handleDeleteConfirmed = async () => {
    if (categoryIdToDelete) {
      await deleteCategory(categoryIdToDelete);
      dispatch(fetchCategories());
    }
    handleCloseDeleteDialog();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      {/* Форма добавления */}
      <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <TextField label="Category Name" variant="outlined" size="small" value={name} onChange={e => setName(e.target.value)} sx={{ flex: 1 }} required />
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={e => setType(e.target.value as 'income' | 'expense')}>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 40, height: 40, border: 'none', cursor: 'pointer' }} title="Choose Color" />
        <Button type="submit" variant="contained" color="primary">Add</Button>
      </Box>
      {/* Таблица MUI DataGrid - полностью меняю на современный компонент */}
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={categories}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          pagination
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </div>
      {/* Модальное окно подтверждения удаления */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <Box sx={{ p: 2 }}>Are you sure you want to delete this category?</Box>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};