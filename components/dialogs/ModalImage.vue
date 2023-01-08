<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="relative z-50">
      <!-- Backdrop -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]" enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100" leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-90">
            <DialogPanel class="w-full max-w-md transform overflow-hidden p-4 transition-all">
              <!-- Body -->
              <img :src="options.img.src" :alt="options.img.alt" class="w-full h-full shadow-xl p-2.5 border bg-white"/>
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
    },
    options: {
      type: Object
    }
  });

  const modalStore = useModalStore();
</script>
