<template>
  <div class="space-y-6">
    <!-- En-tête avec actions rapides -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-[#00cfc2]/10 rounded-lg flex items-center justify-center">
          <Filter class="h-4 w-4 text-[#00cfc2]" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Filtres de recherche</h3>
          <p class="text-sm text-gray-500">{{ totalResults }} résultat(s) trouvé(s)</p>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          @click="applyPreset('today')"
          class="text-xs"
        >
          <Calendar class="h-3 w-3 mr-1" />
          Aujourd'hui
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="applyPreset('week')"
          class="text-xs"
        >
          <Calendar class="h-3 w-3 mr-1" />
          7 jours
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="applyPreset('month')"
          class="text-xs"
        >
          <Calendar class="h-3 w-3 mr-1" />
          30 jours
        </Button>

        <Button
          variant="ghost"
          size="sm"
          @click="clearFilters"
          :disabled="!hasActiveFilters"
          class="text-gray-600 hover:text-red-600"
        >
          <RotateCcw class="h-3 w-3 mr-1" />
          Effacer
        </Button>
      </div>
    </div>

    <!-- Filtres principaux -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Recherche textuelle -->
      <div class="space-y-2">
        <Label for="search" class="text-sm font-medium text-gray-700">
          Recherche
        </Label>
        <div class="relative">
          <Search class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            v-model="localFilters.query"
            placeholder="Description, référence..."
            class="pl-10"
            @blur="applyFilters"
            @keyup.enter="applyFilters"
          />
        </div>
      </div>

      <!-- Type de transaction -->
      <div class="space-y-2">
        <Label for="type" class="text-sm font-medium text-gray-700">
          Type de transaction
        </Label>
        <Select v-model="localFilters.type" @update:model-value="applyFilters">
          <SelectTrigger>
            <div class="flex items-center space-x-2">
              <component
                :is="getTypeIcon(localFilters.type)"
                class="h-4 w-4 text-gray-500"
              />
              <SelectValue placeholder="Tous les types" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              <div class="flex items-center space-x-2">
                <List class="h-4 w-4 text-gray-500" />
                <span>Tous les types</span>
              </div>
            </SelectItem>
            <SelectItem value="credit">
              <div class="flex items-center space-x-2">
                <ArrowDownLeft class="h-4 w-4 text-green-500" />
                <span>Crédits</span>
              </div>
            </SelectItem>
            <SelectItem value="debit">
              <div class="flex items-center space-x-2">
                <ArrowUpRight class="h-4 w-4 text-red-500" />
                <span>Débits</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Date de début -->
      <div class="space-y-2">
        <Label for="from" class="text-sm font-medium text-gray-700">
          Date de début
        </Label>
        <div class="relative">
          <Calendar class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="from"
            v-model="localFilters.from"
            type="date"
            class="pl-10"
            @blur="applyFilters"
          />
        </div>
      </div>

      <!-- Date de fin -->
      <div class="space-y-2">
        <Label for="to" class="text-sm font-medium text-gray-700">
          Date de fin
        </Label>
        <div class="relative">
          <Calendar class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="to"
            v-model="localFilters.to"
            type="date"
            class="pl-10"
            @blur="applyFilters"
          />
        </div>
      </div>
    </div>

    <!-- Filtres avancés (collapsible) -->
    <Collapsible v-model:open="showAdvancedFilters">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          class="w-full justify-center text-[#00cfc2] hover:text-[#00cfc2]/80 hover:bg-[#00cfc2]/5"
        >
          <Settings class="h-4 w-4 mr-2" />
          {{ showAdvancedFilters ? 'Masquer' : 'Afficher' }} les filtres avancés
          <ChevronDown
            class="h-4 w-4 ml-2 transition-transform duration-200"
            :class="{ 'rotate-180': showAdvancedFilters }"
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div class="pt-4 space-y-4">
          <Separator />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Montant minimum -->
            <div class="space-y-2">
              <Label for="minAmount" class="text-sm font-medium text-gray-700">
                Montant minimum (XAF)
              </Label>
              <div class="relative">
                <DollarSign class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="minAmount"
                  v-model="localFilters.minAmount"
                  type="number"
                  placeholder="0"
                  class="pl-10"
                  @blur="applyFilters"
                />
              </div>
            </div>

            <!-- Montant maximum -->
            <div class="space-y-2">
              <Label for="maxAmount" class="text-sm font-medium text-gray-700">
                Montant maximum (XAF)
              </Label>
              <div class="relative">
                <DollarSign class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="maxAmount"
                  v-model="localFilters.maxAmount"
                  type="number"
                  placeholder="999999"
                  class="pl-10"
                  @blur="applyFilters"
                />
              </div>
            </div>

            <!-- Statut -->
            <div class="space-y-2">
              <Label for="status" class="text-sm font-medium text-gray-700">
                Statut
              </Label>
              <Select v-model="localFilters.status" @update:model-value="applyFilters">
                <SelectTrigger>
                  <div class="flex items-center space-x-2">
                    <component
                      :is="getStatusIcon(localFilters.status)"
                      class="h-4 w-4"
                      :class="getStatusIconColor(localFilters.status)"
                    />
                    <SelectValue placeholder="Tous les statuts" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <div class="flex items-center space-x-2">
                      <List class="h-4 w-4 text-gray-500" />
                      <span>Tous les statuts</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="posted">
                    <div class="flex items-center space-x-2">
                      <CheckCircle class="h-4 w-4 text-green-500" />
                      <span>Validé</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div class="flex items-center space-x-2">
                      <Clock class="h-4 w-4 text-orange-500" />
                      <span>En attente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="failed">
                    <div class="flex items-center space-x-2">
                      <XCircle class="h-4 w-4 text-red-500" />
                      <span>Échoué</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Catégories (si disponibles) -->
          <div v-if="availableCategories.length > 0" class="space-y-2">
            <Label class="text-sm font-medium text-gray-700">
              Catégories
            </Label>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="category in availableCategories"
                :key="category"
                :variant="localFilters.categories?.includes(category) ? 'default' : 'outline'"
                class="cursor-pointer transition-colors hover:bg-[#00cfc2] hover:text-white"
                @click="toggleCategory(category)"
              >
                <Tag class="h-3 w-3 mr-1" />
                {{ category }}
              </Badge>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <!-- Résumé des filtres actifs -->
    <div v-if="activeFiltersCount > 0" class="flex flex-wrap gap-2">
      <span class="text-sm font-medium text-gray-700">Filtres actifs:</span>
      <Badge
        v-for="filter in activeFiltersList"
        :key="filter.key"
        variant="secondary"
        class="text-xs bg-[#00cfc2]/10 text-[#00cfc2]"
      >
        {{ filter.label }}
        <X class="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" @click="removeFilter(filter.key)" />
      </Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Filter,
  Calendar,
  RotateCcw,
  Search,
  List,
  ArrowDownLeft,
  ArrowUpRight,
  Settings,
  ChevronDown,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Tag,
  X
} from 'lucide-vue-next';

import type { TransactionFilters } from '@/types';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  filters: TransactionFilters;
  totalResults: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:filters': [filters: TransactionFilters];
}>();

const localFilters = ref<TransactionFilters>({ ...props.filters });
const showAdvancedFilters = ref(false);

// Catégories disponibles (à adapter selon vos données)
const availableCategories = ref(['Alimentation', 'Transport', 'Loisirs', 'Santé', 'Logement']);

const hasActiveFilters = computed(() => {
  return Object.keys(localFilters.value).some(key => {
    const value = localFilters.value[key as keyof TransactionFilters];
    return value !== undefined && value !== '' && value !== null;
  });
});

const activeFiltersCount = computed(() => {
  return Object.values(localFilters.value).filter(value =>
    value !== undefined && value !== '' && value !== null &&
    !(Array.isArray(value) && value.length === 0)
  ).length;
});

const activeFiltersList = computed(() => {
  const filters = [];

  if (localFilters.value.query) {
    filters.push({ key: 'query', label: `"${localFilters.value.query}"` });
  }
  if (localFilters.value.type) {
    filters.push({ key: 'type', label: localFilters.value.type === 'credit' ? 'Crédits' : 'Débits' });
  }
  if (localFilters.value.status) {
    const statusLabels = { 'posted': 'Validé', 'pending': 'En attente', 'failed': 'Échoué' };
    filters.push({ key: 'status', label: statusLabels[localFilters.value.status] || localFilters.value.status });
  }
  if (localFilters.value.from) {
    filters.push({ key: 'from', label: `Depuis ${localFilters.value.from}` });
  }
  if (localFilters.value.to) {
    filters.push({ key: 'to', label: `Jusqu'à ${localFilters.value.to}` });
  }
  if (localFilters.value.minAmount) {
    filters.push({ key: 'minAmount', label: `Min: ${localFilters.value.minAmount} XAF` });
  }
  if (localFilters.value.maxAmount) {
    filters.push({ key: 'maxAmount', label: `Max: ${localFilters.value.maxAmount} XAF` });
  }

  return filters;
});

onMounted(() => {
  localFilters.value = { ...props.filters };
});

function applyFilters() {
  emit('update:filters', { ...localFilters.value });
}

function clearFilters() {
  localFilters.value = {};
  applyFilters();
}

function applyPreset(preset: string) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  switch (preset) {
    case 'today':
      localFilters.value = { from: todayStr, to: todayStr };
      break;
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      localFilters.value = { from: weekAgo.toISOString().split('T')[0], to: todayStr };
      break;
    case 'month':
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      localFilters.value = { from: monthAgo.toISOString().split('T')[0], to: todayStr };
      break;
  }
  applyFilters();
}

function toggleCategory(category: string) {
  if (!localFilters.value.categories) {
    localFilters.value.categories = [];
  }

  const index = localFilters.value.categories.indexOf(category);
  if (index > -1) {
    localFilters.value.categories.splice(index, 1);
  } else {
    localFilters.value.categories.push(category);
  }

  applyFilters();
}

function removeFilter(key: string) {
  delete localFilters.value[key as keyof TransactionFilters];
  applyFilters();
}

function getTypeIcon(type?: string) {
  switch (type) {
    case 'credit': return ArrowDownLeft;
    case 'debit': return ArrowUpRight;
    default: return List;
  }
}

function getStatusIcon(status?: string) {
  switch (status) {
    case 'posted': return CheckCircle;
    case 'pending': return Clock;
    case 'failed': return XCircle;
    default: return List;
  }
}

function getStatusIconColor(status?: string) {
  switch (status) {
    case 'posted': return 'text-green-500';
    case 'pending': return 'text-orange-500';
    case 'failed': return 'text-red-500';
    default: return 'text-gray-500';
  }
}
</script>
