<template>
  <div class="card p-6 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">
          {{ accountTypeLabel }}
        </h3>
        <p class="text-sm text-gray-500">{{ account.id }}</p>
      </div>
      <div class="flex-shrink-0">
        <div :class="iconClasses">
          <component :is="accountIcon" class="h-6 w-6" />
        </div>
      </div>
    </div>
    
    <div class="mb-4">
      <p class="text-2xl font-bold text-gray-900">
        {{ formatCurrency(account.balance) }}
      </p>
    </div>
    
    <div class="flex space-x-2">
      <BaseButton
        size="sm"
        @click="$emit('viewTransactions')"
      >
        Voir les transactions
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="sm"
        @click="$emit('transfer')"
      >
        Virer
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CreditCard, PiggyBank } from 'lucide-vue-next';
import type { Account } from '@/types';
import { formatCurrency } from '@/utils/currency';
import BaseButton from '@/components/common/BaseButton.vue';

interface Props {
  account: Account;
}

const props = defineProps<Props>();

defineEmits<{
  viewTransactions: [];
  transfer: [];
}>();

const accountTypeLabel = computed(() => {
  return props.account.type === 'current' ? 'Compte Courant' : 'Compte Épargne';
});

const accountIcon = computed(() => {
  return props.account.type === 'current' ? CreditCard : PiggyBank;
});

const iconClasses = computed(() => {
  const baseClasses = 'p-3 rounded-full';
  return props.account.type === 'current' 
    ? `${baseClasses} bg-primary-100 text-primary-600`
    : `${baseClasses} bg-success-100 text-success-600`;
});
</script>