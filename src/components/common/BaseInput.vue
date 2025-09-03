<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    />
    <p v-if="error" class="mt-2 text-sm text-danger-600">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-2 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id?: string;
  label?: string;
  type?: string;
  modelValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
});

defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

const inputClasses = computed(() => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200';
  const errorClasses = props.error 
    ? 'border-danger-300 text-danger-900 placeholder-danger-300 focus:border-danger-500 focus:ring-danger-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const disabledClasses = props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';
  
  return [baseClasses, errorClasses, disabledClasses].join(' ');
});
</script>