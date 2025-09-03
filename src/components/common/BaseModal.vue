<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click="handleBackdropClick">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          <div 
            ref="modalContent"
            class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all"
            @click.stop
          >
            <div class="px-6 pt-6">
              <div class="flex items-center justify-between">
                <h3 v-if="title" class="text-lg font-medium text-gray-900">
                  {{ title }}
                </h3>
                <button
                  type="button"
                  class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100"
                  @click="$emit('close')"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="px-6 py-4">
              <slot />
            </div>
            <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 rounded-b-lg">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  show: boolean;
  title?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const modalContent = ref<HTMLElement>();

function handleBackdropClick(event: Event) {
  if (event.target !== event.currentTarget) return;
  emit('close');
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>