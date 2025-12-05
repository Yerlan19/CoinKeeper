import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TransactionDialogContent from './TransactionDialogContent';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { addTransaction, fetchTransactions } from '../redux/slices/transactionSlice';

interface TransactionFormData {
  amount: number | string;
  type: 'income' | 'expense';
  category_id: number | string;
  comment: string;
  date: string;
  currency: string;
}

const defaultTransaction: TransactionFormData = {
  amount: 0,
  type: 'income',
  category_id: '',
  comment: '',
  date: new Date().toISOString().split('T')[0],
  currency: 'KZT'
};

const AddTransaction = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState<TransactionFormData>(defaultTransaction);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTransaction(defaultTransaction);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    if (!userId) return;
    const transactionData = {
      user_id: userId,
      amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount,
      type: transaction.type,
      category_id: typeof transaction.category_id === 'string' ? parseInt(transaction.category_id) : transaction.category_id,
      comment: transaction.comment,
      date: transaction.date,
      currency: transaction.currency,
    };
    await dispatch(addTransaction(transactionData));
    await dispatch(fetchTransactions());
    handleClose();
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <Button variant="contained" color="primary" onClick={handleOpen}>+ Add Transaction</Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Transaction</DialogTitle>
        <TransactionDialogContent transaction={transaction} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AddTransaction;
