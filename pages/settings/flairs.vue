<template>
  <NuxtLayout name="settings">
    <div class="flex flex-col space-y-6">
      <!-- Page Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">User Flairs</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your user flairs for different boards
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading boards...</p>
      </div>

      <!-- Boards with User Flairs -->
      <div v-else class="space-y-6">
        <div
          v-for="board in subscribedBoards"
          :key="board.id"
          class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm overflow-hidden"
        >
          <div class="p-4 border-b dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ board.title || board.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                /b/{{ board.name }}
              </p>
            </div>
          </div>

          <div class="p-4">
            <UserFlairSelector
              :board-id="board.id"
              :user-id="userId"
              @flair-assigned="onFlairUpdated"
              @flair-removed="onFlairUpdated"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="subscribedBoards.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
            <path d="M12 9h.01" />
            <path d="M11 12h1v4h1" />
          </svg>
          <p class="mt-4 text-gray-600 dark:text-gray-400">You're not subscribed to any boards yet</p>
          <NuxtLink to="/boards" class="mt-4 inline-block button primary">
            Browse Boards
          </NuxtLink>
        </div>
      </div>

      <!-- Flair Filters Section -->
      <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm overflow-hidden">
        <div class="p-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Flair Filters</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Control which flairs you see in your feed
          </p>
        </div>

        <div class="p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Flair filtering allows you to hide or highlight posts with specific flairs.
            Visit individual board pages to configure flair filters for each board.
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useLoggedInUser } from '@/stores/StoreAuth';
import { useGraphQLQuery } from '@/composables/useGraphQL';
import UserFlairSelector from '@/components/flair/selector/UserFlairSelector.vue';

const authStore = useLoggedInUser();

definePageMeta({
  hasAuthRequired: true,
  isLeftNavbarDisabled: true,
  title: 'User Flairs'
});

useHead({
  title: 'User Flairs'
});

const loading = ref(true);
const userId = computed(() => authStore.user?.id || 0);

// Fetch subscribed boards
const { data: boardsData, error, refresh } = await useGraphQLQuery(`
  query GetUserSubscribedBoards {
    me {
      id
      joinedBoards {
        id
        name
        title
        description
        icon
      }
    }
  }
`);

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load boards',
    fatal: true
  });
}

const subscribedBoards = computed(() => boardsData.value?.me?.joinedBoards || []);
loading.value = false;

const onFlairUpdated = () => {
  // Optionally refresh data or show a message
};
</script>
