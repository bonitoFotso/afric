import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';
import type { TransferRequest, TransferResponse } from '@/types';
import { mockApi } from '@/services/mockApi';

export const useTransfersStore = defineStore('transfers', () => {
  const loading = ref(false);
  const lastTransfer = ref<TransferResponse | null>(null);
  const isDestroyed = ref(false);

  async function executeTransfer(transferData: TransferRequest): Promise<TransferResponse> {
    // Vérification si le store est encore actif
    if (isDestroyed.value) {
      throw new Error('Store is destroyed');
    }

    loading.value = true;

    try {
      const response = await mockApi.transfer(transferData);

      // Vérifier encore une fois avant de modifier les refs
      if (!isDestroyed.value) {
        lastTransfer.value = response;
      }

      return response;
    } catch (error) {
      // S'assurer que l'erreur remonte même si le store est détruit
      throw error;
    } finally {
      // Ne modifier loading que si le store existe encore
      if (!isDestroyed.value) {
        loading.value = false;
      }
    }
  }

  function clearLastTransfer() {
    if (!isDestroyed.value) {
      lastTransfer.value = null;
    }
  }

  // Fonction pour marquer le store comme détruit
  function destroy() {
    isDestroyed.value = true;
    loading.value = false;
    lastTransfer.value = null;
  }

  // Fonction pour vérifier l'état du store
  function isActive() {
    return !isDestroyed.value;
  }

  return {
    loading: readonly(loading),
    lastTransfer: readonly(lastTransfer),
    executeTransfer,
    clearLastTransfer,
    destroy,
    isActive
  };
});
