import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  note?: string;
  icon?: string;
  timestamp?: number;
}

interface TransactionState {
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

const initialState: TransactionState = {
  transactions: [],
  balance: 0,
  totalIncome: 0,
  totalExpense: 0,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      if (action.payload.type === 'income') {
        state.totalIncome += action.payload.amount;
        state.balance += action.payload.amount;
      } else {
        state.totalExpense += action.payload.amount;
        state.balance -= action.payload.amount;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload);
      if (index !== -1) {
        const t = state.transactions[index];
        if (t.type === 'income') {
          state.totalIncome -= t.amount;
          state.balance -= t.amount;
        } else {
          state.totalExpense -= t.amount;
          state.balance += t.amount;
        }
        state.transactions.splice(index, 1);
      }
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const old = state.transactions[index];
        
        // Remove old amounts
        if (old.type === 'income') {
          state.totalIncome -= old.amount;
          state.balance -= old.amount;
        } else {
          state.totalExpense -= old.amount;
          state.balance += old.amount;
        }
        
        // Add new amounts
        const updated = action.payload;
        if (updated.type === 'income') {
          state.totalIncome += updated.amount;
          state.balance += updated.amount;
        } else {
          state.totalExpense += updated.amount;
          state.balance -= updated.amount;
        }
        
        state.transactions[index] = updated;
      }
    },
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
