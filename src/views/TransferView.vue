<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header avec breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <span class="text-gray-900 font-medium">Nouveau virement</span>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-[#00cfc2] to-[#00b5aa] rounded-xl flex items-center justify-center">
            <ArrowRightLeft class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Nouveau virement</h1>
            <p class="text-gray-600">Effectuez un virement depuis votre compte en toute sécurité</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- État de chargement -->
      <div v-if="accountsStore.loading" class="flex items-center justify-center py-12">
        <Card class="p-8">
          <div class="flex flex-col items-center space-y-4">
            <Loader2 class="h-8 w-8 animate-spin text-[#00cfc2]" />
            <p class="text-gray-600">Chargement de vos comptes...</p>
          </div>
        </Card>
      </div>

      <!-- Formulaire principal -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulaire de virement -->
        <div class="lg:col-span-2">
          <Card class="p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-[#00cfc2]/10 rounded-lg flex items-center justify-center">
                <Send class="h-4 w-4 text-[#00cfc2]" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Détails du virement</h2>
                <p class="text-sm text-gray-500">Remplissez les informations ci-dessous</p>
              </div>
            </div>

            <TransferForm
              :accounts="accountsStore.accounts"
              :loading="transfersStore.loading"
              @submit="handleTransfer"
              @cancel="$router.push('/dashboard')"
            />
          </Card>
        </div>


      </div>
    </div>

    <!-- Modal de confirmation -->
    <Dialog v-model:open="showConfirmation">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle class="h-4 w-4 text-orange-600" />
            </div>
            <span>Confirmer le virement</span>
          </DialogTitle>
          <DialogDescription>
            Veuillez vérifier les détails du virement avant de confirmer
          </DialogDescription>
        </DialogHeader>

        <div v-if="pendingTransfer" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Montant</span>
              <span class="text-2xl font-bold text-[#00cfc2]">
                {{ formatCurrency(pendingTransfer.amount) }}
              </span>
            </div>

            <Separator />

            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-700">Destinataire</span>
              <span class="font-mono text-sm">
                {{ formatAccountNumber(pendingTransfer.toAccountNumber) }}
              </span>
            </div>

            <div v-if="pendingTransfer.note" class="flex justify-between">
              <span class="text-sm font-medium text-gray-700">Note</span>
              <span class="text-sm max-w-40 text-right">
                {{ pendingTransfer.note }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-700">Date d'exécution</span>
              <span class="text-sm">Immédiate</span>
            </div>
          </div>

          <Alert>
            <Info class="h-4 w-4" />
            <AlertDescription class="text-sm">
              Cette action est irréversible. Assurez-vous que les informations sont correctes.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter class="gap-3">
          <Button
            variant="outline"
            @click="showConfirmation = false"
            class="flex-1"
          >
            Annuler
          </Button>
          <Button
            @click="confirmTransfer"
            :disabled="transfersStore.loading"
            class="flex-1 bg-[#00cfc2] hover:bg-[#00cfc2]/90"
          >
            <Loader2 v-if="transfersStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modal de succès -->
    <Dialog v-model:open="showSuccess">
      <DialogContent class="sm:max-w-md">
        <div class="text-center py-4">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle class="h-8 w-8 text-green-600" />
          </div>

          <DialogTitle class="text-xl font-semibold text-gray-900 mb-2">
            Virement effectué avec succès !
          </DialogTitle>

          <div v-if="transfersStore.lastTransfer" class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">Numéro de transaction</p>
              <p class="font-mono font-bold text-lg">
                {{ transfersStore.lastTransfer.transferId }}
              </p>
            </div>

            <div class="text-sm text-gray-500">
              <p>Le virement sera traité d'ici</p>
              <p class="font-medium">
                {{ formatDateTime(transfersStore.lastTransfer.estimatedCompletion) }}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            @click="handleSuccessClose"
            class="w-full bg-[#00cfc2] hover:bg-[#00cfc2]/90"
          >
            Retour au dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft,
  CheckCircle,
  ArrowRightLeft,
  ChevronRight,
  Send,
  AlertCircle,
  Info,
  Loader2
} from 'lucide-vue-next';

import { useAccountsStore } from '@/stores/accounts';
import { useTransfersStore } from '@/stores/transfers';
import type { TransferRequest } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { formatAccountNumber } from '@/utils/validation';
import { formatDateTime } from '@/utils/date';

// Composants
import TransferForm from '@/components/transfers/TransferForm.vue';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const router = useRouter();
const accountsStore = useAccountsStore();
const transfersStore = useTransfersStore();

const showConfirmation = ref(false);
const showSuccess = ref(false);
const pendingTransfer = ref<TransferRequest | null>(null);

onMounted(async () => {
  if (accountsStore.accounts.length === 0) {
    await accountsStore.fetchAccounts();
  }

  transfersStore.clearLastTransfer();
});

function handleTransfer(transferData: TransferRequest) {
  pendingTransfer.value = transferData;
  showConfirmation.value = true;
}

async function confirmTransfer() {
  if (!pendingTransfer.value) return;

  try {
    await transfersStore.executeTransfer(pendingTransfer.value);
    showConfirmation.value = false;
    showSuccess.value = true;

    // Refresh accounts to reflect new balances
    await accountsStore.fetchAccounts();
  } catch (error) {
    console.error('Erreur lors du virement:', error);
    // Handle error (could show error modal)
  }
}

function handleSuccessClose() {
  showSuccess.value = false;
  router.push('/dashboard');
}
</script>
