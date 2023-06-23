<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="modal relative z-50">
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]" enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100" leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-90">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white dark:bg-gray-900 p-4 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100">
                Pick a theme
              </DialogTitle>
              <div class="modal-body mt-2">
                <p class="text-sm text-gray-500">
                  If you have a theme idea, start a thread!
                </p>
                <ul class="mt-4 flex flex-col space-y-2">
                  <li v-for="theme in themes" :key="theme.value">
                    <input :id="`theme-${theme.value}`" type="radio" :value="theme.value" v-model="picked" name="theme" class="hidden peer">
                    <label :for="`theme-${theme.value}`" class="inline-flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      {{ theme.text }}
                    </label>
                  </li>
                </ul>
              </div>
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
  import { ref } from 'vue'
  import { useModalStore } from '@/stores/StoreModal';
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    }
  });

  const modalStore = useModalStore();

  // Theme selection
  const themeCookie = useCookie("theme") ?? 'dark';

  const picked = ref(themeCookie);

  const themes = ref([
    { text: 'Daylight', value: '' },
    { text: 'Midnight', value: 'dark' }
  ]);

  watch(picked, (x) => {
    useHead({
      bodyAttrs: {
        class: x
      }
    });
  });
</script>
