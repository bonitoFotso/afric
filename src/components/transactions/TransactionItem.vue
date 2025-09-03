<template>
  <Card class="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group border-l-4"
        :class="borderLeftClasses"
        @click="showDetails = !showDetails">
    <div class="flex items-center justify-between">
      <!-- Section gauche : Icône, description et détails -->
      <div class="flex items-center space-x-4 flex-1">
        <!-- Icône de transaction -->
        <div :class="iconWrapperClasses" class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          <component :is="transactionIcon" class="h-5 w-5" :class="iconClasses" />
        </div>

        <!-- Informations principales -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <h3 class="font-semibold text-gray-900 truncate">
              {{ transaction.description }}
            </h3>
            <Badge
              :variant="statusVariant"
              class="text-xs"
            >
              {{ statusLabel }}
            </Badge>
          </div>

          <div class="flex items-center space-x-3 mt-1">
            <p class="text-sm text-gray-500">
              {{ formatDateTime(transaction.date) }}
            </p>

            <div v-if="transaction.category" class="flex items-center space-x-1">
              <div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              <span class="text-xs text-gray-400 capitalize">
                {{ transaction.category }}
              </span>
            </div>
          </div>

          <!-- Informations supplémentaires (référence, etc.) -->
          <div v-if="transaction.reference" class="mt-1">
            <span class="text-xs text-gray-400 font-mono">
              Réf: {{ transaction.reference }}
            </span>
          </div>
        </div>
      </div>

      <!-- Section droite : Montant et devise -->
      <div class="text-right flex-shrink-0 ml-4">
        <div class="flex items-center space-x-2">
          <div>
            <p :class="amountClasses" class="text-lg font-bold">
              {{ amountPrefix }}{{ formattedAmount }}
            </p>
            <div class="flex items-center justify-end space-x-2">
              <span class="text-xs text-gray-500">{{ transaction.currency }}</span>
              <ChevronDown
                class="h-4 w-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showDetails }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Détails étendus (collapsible) -->
    <Collapsible v-model:open="showDetails">
      <CollapsibleContent>
        <Separator class="my-4" />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <!-- Informations de base -->
          <div class="space-y-2">
            <h4 class="font-medium text-gray-900 flex items-center">
              <Info class="h-4 w-4 mr-2 text-[#00cfc2]" />
              Informations
            </h4>
            <div class="space-y-1 text-gray-600">
              <div class="flex justify-between">
                <span>Type:</span>
                <span class="font-medium capitalize">{{ getTransactionType() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Statut:</span>
                <Badge :variant="statusVariant" class="text-xs">
                  {{ statusLabel }}
                </Badge>
              </div>
              <div v-if="transaction.processingTime" class="flex justify-between">
                <span>Traitement:</span>
                <span class="font-medium">{{ transaction.processingTime }}</span>
              </div>
            </div>
          </div>

          <!-- Détails financiers -->
          <div class="space-y-2">
            <h4 class="font-medium text-gray-900 flex items-center">
              <Calculator class="h-4 w-4 mr-2 text-[#00cfc2]" />
              Montant
            </h4>
            <div class="space-y-1 text-gray-600">
              <div class="flex justify-between">
                <span>Montant:</span>
                <span :class="amountClasses" class="font-bold">
                  {{ amountPrefix }}{{ formattedAmount }}
                </span>
              </div>
              <div v-if="transaction.fees" class="flex justify-between">
                <span>Frais:</span>
                <span class="font-medium text-gray-900">
                  {{ formatCurrency(transaction.fees) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Devise:</span>
                <span class="font-medium">{{ transaction.currency }}</span>
              </div>
            </div>
          </div>

          <!-- Informations techniques -->
          <div class="space-y-2">
            <h4 class="font-medium text-gray-900 flex items-center">
              <Hash class="h-4 w-4 mr-2 text-[#00cfc2]" />
              Références
            </h4>
            <div class="space-y-1 text-gray-600">
              <div v-if="transaction.reference" class="flex justify-between">
                <span>Référence:</span>
                <span class="font-mono text-xs">{{ transaction.reference }}</span>
              </div>
              <div v-if="transaction.id" class="flex justify-between">
                <span>ID Transaction:</span>
                <span class="font-mono text-xs">{{ transaction.id.slice(0, 8) }}...</span>
              </div>
              <div class="flex justify-between">
                <span>Date/Heure:</span>
                <span class="font-medium">{{ formatDateTime(transaction.date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Note/Description étendue -->
        <div v-if="transaction.note || transaction.extendedDescription" class="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2 flex items-center">
            <MessageSquare class="h-4 w-4 mr-2 text-[#00cfc2]" />
            Note
          </h4>
          <p class="text-sm text-gray-600">
            {{ transaction.note || transaction.extendedDescription }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 mt-4">
          <Button variant="ghost" size="sm">
            <Download class="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="ghost" size="sm">
            <Share class="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="ghost" size="sm" class="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Flag class="h-4 w-4 mr-2" />
            Signaler
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  Smartphone,
  Info,
  Calculator,
  Hash,
  MessageSquare,
  Download,
  Share,
  Flag
} from 'lucide-vue-next';

import type { Transaction } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';

// Composants shadcn/ui
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

interface Props {
  transaction: Transaction;
}

const props = defineProps<Props>();
const showDetails = ref(false);

const isCredit = computed(() => props.transaction.amount > 0);

const formattedAmount = computed(() => {
  const amount = Math.abs(props.transaction.amount);
  return formatCurrency(amount);
});

const amountPrefix = computed(() => {
  return isCredit.value ? '+' : '-';
});

const amountClasses = computed(() => {
  return isCredit.value ? 'text-green-600' : 'text-red-600';
});

const borderLeftClasses = computed(() => {
  return isCredit.value ? 'border-l-green-500' : 'border-l-red-500';
});

const iconWrapperClasses = computed(() => {
  return isCredit.value
    ? 'bg-green-100 group-hover:bg-green-200'
    : 'bg-red-100 group-hover:bg-red-200';
});

const iconClasses = computed(() => {
  return isCredit.value ? 'text-green-600' : 'text-red-600';
});

const transactionIcon = computed(() => {
  if (isCredit.value) {
    return ArrowDownLeft; // Argent qui rentre
  }

  // Icônes selon le type de transaction pour les débits
  switch (props.transaction.type?.toLowerCase()) {
    case 'card':
    case 'carte':
      return CreditCard;
    case 'transfer':
    case 'virement':
      return Building2;
    case 'mobile':
    case 'app':
      return Smartphone;
    default:
      return ArrowUpRight;
  }
});

const statusLabel = computed(() => {
  const statusMap = {
    'posted': 'Validé',
    'pending': 'En attente',
    'processing': 'En cours',
    'failed': 'Échec',
    'cancelled': 'Annulé'
  };
  return statusMap[props.transaction.status] || 'Inconnu';
});

const statusVariant = computed((): "default" | "secondary" | "destructive" | "outline" => {
  switch (props.transaction.status as string) {
    case 'posted':
      return 'default'; // Vert
    case 'pending':
    case 'processing':
      return 'secondary'; // Jaune/Orange
    case 'failed':
    case 'cancelled':
      return 'destructive'; // Rouge
    default:
      return 'outline';
  }
});

function getTransactionType(): string {
  const typeMap = {
    'transfer': 'Virement',
    'card': 'Paiement carte',
    'deposit': 'Dépôt',
    'withdrawal': 'Retrait',
    'fee': 'Frais',
    'interest': 'Intérêts',
    'mobile': 'Paiement mobile'
  };

  return typeMap[props.transaction.type?.toLowerCase()] || 'Transaction';
}
</script>
