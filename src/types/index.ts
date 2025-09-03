export interface User {
  id: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Account {
  id: string;
  type: 'current' | 'savings';
  currency: string;
  balance: number;
}

export interface Transaction {
  type: any;
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  status: 'posted' | 'pending';
}

export interface TransactionsResponse {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  currency: string;
  note: string;
}

export interface TransferResponse {
  transferId: string;
  status: 'pending' | 'completed' | 'failed';
  estimatedCompletion: string;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  query?: string;
  type?: 'debit' | 'credit';
}
