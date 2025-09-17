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
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900">
                {{ props.options.isLocked ? 'Unlock' : 'Lock' }} this post?
              </DialogTitle>
              <div class="modal-body mt-2">
                <p class="text-sm text-gray-500">
                  Once {{ props.options.isLocked ? 'unlocked, the community will' : 'locked, the community will not' }} be able to reply.
                  <br/>
                  You can undo this action.
                </p>
              </div>
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button class="button" :class="props.options.isLocked ? 'green' : 'red'" @click="lockItem" :disabled="isLoading">
                  {{ isLoading ? 'Processing...' : `Yes, ${props.options.isLocked ? 'unlock' : 'lock'} this post.` }}
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
  import { useToastStore } from '@/stores/StoreToast';
  import { useModalStore } from '@/stores/StoreModal';
  import { usePostsStore } from '@/stores/StorePosts';
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue';

  const props = defineProps({
    isOpen: {
      type: Boolean
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
  const toast = useToastStore();

  // Loading state
  const isLoading = ref(false);

  const lockItem = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    const id = props.id;

    try {
      const { $gql } = useNuxtApp();
      const result = await $gql.mutation({
        setPostLocked: {
          __args: {
            id: id,
            value: !props.options.isLocked
          },
          id: true,
          isLocked: true
        }
      });

      if (result.setPostLocked) {
        // Show success toast
        setTimeout(() => {
          toast.addNotification({
            header:`Post ${props.options.isLocked ? 'unlocked' : 'locked'}.`,
            message:`The post ${props.options.isLocked ? 'is unlocked. Replies are allowed' : 'is locked. Replies are not allowed'}.`,
            type:'success'
          });
        }, 400);
      } else {
        throw new Error('Failed to update post lock status');
      }
    } catch (error) {
      console.error('Error updating post lock status:', error);
      // Show error toast
      setTimeout(() => {
        toast.addNotification({
          header:`${props.options.isLocked ? 'Unlocking' : 'Locking'} failed`,
          message:`Failed to ${props.options.isLocked ? 'unlock' : 'lock'} the post. Please try again.`,
          type:'error'
        });
      }, 400);
    } finally {
      isLoading.value = false;
      // Close the modal
      modalStore.closeModal();
    }
  };
</script>
