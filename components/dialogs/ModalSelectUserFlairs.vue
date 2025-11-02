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
                Select User Flairs
              </DialogTitle>

              <div class="modal-body">
                <FlairSelectorInline
                  :board-id="props.options?.boardId"
                  flair-type="user"
                  :max-flairs="3"
                  v-model="selectedUserFlairIds"
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
import { ref, watch } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useGraphQLMutation } from '@/composables/useGraphQL';
import FlairSelectorInline from '@/components/flair/selector/FlairSelectorInline.vue';
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
      boardId?: number;
      userId?: number;
      currentUserFlairIds?: Array<{
        templateId: number;
        customText?: string;
      }>;
    }
  }
});

const modalStore = useModalStore();
const toast = useToastStore();

interface FlairSelection {
  templateId: number;
  customText?: string;
}

const isLoading = ref(false);
const selectedUserFlairIds = ref<FlairSelection[]>(props.options?.currentUserFlairIds || []);

// Watch for changes to currentUserFlairIds when modal reopens
watch(() => props.options?.currentUserFlairIds, (newSelections) => {
  console.log('ModalSelectUserFlairs: currentUserFlairIds changed:', newSelections);
  if (newSelections) {
    selectedUserFlairIds.value = newSelections;
  }
}, { immediate: true });

const saveFlairs = async () => {
  if (isLoading.value) return;

  if (!props.options?.userId) {
    toast.addNotification({
      header: 'Error',
      message: 'User ID is required to update user flairs',
      type: 'error'
    });
    return;
  }

  isLoading.value = true;

  try {
    const mutation = `
      mutation UpdateUserFlairs($userId: Int!, $flairSelections: [UserFlairInput!]!, $boardId: Int) {
        updateUserFlairs(userId: $userId, flairSelections: $flairSelections, boardId: $boardId) {
          id
          userId
          templateId
          textDisplay
        }
      }
    `;

    const { data, error } = await useGraphQLMutation(mutation, {
      variables: {
        userId: props.options.userId,
        flairSelections: selectedUserFlairIds.value,
        boardId: props.options?.boardId
      }
    });

    if (error.value) {
      throw new Error(error.value.message || 'Failed to update user flairs');
    }

    toast.addNotification({
      header: 'Flairs Updated',
      message: 'Your user flairs have been successfully updated.',
      type: 'success'
    });

    modalStore.closeModal();

    // Refresh the page to show updated flairs after modal closes
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error: any) {
    console.error('Error updating user flairs:', error);
    toast.addNotification({
      header: 'Update Failed',
      message: error.message || 'Failed to update user flairs. Please try again.',
      type: 'error'
    });
    isLoading.value = false;
  }
};
</script>
