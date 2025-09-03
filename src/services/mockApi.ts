import type {
  AuthResponse,
  LoginCredentials,
  Account,
  Transaction,
  TransactionsResponse,
  TransferRequest,
  TransferResponse,
  TransactionFilters
} from '@/types';

// Mock data
const mockUser = {
  id: 'u_1',
  name: 'Alice',
  role: 'user'
};

const mockAccounts: Account[] = [
  {
    id: 'acc_1',
    type: 'current',
    currency: 'XAF',
    balance: 542300
  },
  {
    id: 'acc_2',
    type: 'savings',
    currency: 'XAF',
    balance: 1200000
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    date: '2025-01-15T09:22:00Z',
    amount: -25000,
    currency: 'XAF',
    description: 'Loyer Janvier',
    status: 'posted',
    type: undefined
  },
  {
    id: 'tx_2',
    date: '2025-01-14T14:11:00Z',
    amount: 150000,
    currency: 'XAF',
    description: 'Salaire',
    status: 'posted',
    type: undefined
  },
  {
    id: 'tx_3',
    date: '2025-01-13T10:30:00Z',
    amount: -35000,
    currency: 'XAF',
    description: 'Courses alimentaires',
    status: 'posted',
    type: undefined
  },
  {
    id: 'tx_4',
    date: '2025-01-12T16:45:00Z',
    amount: -12000,
    currency: 'XAF',
    description: 'Transport',
    status: 'posted',
    type: undefined
  },
  {
    id: 'tx_5',
    date: '2025-01-11T08:20:00Z',
    amount: 50000,
    currency: 'XAF',
    description: 'Virement reçu',
    status: 'posted',
    type: undefined
  },
  {
    id: 'tx_6',
    date: '2025-01-10T19:15:00Z',
    amount: -8500,
    currency: 'XAF',
    description: 'Restaurant',
    status: 'posted',
    type: undefined
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000);

    if (credentials.username === 'alice' && credentials.password === 'password123') {
      return {
        token: 'ey.mock.token',
        user: mockUser
      };
    }

    throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
  },

  async getAccounts(): Promise<Account[]> {
    await delay(500);
    return mockAccounts;
  },

  async getTransactions(
    accountId: string,
    filters: TransactionFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<TransactionsResponse> {
    await delay(700);

    let filteredTransactions = [...mockTransactions];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredTransactions = filteredTransactions.filter(tx =>
        tx.description.toLowerCase().includes(query)
      );
    }

    if (filters.type) {
      filteredTransactions = filteredTransactions.filter(tx =>
        filters.type === 'credit' ? tx.amount > 0 : tx.amount < 0
      );
    }

    if (filters.from) {
      filteredTransactions = filteredTransactions.filter(tx =>
        tx.date >= filters.from!
      );
    }

    if (filters.to) {
      filteredTransactions = filteredTransactions.filter(tx =>
        tx.date <= filters.to!
      );
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    return {
      items: paginatedTransactions,
      page,
      pageSize,
      total: filteredTransactions.length
    };
  },

  async transfer(transferData: TransferRequest): Promise<TransferResponse> {
    await delay(2000);

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Échec du virement. Veuillez réessayer.');
    }

    return {
      transferId: `tr_${Date.now()}`,
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 60000).toISOString()
    };
  }
};
