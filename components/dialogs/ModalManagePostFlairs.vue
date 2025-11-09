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
                Manage Flairs
              </DialogTitle>

              <!-- Tabs -->
              <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    @click="activeTab = 'post'"
                    :class="[
                      activeTab === 'post'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    ]"
                  >
                    Post Flairs
                  </button>
                  <button
                    v-if="props.options?.userId"
                    @click="activeTab = 'user'"
                    :class="[
                      activeTab === 'user'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    ]"
                  >
                    User Flairs
                  </button>
                </nav>
              </div>

              <div class="modal-body">
                <!-- Post Flairs Tab -->
                <div v-if="activeTab === 'post'">
                  <FlairSelectorInline
                    :board-id="props.options?.boardId"
                    flair-type="post"
                    :max-flairs="5"
                    v-model="selectedPostFlairIds"
                  />
                </div>

                <!-- User Flairs Tab -->
                <div v-else-if="activeTab === 'user'">
                  <FlairSelectorInline
                    :board-id="props.options?.boardId"
                    flair-type="user"
                    :max-flairs="3"
                    v-model="selectedUserFlairIds"
                  />
                </div>
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
      currentFlairIds?: number[];
      userId?: number;
      currentUserFlairIds?: number[];
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
const activeTab = ref<'post' | 'user'>('post');
const selectedPostFlairIds = ref<FlairSelection[]>(props.options?.currentFlairIds || []);
const selectedUserFlairIds = ref<FlairSelection[]>(props.options?.currentUserFlairIds || []);

// Watch for changes to currentFlairIds when modal reopens
watch(() => props.options?.currentFlairIds, (newSelections) => {
  if (newSelections) {
    selectedPostFlairIds.value = newSelections;
  }
}, { immediate: true });

watch(() => props.options?.currentUserFlairIds, (newSelections) => {
  selectedUserFlairIds.value = newSelections || [];
}, { immediate: true, deep: true });

const saveFlairs = async () => {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    if (activeTab.value === 'post') {
      await savePostFlairs();
    } else if (activeTab.value === 'user') {
      await saveUserFlairs();
    }

    modalStore.closeModal();

    // Refresh the page to show updated flairs after modal closes
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error: any) {
    console.error('Error updating flairs:', error);
    toast.addNotification({
      header: 'Update Failed',
      message: error.message || 'Failed to update flairs. Please try again.',
      type: 'error'
    });
    isLoading.value = false;
  }
};

const savePostFlairs = async () => {
  const mutation = `
    mutation UpdatePostFlairs($postId: Int!, $flairSelections: [PostFlairInput!]!) {
      updatePostFlairs(postId: $postId, flairSelections: $flairSelections) {
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
      flairSelections: selectedPostFlairIds.value
    }
  });

  if (error.value) {
    console.error('GraphQL error details:', error.value);
    throw new Error(error.value.message || 'Failed to update post flairs');
  }

  if (!data.value?.updatePostFlairs) {
    console.error('No data returned from mutation');
    throw new Error('No data returned from server');
  }

  const savedFlairs = data.value.updatePostFlairs;

  // Check if any flairs were actually saved
  if (selectedPostFlairIds.value.length > 0 && savedFlairs.length === 0) {
    console.warn('Warning: Tried to save flairs but none were saved. This might be a validation issue on the backend.');
    toast.addNotification({
      header: 'Flairs Partially Updated',
      message: 'Some flairs could not be saved. They may not be valid for this post.',
      type: 'warning'
    });
  }

  toast.addNotification({
    header: 'Flairs Updated',
    message: 'Post flairs have been successfully updated.',
    type: 'success'
  });
};

const saveUserFlairs = async () => {
  if (!props.options?.userId) {
    throw new Error('User ID is required to update user flairs');
  }

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
    message: 'User flairs have been successfully updated.',
    type: 'success'
  });
};
</script>
