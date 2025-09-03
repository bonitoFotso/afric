import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import type { Transaction, TransactionsResponse, TransactionFilters } from '@/types';
import { mockApi } from '@/services/mockApi';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(20);
  const totalTransactions = ref(0);
  const filters = ref<TransactionFilters>({});

  const totalPages = computed(() => Math.ceil(totalTransactions.value / pageSize.value));

  const sortedTransactions = computed(() => {
    return [...transactions.value].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  async function fetchTransactions(accountId: string, page = 1) {
    loading.value = true;
    currentPage.value = page;

    try {
      const response: TransactionsResponse = await mockApi.getTransactions(
        accountId,
        filters.value,
        page,
        pageSize.value
      );

      if (page === 1) {
        transactions.value = response.items;
      } else {
        transactions.value.push(...response.items);
      }

      totalTransactions.value = response.total;
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function searchTransactions(accountId: string, searchFilters: TransactionFilters) {
    filters.value = { ...searchFilters };
    await fetchTransactions(accountId, 1);
  }

  function clearTransactions() {
    transactions.value = [];
    currentPage.value = 1;
    totalTransactions.value = 0;
    filters.value = {};
  }

  return {
    transactions: readonly(transactions),
    loading: readonly(loading),
    currentPage: readonly(currentPage),
    pageSize: readonly(pageSize),
    totalTransactions: readonly(totalTransactions),
    totalPages,
    filters: readonly(filters),
    sortedTransactions,
    fetchTransactions,
    searchTransactions,
    clearTransactions
  };
});
