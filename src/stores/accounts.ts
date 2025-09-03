import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import type { Account } from '@/types';
import { mockApi } from '@/services/mockApi';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  const loading = ref(false);

  const totalBalance = computed(() =>
    accounts.value.reduce((total, account) => total + account.balance, 0)
  );

  const currentAccount = computed(() =>
    accounts.value.find(acc => acc.type === 'current')
  );

  const savingsAccount = computed(() =>
    accounts.value.find(acc => acc.type === 'savings')
  );

  async function fetchAccounts() {
    loading.value = true;
    try {
      accounts.value = await mockApi.getAccounts();
    } catch (error) {
      console.error('Erreur lors du chargement des comptes:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function getAccountById(id: string) {
    return accounts.value.find(account => account.id === id);
  }

  return {
    accounts: readonly(accounts),
    loading: readonly(loading),
    totalBalance,
    currentAccount,
    savingsAccount,
    fetchAccounts,
    getAccountById
  };
});
