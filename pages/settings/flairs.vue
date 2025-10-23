<template>
  <NuxtLayout name="settings">
    <div class="flex flex-col space-y-6">
      <!-- Page Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Flair Settings</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your flairs and customize how you see flaired content
        </p>
      </div>

      <!-- My Flairs Section -->
      <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm overflow-hidden">
        <div class="p-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">My Flairs</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your current flairs across different boards
          </p>
        </div>

        <div class="p-4">
          <!-- Site-wide flairs -->
          <div v-if="siteWideFlairs.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Site-Wide Flairs</h4>
            <div class="space-y-3">
              <div
                v-for="flair in siteWideFlairs"
                :key="flair.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-800 rounded-md"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :style="{
                      backgroundColor: flair.backgroundColor || '#e5e7eb',
                      color: flair.textColor || '#374151'
                    }"
                  >
                    {{ flair.displayText }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ flair.description || flair.name }}
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    v-if="flair.allowUserEdit"
                    @click="editUserFlair(flair)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    @click="removeUserFlair(flair.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Board-specific flairs -->
          <div v-for="board in boardsWithFlairs" :key="board.id" class="mb-6 last:mb-0">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ board.name }}
            </h4>
            <div class="space-y-3">
              <div
                v-for="flair in board.flairs"
                :key="flair.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-800 rounded-md"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :style="{
                      backgroundColor: flair.backgroundColor || '#e5e7eb',
                      color: flair.textColor || '#374151'
                    }"
                  >
                    {{ flair.displayText }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ flair.description || flair.name }}
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    v-if="flair.allowUserEdit"
                    @click="editUserFlair(flair)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    @click="removeUserFlair(flair.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <button
              v-if="canRequestFlairForBoard(board.id)"
              @click="requestFlairForBoard(board)"
              class="mt-3 button gray text-sm"
            >
              Request New Flair
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="!hasAnyFlairs" class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 9h.01" />
              <path d="M11 12h1v4h1" />
            </svg>
            <p class="mt-4 text-gray-600 dark:text-gray-400">You don't have any flairs yet</p>
          </div>
        </div>
      </div>

      <!-- Flair Filters Section -->
      <FlairFilterConfigurator
        :flairs="availableFlairs"
        :available-boards="subscribedBoards"
        :initial-mode="filterMode"
        :initial-selected-flairs="selectedFlairFilters"
        :initial-board="selectedBoardFilter"
        @save="saveFlairFilters"
        @reset="resetFlairFilters"
      />

      <!-- Display Preferences Section -->
      <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm overflow-hidden">
        <div class="p-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Display Preferences</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Control how flairs are displayed
          </p>
        </div>

        <div class="p-4 space-y-4">
          <!-- Show My Flairs -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Show My Flairs</label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Display your flairs next to your username in posts and comments
              </p>
            </div>
            <button
              @click="toggleShowMyFlairs"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              :class="preferences.showMyFlairs ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="preferences.showMyFlairs ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>

          <!-- Show Other Users' Flairs -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Show Other Users' Flairs</label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Display flairs for other users in posts and comments
              </p>
            </div>
            <button
              @click="toggleShowOtherFlairs"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              :class="preferences.showOtherFlairs ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="preferences.showOtherFlairs ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>

          <!-- Show Post Flairs -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Show Post Flairs</label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Display flairs on posts
              </p>
            </div>
            <button
              @click="toggleShowPostFlairs"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              :class="preferences.showPostFlairs ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="preferences.showPostFlairs ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <button
            @click="savePreferences"
            class="button primary"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Saving...' : 'Save Preferences' }}
          </button>
        </div>
      </div>

      <!-- Flair Request Modal -->
      <div
        v-if="showRequestModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="closeRequestModal"
      >
        <div class="bg-white dark:bg-gray-950 rounded-lg shadow-xl max-w-md w-full m-4">
          <div class="p-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Request Flair for {{ selectedBoard?.name }}
            </h4>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Flair
                </label>
                <select v-model="requestData.flairId" class="form-select gray w-full">
                  <option value="">Choose a flair...</option>
                  <option v-for="flair in availableFlairsForBoard" :key="flair.id" :value="flair.id">
                    {{ flair.displayText }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  v-model="requestData.message"
                  rows="4"
                  class="form-input gray w-full"
                  placeholder="Explain why you want this flair..."
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                @click="closeRequestModal"
                class="button gray"
              >
                Cancel
              </button>
              <button
                @click="submitFlairRequest"
                class="button primary"
                :disabled="!requestData.flairId || isSubmitting"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';
import FlairFilterConfigurator from '@/components/flair/management/FlairFilterConfigurator.vue';

const toast = useToastStore();

definePageMeta({
  hasAuthRequired: true,
  isLeftNavbarDisabled: true,
  title: 'Flair Settings'
});

useHead({
  title: 'Flair Settings'
});

const isSaving = ref(false);
const isSubmitting = ref(false);
const showRequestModal = ref(false);
const selectedBoard = ref(null);
const requestData = ref({
  flairId: '',
  message: ''
});

// Fetch user flairs and preferences
const { data: userData, error, refresh } = await useGraphQLQuery(`
  query GetUserFlairSettings {
    me {
      id
      name
      flairs {
        id
        name
        displayText
        description
        backgroundColor
        textColor
        allowUserEdit
        board {
          id
          name
        }
      }
    }
    getUserFlairPreferences {
      showMyFlairs
      showOtherFlairs
      showPostFlairs
      filterMode
      selectedBoardFilter
      selectedFlairFilters
    }
    getSubscribedBoards {
      id
      name
      allowUserFlairRequests
    }
  }
`);

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load flair settings',
    fatal: true
  });
}

const userFlairs = computed(() => userData.value?.me?.flairs || []);
const flairPreferences = computed(() => userData.value?.getUserFlairPreferences || {});
const subscribedBoards = computed(() => userData.value?.getSubscribedBoards || []);

const preferences = ref({
  showMyFlairs: flairPreferences.value.showMyFlairs ?? true,
  showOtherFlairs: flairPreferences.value.showOtherFlairs ?? true,
  showPostFlairs: flairPreferences.value.showPostFlairs ?? true
});

const filterMode = ref(flairPreferences.value.filterMode || 'exclude');
const selectedBoardFilter = ref(flairPreferences.value.selectedBoardFilter || null);
const selectedFlairFilters = ref(flairPreferences.value.selectedFlairFilters || []);

const siteWideFlairs = computed(() => {
  return userFlairs.value.filter(f => !f.board);
});

const boardsWithFlairs = computed(() => {
  const boards = new Map();

  userFlairs.value.forEach(flair => {
    if (flair.board) {
      if (!boards.has(flair.board.id)) {
        boards.set(flair.board.id, {
          id: flair.board.id,
          name: flair.board.name,
          flairs: []
        });
      }
      boards.get(flair.board.id).flairs.push(flair);
    }
  });

  return Array.from(boards.values());
});

const hasAnyFlairs = computed(() => userFlairs.value.length > 0);

// Fetch available flairs for filtering
const { data: flairsData } = await useGraphQLQuery(`
  query GetAvailableFlairs {
    getAvailableFlairs {
      id
      name
      displayText
      backgroundColor
      textColor
      flairType
      boardId
      category {
        id
        name
      }
    }
  }
`);

const availableFlairs = computed(() => flairsData.value?.getAvailableFlairs || []);

const toggleShowMyFlairs = () => {
  preferences.value.showMyFlairs = !preferences.value.showMyFlairs;
};

const toggleShowOtherFlairs = () => {
  preferences.value.showOtherFlairs = !preferences.value.showOtherFlairs;
};

const toggleShowPostFlairs = () => {
  preferences.value.showPostFlairs = !preferences.value.showPostFlairs;
};

const savePreferences = async () => {
  isSaving.value = true;
  try {
    const mutation = `
      mutation UpdateFlairPreferences($input: UpdateFlairPreferencesInput!) {
        updateFlairPreferences(input: $input)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        input: preferences.value
      }
    });

    if (result.value?.updateFlairPreferences) {
      toast.addNotification({
        header: 'Preferences saved',
        message: 'Your flair preferences have been updated.',
        type: 'success'
      });
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    toast.addNotification({
      header: 'Save failed',
      message: error.message || 'Failed to save preferences.',
      type: 'error'
    });
  } finally {
    isSaving.value = false;
  }
};

const saveFlairFilters = async (filterData) => {
  try {
    const mutation = `
      mutation UpdateFlairFilters($input: UpdateFlairFiltersInput!) {
        updateFlairFilters(input: $input)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        input: filterData
      }
    });

    if (result.value?.updateFlairFilters) {
      toast.addNotification({
        header: 'Filters saved',
        message: 'Your flair filters have been updated.',
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error saving filters:', error);
    toast.addNotification({
      header: 'Save failed',
      message: error.message || 'Failed to save filters.',
      type: 'error'
    });
  }
};

const resetFlairFilters = async () => {
  if (!confirm('Are you sure you want to reset your flair filters to default?')) return;

  try {
    const mutation = `
      mutation ResetFlairFilters {
        resetFlairFilters
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation);

    if (result.value?.resetFlairFilters) {
      toast.addNotification({
        header: 'Filters reset',
        message: 'Your flair filters have been reset to default.',
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error resetting filters:', error);
    toast.addNotification({
      header: 'Reset failed',
      message: error.message || 'Failed to reset filters.',
      type: 'error'
    });
  }
};

const removeUserFlair = async (flairId) => {
  if (!confirm('Are you sure you want to remove this flair?')) return;

  try {
    const mutation = `
      mutation RemoveUserFlair($flairId: Int!) {
        removeUserFlair(flairId: $flairId)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairId
      }
    });

    if (result.value?.removeUserFlair) {
      toast.addNotification({
        header: 'Flair removed',
        message: 'The flair has been removed from your profile.',
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error removing flair:', error);
    toast.addNotification({
      header: 'Remove failed',
      message: error.message || 'Failed to remove flair.',
      type: 'error'
    });
  }
};

const editUserFlair = (flair) => {
  // TODO: Implement flair editing modal
  toast.addNotification({
    header: 'Coming soon',
    message: 'Flair editing will be available soon.',
    type: 'info'
  });
};

const canRequestFlairForBoard = (boardId) => {
  const board = subscribedBoards.value.find(b => b.id === boardId);
  return board?.allowUserFlairRequests ?? false;
};

const requestFlairForBoard = (board) => {
  selectedBoard.value = board;
  requestData.value = {
    flairId: '',
    message: ''
  };
  showRequestModal.value = true;
};

const availableFlairsForBoard = computed(() => {
  if (!selectedBoard.value) return [];
  return availableFlairs.value.filter(f =>
    f.boardId === selectedBoard.value.id &&
    f.flairType === 'user' &&
    !userFlairs.value.some(uf => uf.id === f.id)
  );
});

const closeRequestModal = () => {
  showRequestModal.value = false;
  selectedBoard.value = null;
  requestData.value = {
    flairId: '',
    message: ''
  };
};

const submitFlairRequest = async () => {
  isSubmitting.value = true;
  try {
    const mutation = `
      mutation RequestUserFlair($input: RequestUserFlairInput!) {
        requestUserFlair(input: $input) {
          id
        }
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        input: {
          flairId: parseInt(requestData.value.flairId),
          message: requestData.value.message
        }
      }
    });

    if (result.value?.requestUserFlair) {
      toast.addNotification({
        header: 'Request submitted',
        message: 'Your flair request has been submitted for approval.',
        type: 'success'
      });
      closeRequestModal();
    }
  } catch (error) {
    console.error('Error submitting request:', error);
    toast.addNotification({
      header: 'Request failed',
      message: error.message || 'Failed to submit flair request.',
      type: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
