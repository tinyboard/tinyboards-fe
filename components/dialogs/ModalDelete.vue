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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900">
                Delete this {{ type ?? 'post' }}?
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Your {{ type ?? 'post' }} will be forever removed from this TinyBoard.
                  <br/>
                  This action cannot be undone.
                </p>
              </div>
              <div class="mt-4 flex space-x-2 justify-end">
                <button type="button" class="button white" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button class="button primary" @click="deleteItem">
                  Yes, delete this {{ type ?? 'post' }}
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
  import { baseURL } from "@/server/constants";
  import { useToastStore } from '@/stores/StoreToast';
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
    },
    id: {
      type: Number,
    default: null,
      required: true
    },
    type: {
      type: String,
    default: 'post'
    }
  });

  const modalStore = useModalStore();

  // Deletion
  const authCookie = useCookie("token").value;
  const toast = useToastStore();

  const deleteItem = async () => {
    const type = props.type;
    const id = props.id;

    await useFetch(`/${type}s/${id}`, {
      baseURL,
      body: {
          "deleted": true
      },
      method: "delete",
      headers: {
        Authorization: authCookie ? `Bearer ${authCookie}` : '',
      }
    })
    .then(({ data }) => {
      if (data.value) {
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        setTimeout(() => {
          toast.addNotification({
            header:`${type} deleted!`,
            message:`Your ${type} was removed forever.`,
            type:'success'
          });
        }, 400);
      } else {
        // Show error toast.
        setTimeout(() => {
          toast.addNotification({
            header:'Deletion failed',
            message:`Failed to delete ${type}. Please try again.`,
            type:'error'
          });
        }, 400);
      };
    })
    .finally(() => {
      // Close the modal.
      modalStore.closeModal();
    });
  };
</script>
