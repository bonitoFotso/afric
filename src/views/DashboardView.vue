<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Bonjour, {{ authStore.user?.name }} 👋
            </h1>
            <p class="mt-1 text-gray-600">
              {{ new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) }}
            </p>
          </div>

          <!-- Actions rapides header -->
          <div class="hidden md:flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              @click="goToTransfer"
              class="border-[#00cfc2] text-[#00cfc2] hover:bg-[#00cfc2] hover:text-white"
            >
              <ArrowRightLeft class="h-4 w-4 mr-2" />
              Virement
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="viewAllTransactions"
              class="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Receipt class="h-4 w-4 mr-2" />
              Historique
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="accountsStore.loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center space-y-4">
          <Loader2 class="h-8 w-8 animate-spin text-[#00cfc2]" />
          <p class="text-gray-600">Chargement de vos comptes...</p>
        </div>
      </div>

      <div v-else class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Solde Total -->
          <Card class="md:col-span-2 overflow-hidden">
            <div class="bg-gradient-to-br from-[#00cfc2] to-[#00b5aa] p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-white/80 text-sm font-medium">SOLDE TOTAL</p>
                  <p class="text-4xl font-bold mt-2">
                    {{ formatCurrency(accountsStore.totalBalance) }}
                  </p>
                  <p class="text-white/90 mt-2 flex items-center">
                    <CreditCard class="h-4 w-4 mr-2" />
                    {{ accountsStore.accounts.length }} compte{{ accountsStore.accounts.length > 1 ? 's' : '' }}
                  </p>
                </div>
                <div class="hidden sm:block">
                  <div class="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <TrendingUp class="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              <!-- Graphique mini ou indicateurs -->
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center">
                  <p class="text-2xl font-bold">+5.2%</p>
                  <p class="text-xs text-white/80">Ce mois</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold">12</p>
                  <p class="text-xs text-white/80">Transactions</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold">3</p>
                  <p class="text-xs text-white/80">Virements</p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Notifications / Alertes -->
          <Card class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">Notifications</h3>
              <Badge variant="secondary" class="bg-[#00cfc2]/10 text-[#00cfc2]">
                2 nouvelles
              </Badge>
            </div>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-[#00cfc2] rounded-full mt-2 flex-shrink-0"></div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">Virement reçu</p>
                  <p class="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">Échéance approche</p>
                  <p class="text-xs text-gray-500">Dans 3 jours</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                class="w-full mt-3 text-[#00cfc2] hover:bg-[#00cfc2]/5"
              >
                Voir tout
              </Button>
            </div>
          </Card>
        </div>

        <!-- Comptes -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Vos comptes</h2>
            <Button
              variant="outline"
              size="sm"
              class="border-[#00cfc2] text-[#00cfc2] hover:bg-[#00cfc2] hover:text-white"
            >
              <Plus class="h-4 w-4 mr-2" />
              Nouveau compte
            </Button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card
              v-for="account in accountsStore.accounts"
              :key="account.id"
              class="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              @click="viewTransactions(account.id)"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="getAccountIcon(account.type).bg"
                  >
                    <component
                      :is="getAccountIcon(account.type).icon"
                      class="h-5 w-5"
                      :class="getAccountIcon(account.type).color"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ account.name }}</h3>
                    <p class="text-sm text-gray-500">{{ account.type }}</p>
                  </div>
                </div>
                <ChevronRight class="h-5 w-5 text-gray-400 group-hover:text-[#00cfc2] transition-colors" />
              </div>

              <div class="mb-4">
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatCurrency(account.balance) }}
                </p>
                <p class="text-sm text-gray-500">
                  Disponible: {{ formatCurrency(account.availableBalance || account.balance) }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-500">
                  ••••{{ account.number?.slice(-4) || '0000' }}
                </p>
                <div class="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click.stop="goToTransfer"
                    class="h-8 px-3 text-[#00cfc2] hover:bg-[#00cfc2]/10"
                  >
                    <Send class="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click.stop="viewTransactions(account.id)"
                    class="h-8 px-3 text-gray-600 hover:bg-gray-100"
                  >
                    <Eye class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <!-- Actions rapides (mobile) -->
        <div class="md:hidden">
          <Card class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div class="grid grid-cols-2 gap-4">
              <Button
                @click="goToTransfer"
                class="bg-[#00cfc2] hover:bg-[#00cfc2]/90 text-white"
              >
                <ArrowRightLeft class="h-4 w-4 mr-2" />
                Virement
              </Button>
              <Button
                variant="outline"
                @click="viewAllTransactions"
                class="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Receipt class="h-4 w-4 mr-2" />
                Historique
              </Button>
            </div>
          </Card>
        </div>

        <!-- Transactions récentes -->
        <Card class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Transactions récentes</h3>
            <Button
              variant="ghost"
              size="sm"
              @click="viewAllTransactions"
              class="text-[#00cfc2] hover:bg-[#00cfc2]/5"
            >
              Voir tout
              <ChevronRight class="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div class="space-y-4">
            <!-- Transaction mock -->
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownLeft class="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Virement reçu</p>
                  <p class="text-sm text-gray-500">Marie Dupont • Il y a {{ i }}h</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">+{{ formatCurrency(250.00 * i) }}</p>
                <p class="text-xs text-gray-500">Compte courant</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRightLeft,
  Receipt,
  CreditCard,
  TrendingUp,
  Plus,
  ChevronRight,
  Send,
  Eye,
  Loader2,
  ArrowDownLeft,
  Wallet,
  PiggyBank,
  Building2
} from 'lucide-vue-next';

import { useAuthStore } from '@/stores/auth';
import { useAccountsStore } from '@/stores/accounts';
import { formatCurrency } from '@/utils/currency';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const router = useRouter();
const authStore = useAuthStore();
const accountsStore = useAccountsStore();

onMounted(async () => {
  try {
    await accountsStore.fetchAccounts();
  } catch (error) {
    console.error('Erreur lors du chargement des comptes:', error);
  }
});

function getAccountIcon(type: string) {
  type IconType = 'courant' | 'epargne' | 'entreprise' | 'default';

  const icons = {
    'courant': {
      icon: CreditCard,
      bg: 'bg-[#00cfc2]/10',
      color: 'text-[#00cfc2]'
    },
    'epargne': {
      icon: PiggyBank,
      bg: 'bg-blue-100',
      color: 'text-blue-600'
    },
    'entreprise': {
      icon: Building2,
      bg: 'bg-purple-100',
      color: 'text-purple-600'
    },
    'default': {
      icon: Wallet,
      bg: 'bg-gray-100',
      color: 'text-gray-600'
    }
  };

  const key = type.toLowerCase() as IconType;
  return icons[key] || icons.default;
}

function viewTransactions(accountId: string) {
  router.push(`/transactions/${accountId}`);
}

function viewAllTransactions() {
  if (accountsStore.currentAccount) {
    viewTransactions(accountsStore.currentAccount.id);
  }
}

function goToTransfer() {
  router.push('/transfer');
}
</script>
