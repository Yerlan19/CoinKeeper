import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TransactionDialogContent from './TransactionDialogContent';
import { useAppDispatch } from '../hooks/reduxHooks';
import { editTransaction, fetchTransactions } from '../redux/slices/transactionSlice';
import type { Transaction } from '../types/types';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

interface EditTransactionProps {
  transaction: Transaction;
}

const EditTransaction = ({ transaction: tx }: EditTransactionProps) => {
  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState({ ...tx });
  const dispatch = useAppDispatch();
  const handleOpen = () => {
    setTransaction({ ...tx });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    if (!tx.id) return;
    await dispatch(editTransaction({ id: tx.id, data: transaction }));
    await dispatch(fetchTransactions());
    handleClose();
  };
  return (
    <>
      <Tooltip title="Edit transaction">
        <IconButton aria-label="edit" size="small" onClick={handleOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Transaction</DialogTitle>
        <TransactionDialogContent transaction={transaction} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default EditTransaction;
