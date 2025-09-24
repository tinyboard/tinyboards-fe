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
                Purge this {{ type === 'user' && options.user.username ? options.user.username : type }}?
              </DialogTitle>
              <!-- Body -->
              <div class="modal-body mt-2">
                <p class="text-sm text-gray-500">
                  This {{ type ?? 'post' }} will be wiped from the database.
                  <br/>
                  <strong>This action cannot be undone!</strong>
                </p>
              </div>
              <!-- Date Input -->
              <!-- <input v-if="!options.user.isBanned" type="date" name="expiration" value=""> -->
              <!-- Footer -->
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button class="button red" @click="purge">
                  Yes, purge {{ type === 'user' && options.user.username ? options.user.username : `this ${type}` }}
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
  import { useAPI } from "@/composables/api";
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
    type: {
      type: String,
      default: 'post'
    },
    options: {
      type: Object
    }
  });

  const modalStore = useModalStore();
  const postsStore = usePostsStore();
  const commentsStore = useCommentsStore();

  // Purge
  const authCookie = useCookie("token").value;
  const toast = useToastStore();

  const purge = async () => {
    const type = props.type;
    await useAPI(`/admin/purge_${props.type}`, {
      body: {
        [`${type}_id`]: props.id,
        "reason": props.options.reason ?? "Violates community standards",
      },
      method: "post",
    })
    .then(({ data }) => {
      if (data.value) {
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        setTimeout(() => {
          toast.addNotification({
            header:`${type} purged`,
            message:'Reload the page to see changes.',
            type:'success'
          });
        }, 400);
      } else {
        // Show error toast.
        setTimeout(() => {
          toast.addNotification({
            header:'Purge failed',
            message:`Failed to purge the ${type}. Please try again.`,
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
