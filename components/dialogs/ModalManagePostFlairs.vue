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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-md bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 dark:text-white mb-4">
                Manage Post Flairs
              </DialogTitle>

              <div class="modal-body">
                <FlairSelector
                  :board-id="props.options.boardId"
                  flair-type="post"
                  :max-flairs="5"
                  v-model="selectedFlairIds"
                />
              </div>

              <div class="modal-footer mt-6 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal" :disabled="isLoading">
                  Cancel
                </button>
                <button class="button primary" @click="saveFlairs" :disabled="isLoading">
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useGraphQLMutation } from '@/composables/useGraphQL';
import FlairSelector from '@/components/flair/selector/FlairSelector.vue';
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
    type: Object as () => {
      boardId: number;
      currentFlairIds: number[];
    }
  }
});

const modalStore = useModalStore();
const toast = useToastStore();

const isLoading = ref(false);
const selectedFlairIds = ref<number[]>(props.options?.currentFlairIds || []);

const saveFlairs = async () => {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    const mutation = `
      mutation UpdatePostFlairs($postId: Int!, $flairIds: [Int!]!) {
        updatePostFlairs(postId: $postId, flairIds: $flairIds) {
          id
          postId
          templateId
          textDisplay
        }
      }
    `;

    const { data, error } = await useGraphQLMutation(mutation, {
      variables: {
        postId: props.id,
        flairIds: selectedFlairIds.value
      }
    });

    if (error.value) {
      throw new Error(error.value.message || 'Failed to update flairs');
    }

    toast.addNotification({
      header: 'Flairs Updated',
      message: 'Post flairs have been successfully updated.',
      type: 'success'
    });

    // Refresh the page to show updated flairs
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error('Error updating post flairs:', error);
    toast.addNotification({
      header: 'Update Failed',
      message: 'Failed to update post flairs. Please try again.',
      type: 'error'
    });
  } finally {
    isLoading.value = false;
    modalStore.closeModal();
  }
};
</script>
