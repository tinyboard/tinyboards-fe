<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="modal-dropzone relative z-50">
      <!-- Backdrop -->
      <TransitionChild as="template" enter="duration-100 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-100 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-2.5 sm:p-4">
          <TransitionChild as="template" enter="duration-100 ease-[cubic-bezier(.2,0,0,1.4)]" enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100" leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-90">
            <DialogPanel class="w-full max-w-md transform overflow-hidden transition-all">
              <!-- Body -->
              <div class="w-full h-full shadow-xl p-2.5 bg-white dark:bg-gray-900 rounded-md text-center">
                <div class="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-transparent border dark:border-gray-700 border-dashed text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                     <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                     <path d="M15 8h.01"></path>
                     <path d="M12 20h-5a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5"></path>
                     <path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4"></path>
                     <path d="M14 14l1 -1c.617 -.593 1.328 -.793 2.009 -.598"></path>
                     <path d="M19 22v-6"></path>
                     <path d="M22 19l-3 -3l-3 3"></path>
                  </svg>
                  <p class="text-xl font-bold dark:text-gray-200">
                    Drag and drop image
                  </p>
                  <small class="mt-1 text-gray-600 dark:text-gray-400">
                    You can add text before uploading.
                  </small>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
  import { baseURL } from "@/server/constants";
  import { useModalStore } from '@/stores/StoreModal';
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel
  } from '@headlessui/vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null,
      required: true
    }
  });

  const modalStore = useModalStore();
</script>