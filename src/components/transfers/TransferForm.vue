<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Compte source -->
    <div class="space-y-3">
      <Label for="fromAccount" class="text-sm font-medium text-gray-700">
        Compte source <span class="text-red-500">*</span>
      </Label>

      <div class="relative">
        <Select v-model="form.fromAccountId" @update:model-value="handleAccountSelect">
          <SelectTrigger
            id="fromAccount"
            class="h-12"
            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.fromAccountId }"
          >
            <div class="flex items-center space-x-3">
              <div v-if="selectedAccount" class="w-8 h-8 bg-[#00cfc2]/10 rounded-lg flex items-center justify-center">
                <CreditCard class="h-4 w-4 text-[#00cfc2]" />
              </div>
              <div v-if="selectedAccount" class="text-left">
                <SelectValue class="font-medium">
                  {{ getAccountLabel(selectedAccount) }}
                </SelectValue>
                <div class="text-xs text-gray-500">
                  Solde: {{ formatCurrency(selectedAccount.balance) }}
                </div>
              </div>
              <SelectValue v-else placeholder="Sélectionner un compte" />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
              class="py-3"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-[#00cfc2]/10 rounded-lg flex items-center justify-center">
                  <CreditCard class="h-4 w-4 text-[#00cfc2]" />
                </div>
                <div>
                  <div class="font-medium">{{ getAccountLabel(account) }}</div>
                  <div class="text-sm text-gray-500">
                    ••••{{ account.number?.slice(-4) || '0000' }} • {{ formatCurrency(account.balance) }}
                  </div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p v-if="errors.fromAccountId" class="text-sm text-red-600 flex items-center">
        <AlertCircle class="h-4 w-4 mr-1" />
        {{ errors.fromAccountId }}
      </p>
    </div>

    <!-- Numéro de compte bénéficiaire -->
    <div class="space-y-3">
      <Label for="toAccountNumber" class="text-sm font-medium text-gray-700">
        Numéro de compte bénéficiaire <span class="text-red-500">*</span>
      </Label>

      <div class="relative">
        <Hash class="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        <Input
          id="toAccountNumber"
          v-model="form.toAccountNumber"
          placeholder="1234 5678 9012 3456"
          required
          class="pl-10 h-12"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.toAccountNumber }"
          @blur="validateAccountNumber"
          @input="formatAccountNumber"
        />
      </div>

      <p v-if="errors.toAccountNumber" class="text-sm text-red-600 flex items-center">
        <AlertCircle class="h-4 w-4 mr-1" />
        {{ errors.toAccountNumber }}
      </p>
    </div>

    <!-- Montant -->
    <div class="space-y-3">
      <Label for="amount" class="text-sm font-medium text-gray-700">
        Montant <span class="text-red-500">*</span>
      </Label>

      <div class="relative">
        <div class="absolute left-3 top-3.5 flex items-center">
          <span class="text-gray-500 text-sm font-medium">XAF</span>
        </div>
        <Input
          id="amount"
          v-model="form.amount"
          type="number"
          placeholder="0"
          required
          class="pl-12 h-12 text-right text-lg font-semibold"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.amount,
            'border-[#00cfc2] focus:border-[#00cfc2] focus:ring-[#00cfc2]': form.amount && !errors.amount
          }"
          min="1000"
          step="100"
          @blur="validateAmount"
          @input="formatAmount"
        />
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">Minimum: 1 000 XAF</span>
        <span v-if="form.amount && !errors.amount" class="text-[#00cfc2] font-medium">
          {{ formatCurrency(Number(form.amount)) }}
        </span>
      </div>

      <p v-if="errors.amount" class="text-sm text-red-600 flex items-center">
        <AlertCircle class="h-4 w-4 mr-1" />
        {{ errors.amount }}
      </p>
    </div>

    <!-- Note optionnelle -->
    <div class="space-y-3">
      <Label for="note" class="text-sm font-medium text-gray-700">
        Note (optionnelle)
      </Label>

      <div class="relative">
        <MessageSquare class="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        <Textarea
          id="note"
          v-model="form.note"
          placeholder="Description du virement..."
          class="pl-10 min-h-[80px] resize-none"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.note }"
          maxlength="200"
        />
      </div>

      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>Ajoutez une description pour vous souvenir de ce virement</span>
        <span>{{ form.note.length }}/200</span>
      </div>

      <p v-if="errors.note" class="text-sm text-red-600 flex items-center">
        <AlertCircle class="h-4 w-4 mr-1" />
        {{ errors.note }}
      </p>
    </div>

    <!-- Résumé du virement -->
    <Card v-if="selectedAccount && form.amount" class="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-8 h-8 bg-[#00cfc2]/10 rounded-lg flex items-center justify-center">
          <Calculator class="h-4 w-4 text-[#00cfc2]" />
        </div>
        <h4 class="font-semibold text-gray-900">Résumé du virement</h4>
      </div>

      <div class="space-y-3">
        <div class="flex justify-between items-center py-2">
          <span class="text-gray-600">Solde actuel</span>
          <span class="font-semibold">{{ formatCurrency(selectedAccount.balance) }}</span>
        </div>

        <div class="flex justify-between items-center py-2">
          <span class="text-gray-600">Montant du virement</span>
          <span class="font-semibold text-red-600">
            -{{ formatCurrency(Number(form.amount) || 0) }}
          </span>
        </div>

        <Separator />

        <div class="flex justify-between items-center py-2">
          <span class="font-semibold text-gray-900">Nouveau solde</span>
          <span
            class="font-bold text-lg"
            :class="newBalance >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatCurrency(newBalance) }}
          </span>
        </div>

        <!-- Alerte si solde insuffisant -->
        <Alert v-if="newBalance < 0" class="border-red-200 bg-red-50">
          <AlertTriangle class="h-4 w-4 text-red-600" />
          <AlertDescription class="text-red-700">
            Attention : Ce virement dépasserait votre solde disponible.
          </AlertDescription>
        </Alert>

        <!-- Confirmation si tout va bien -->
        <Alert v-else-if="newBalance >= 0 && form.amount" class="border-green-200 bg-green-50">
          <CheckCircle class="h-4 w-4 text-green-600" />
          <AlertDescription class="text-green-700">
            Le virement peut être effectué. Votre nouveau solde sera de {{ formatCurrency(newBalance) }}.
          </AlertDescription>
        </Alert>
      </div>
    </Card>

    <!-- Boutons d'action -->
    <div class="flex space-x-4 pt-4">
      <Button
        type="submit"
        :disabled="!isFormValid"
        class="flex-1 h-12 bg-[#00cfc2] hover:bg-[#00cfc2]/90 disabled:bg-gray-300"
      >
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        <Send v-else class="mr-2 h-4 w-4" />
        {{ loading ? 'Traitement...' : 'Effectuer le virement' }}
      </Button>

      <Button
        type="button"
        variant="outline"
        @click="$emit('cancel')"
        class="px-8 h-12 border-gray-300 hover:bg-gray-50"
      >
        Annuler
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  CreditCard,
  Hash,
  MessageSquare,
  Calculator,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Send,
  Loader2
} from 'lucide-vue-next';

import type { Account, TransferRequest } from '@/types';
import { formatCurrency } from '@/utils/currency';
import {  validateAccountNumber, validateAmount, validateRequired } from '@/utils/validation';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  accounts: Account[];
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  submit: [data: TransferRequest];
  cancel: [];
}>();

const form = ref({
  fromAccountId: '',
  toAccountNumber: '',
  amount: '',
  note: ''
});

const errors = ref({
  fromAccountId: '',
  toAccountNumber: '',
  amount: '',
  note: ''
});

const selectedAccount = computed(() => {
  return props.accounts.find(acc => acc.id === form.value.fromAccountId);
});

const newBalance = computed(() => {
  if (!selectedAccount.value) return 0;
  return selectedAccount.value.balance - (Number(form.value.amount) || 0);
});

const isFormValid = computed(() => {
  return validateRequired(form.value.fromAccountId) &&
    validateRequired(form.value.toAccountNumber) &&
    validateRequired(form.value.amount) &&
    validateAccountNumber(form.value.toAccountNumber) &&
    selectedAccount.value &&
    validateAmount(Number(form.value.amount), selectedAccount.value.balance) &&
    newBalance.value >= 0;
});

function getAccountLabel(account: Account): string {
  const labels: Record<string, string> = {
    'current': 'Compte Courant',
    'courant': 'Compte Courant',
    'savings': 'Compte Épargne',
    'epargne': 'Compte Épargne',
    'business': 'Compte Entreprise',
    'entreprise': 'Compte Entreprise'
  };
  const key = account.type.toLowerCase();
  return key in labels ? labels[key] : account.type || 'Compte';
}

function handleAccountSelect(accountId: string) {
  form.value.fromAccountId = accountId;
  errors.value.fromAccountId = '';

  // Revalider le montant si nécessaire
  if (form.value.amount) {
    validateAmount(Number(form.value.amount), selectedAccount.value?.balance || 0);
  }
}

function formatAccountNumber() {
  // Formater le numéro de compte avec des espaces
  let value = form.value.toAccountNumber.replace(/\s/g, '');
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  form.value.toAccountNumber = value;
}

function formatAmount() {
  // S'assurer que le montant est un nombre valide
  const value = form.value.amount.replace(/[^\d]/g, '');
  form.value.amount = value;
}



function handleSubmit() {
  if (!isFormValid.value || !selectedAccount.value) return;

  const transferData: TransferRequest = {
    fromAccountId: form.value.fromAccountId,
    toAccountNumber: form.value.toAccountNumber.replace(/\s/g, ''),
    amount: Number(form.value.amount),
    currency: 'XAF',
    note: form.value.note
  };

  emit('submit', transferData);
}
</script>
