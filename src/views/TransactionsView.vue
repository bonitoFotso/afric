<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header avec informations du compte -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- Navigation et titre -->
          <div class="flex-1">
            <div class="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                @click="$router.back()"
                class="text-[#00cfc2] hover:text-[#00cfc2]/80 hover:bg-[#00cfc2]/5"
              >
                <ArrowLeft class="h-4 w-4 mr-2" />
                Retour
              </Button>

              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <ChevronRight class="h-4 w-4" />
                <span class="text-gray-900 font-medium">Transactions</span>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-[#00cfc2] to-[#00b5aa] rounded-xl flex items-center justify-center">
                <Receipt class="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Historique des transactions</h1>
                <div v-if="selectedAccount" class="flex items-center space-x-4 mt-1">
                  <p class="text-gray-600">{{ getAccountLabel(selectedAccount) }}</p>
                  <Badge variant="outline" class="border-[#00cfc2] text-[#00cfc2]">
                    {{ formatCurrency(selectedAccount.balance) }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              @click="exportTransactions"
              class="hidden sm:flex"
            >
              <Download class="h-4 w-4 mr-2" />
              Exporter
            </Button>

            <Button
              @click="goToTransfer"
              class="bg-[#00cfc2] hover:bg-[#00cfc2]/90 text-white"
            >
              <ArrowRightLeft class="h-4 w-4 mr-2" />
              Nouveau virement
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistiques rapides -->
      <div v-if="selectedAccount" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card class="p-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp class="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Entrées ce mois</p>
              <p class="font-semibold text-green-600">{{ formatCurrency(monthlyStats.incoming) }}</p>
            </div>
          </div>
        </Card>

        <Card class="p-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown class="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Sorties ce mois</p>
              <p class="font-semibold text-red-600">{{ formatCurrency(monthlyStats.outgoing) }}</p>
            </div>
          </div>
        </Card>

        <Card class="p-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity class="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Total transactions</p>
              <p class="font-semibold">{{ transactionsStore.totalTransactions }}</p>
            </div>
          </div>
        </Card>

        <Card class="p-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-[#00cfc2]/10 rounded-lg flex items-center justify-center">
              <Calculator class="h-4 w-4 text-[#00cfc2]" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Solde moyen</p>
              <p class="font-semibold text-[#00cfc2]">{{ formatCurrency(monthlyStats.averageBalance) }}</p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Filtres -->
      <Card class="p-6 mb-8">
        <TransactionFilters
          :filters="transactionsStore.filters"
          :total-results="transactionsStore.totalTransactions"
          @update:filters="handleFiltersUpdate"
        />
      </Card>

      <!-- Contenu principal -->
      <div v-if="transactionsStore.loading && transactionsStore.transactions.length === 0"
           class="flex items-center justify-center py-12">
        <Card class="p-8">
          <div class="flex flex-col items-center space-y-4">
            <Loader2 class="h-8 w-8 animate-spin text-[#00cfc2]" />
            <p class="text-gray-600">Chargement des transactions...</p>
          </div>
        </Card>
      </div>

      <div v-else-if="transactionsStore.transactions.length === 0" class="py-12">
        <Card class="p-8">
          <div class="text-center">
            <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Receipt class="h-8 w-8 text-gray-400" />
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Aucune transaction trouvée
            </h3>
            <p class="text-gray-500 mb-6 max-w-sm mx-auto">
              Aucune transaction ne correspond à vos critères de recherche.
              Essayez de modifier vos filtres.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                @click="clearFilters"
              >
                <RotateCcw class="h-4 w-4 mr-2" />
                Effacer les filtres
              </Button>
              <Button
                @click="goToTransfer"
                class="bg-[#00cfc2] hover:bg-[#00cfc2]/90"
              >
                <Plus class="h-4 w-4 mr-2" />
                Créer une transaction
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <!-- Liste des transactions -->
      <div v-else class="space-y-4">
        <!-- Groupement par date -->
        <div v-for="(group, date) in groupedTransactions" :key="date" class="space-y-3">
          <div class="flex items-center space-x-4 py-2">
            <div class="text-sm font-semibold text-gray-900">{{ formatDate(date) }}</div>
            <div class="flex-1 h-px bg-gray-200"></div>
            <div class="text-xs text-gray-500">
              {{ group.length }} transaction{{ group.length > 1 ? 's' : '' }}
            </div>
          </div>

          <div class="space-y-2">
            <TransactionItem
              v-for="transaction in group"
              :key="transaction.id"
              :transaction="transaction"
              class="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            />
          </div>
        </div>

        <!-- Bouton "Charger plus" -->
        <div v-if="hasMoreTransactions" class="flex justify-center py-8">
          <Button
            variant="outline"
            :disabled="transactionsStore.loading"
            @click="loadMoreTransactions"
            class="border-[#00cfc2] text-[#00cfc2] hover:bg-[#00cfc2] hover:text-white"
          >
            <Loader2 v-if="transactionsStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            <ChevronDown v-else class="mr-2 h-4 w-4" />
            {{ transactionsStore.loading ? 'Chargement...' : 'Charger plus de transactions' }}
          </Button>
        </div>

        <!-- Message de fin -->
        <div v-else-if="transactionsStore.transactions.length > 10" class="text-center py-8">
          <div class="inline-flex items-center space-x-2 text-sm text-gray-500">
            <Check class="h-4 w-4" />
            <span>Toutes les transactions ont été chargées</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft,
  ArrowRightLeft,
  Receipt,
  ChevronRight,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  Calculator,
  Loader2,
  RotateCcw,
  Plus,
  ChevronDown,
  Check
} from 'lucide-vue-next';

import { useAccountsStore } from '@/stores/accounts';
import { useTransactionsStore } from '@/stores/transactions';
import { formatCurrency } from '@/utils/currency';

// Composants
import TransactionFilters from '@/components/transactions/TransactionFilters.vue';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TransactionItem from '@/components/transactions/TransactionItem.vue';

const route = useRoute();
const router = useRouter();
const accountsStore = useAccountsStore();
const transactionsStore = useTransactionsStore();

const accountId = computed(() => route.params.accountId as string);

const selectedAccount = computed(() =>
  accountsStore.getAccountById(accountId.value)
);

const hasMoreTransactions = computed(() =>
  transactionsStore.currentPage < transactionsStore.totalPages
);

// Grouper les transactions par date
const groupedTransactions = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groups: Record<string, any[]> = {};

  transactionsStore.sortedTransactions.forEach(transaction => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
  });

  return groups;
});

// Statistiques mensuelles mockées (à remplacer par de vraies données)
const monthlyStats = computed(() => ({
  incoming: 25000,
  outgoing: 18000,
  averageBalance: selectedAccount.value?.balance || 0
}));

onMounted(async () => {
  if (accountsStore.accounts.length === 0) {
    await accountsStore.fetchAccounts();
  }

  if (!selectedAccount.value) {
    router.push('/dashboard');
    return;
  }

  await loadTransactions();
});

onUnmounted(() => {
  transactionsStore.clearTransactions();
});

async function loadTransactions() {
  try {
    await transactionsStore.fetchTransactions(accountId.value);
  } catch (error) {
    console.error('Erreur lors du chargement des transactions:', error);
  }
}

async function loadMoreTransactions() {
  if (!hasMoreTransactions.value) return;

  try {
    await transactionsStore.fetchTransactions(
      accountId.value,
      transactionsStore.currentPage + 1
    );
  } catch (error) {
    console.error('Erreur lors du chargement des transactions supplémentaires:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleFiltersUpdate(filters: any) {
  try {
    await transactionsStore.searchTransactions(accountId.value, filters);
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
  }
}

function clearFilters() {
  handleFiltersUpdate({});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAccountLabel(account: any): string {
  const labels: Record<string, string> = {
    'current': 'Compte Courant',
    'courant': 'Compte Courant',
    'savings': 'Compte Épargne',
    'epargne': 'Compte Épargne',
    'business': 'Compte Entreprise',
    'entreprise': 'Compte Entreprise'
  };
  const accountType = account?.type?.toLowerCase() as string | undefined;
  return accountType && accountType in labels ? labels[accountType] : account?.name || 'Compte';
}

function goToTransfer() {
  router.push('/transfer');
}

function exportTransactions() {
  // Logique d'export à implémenter
  console.log('Export des transactions...');
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  } else {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
}
</script>
