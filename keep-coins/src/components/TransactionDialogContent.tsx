import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import React from 'react';

interface TransactionFormData {
  amount: number | string;
  type: 'income' | 'expense';
  category_id: number | string;
  comment: string;
  date: string;
  currency: string;
}

interface Props {
  transaction: TransactionFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
const TransactionDialogContent = ({ transaction, handleChange }: Props) => (
  <DialogContent>
    <Stack spacing={2} mt={1}>
      <TextField label="Amount" name="amount" type="number" fullWidth value={transaction.amount} onChange={handleChange} />
      <TextField label="Type" name="type" select fullWidth value={transaction.type} onChange={handleChange}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </TextField>
      <TextField label="Category ID" name="category_id" type="number" fullWidth value={transaction.category_id} onChange={handleChange} />
      <TextField label="Comment" name="comment" fullWidth value={transaction.comment} onChange={handleChange} />
      <TextField label="Date" name="date" type="date" fullWidth value={transaction.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField label="Currency" name="currency" fullWidth value={transaction.currency} onChange={handleChange} />
    </Stack>
  </DialogContent>
);

export default TransactionDialogContent;
