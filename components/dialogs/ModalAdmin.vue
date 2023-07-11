<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="modal relative z-50">
      <!-- Backdrop -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]" enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100" leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-90">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900">
                {{ options.user.is_admin ? `Remove ${options.user.username} as` : `Make ${options.user.username}` }} admin
              </DialogTitle>
              <!-- Body -->
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ options.user.username ?? 'user' }} will {{ options.user.is_admin ? 'have admin privileges revoked' : 'be granted admin privileges' }}.
                  <br/>
                  You can undo this action.
                </p>
              </div>
              <!-- Date Input -->
              <!-- <input v-if="!options.user.is_admin" type="date" name="expiration" value=""> -->
              <!-- Footer -->
              <div class="mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button class="button red" @click="submitAdmin">
                  Yes, {{ options.user.is_admin ? `remove ${options.user.username} as` : `make ${options.user.username}` }} admin
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
  // import { baseURL } from "@/server/constants";
  import { useApi } from "@/composables/api";
  import { useToastStore } from '@/stores/StoreToast';
  import { useModalStore } from '@/stores/StoreModal';
  import { usePostsStore } from '@/stores/StorePosts';
  import { useCommentsStore } from '@/stores/StoreComments';
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
    options: {
      type: Object
    }
  });

  const modalStore = useModalStore();

  // Removal
  const authCookie = useCookie("token").value;
  const toast = useToastStore();

  const submitAdmin = async () => {
    const isAdmin = props.options.user.is_admin;
    await useApi('/admin/add_admin', {
      body: {
        "added_user_id": props.id,
        "added": !isAdmin,
      },
      method: "post"
    })
    .then(({ data }) => {
      if (data.value) {
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        toast.addNotification({
          header:`${props.options.user.username} ${isAdmin ? 'removed as' : 'was made'} admin`,
          message:'Reload the page to see changes.',
          type:'success'
        });
      } else {
        // Show error toast.
        toast.addNotification({
          header:`${isAdmin ? 'Adding' : 'Removing'} admin failed`,
          message:`Failed to ${isAdmin ? 'remove' : 'make'} admin. Please try again.`,
          type:'error'
        });
      };
    })
    .finally(() => {
      // Close the modal.
      modalStore.closeModal();
    });
  };
</script>
