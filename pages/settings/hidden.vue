<template>
  <NuxtLayout name="settings">
    <!-- Page Heading & Description -->
    <div class="p-4">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Hidden Posts</h3>
      <p class="mt-1 text-sm text-gray-600">View and manage posts you've hidden from your feed.</p>
    </div>
    <!-- View Options -->
    <div
      class="flex items-center mb-4 p-2.5 sm:px-4 sm:py-3 bg-gray-100 dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md dark:border-gray-800 dark:shadow-none">
      <div class="ml-auto flex space-x-2">
        <button class="ml-auto" @click="preferCardView = true">
          <!-- Rows Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
            :class="preferCardView ? 'text-primary' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <rect x="4" y="4" width="16" height="6" rx="2"></rect>
            <rect x="4" y="14" width="16" height="6" rx="2"></rect>
          </svg>
        </button>
        <button class="ml-auto" @click="preferCardView = false">
          <!-- Cards Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
            :class="preferCardView ? 'text-gray-500' : 'text-primary'" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            <line x1="4" y1="12" x2="20" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
    <!-- Hidden Posts -->
    <LazyListsPosts v-if="hiddenPosts?.length" :posts="hiddenPosts" :isCompact="!preferCardView" :isLoading="pending"
      :hasError="error" />
    <!-- Empty State -->
    <div v-else
      class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
          <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
          <path d="M3 3l18 18"></path>
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hidden posts</h3>
      <p class="mt-1 text-sm text-gray-500">
        You haven't hidden any posts yet. Posts you hide will appear here.
      </p>
    </div>
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
      <LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { usePostsStore } from '@/stores/StorePosts';

definePageMeta({
  'hasAuthRequired': true,
  'title': 'Hidden Posts',
  isFooterDisabled: true,
  isScrollDisabled: true,
  'isLeftNavbarDisabled': true
});

const preferCardView = useCookie('preferCardView') ?? false;

const route = useRoute();
const postsStore = usePostsStore();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 25);

// TODO: When backend GraphQL schema includes getHiddenPosts query, replace with:
// const { data, pending, error, refresh } = await useAsyncQuery('getHiddenPosts', {
//   limit: limit.value,
//   page: page.value,
//   sort: 'new'
// });

// Temporary placeholder - replace with actual hidden posts query when backend is ready
const hiddenPosts = ref([]);
const totalCount = ref(0);
const pending = ref(false);
const error = ref(null);

// Placeholder refresh function
const refresh = async () => {
  // TODO: Implement when backend query is available
  console.log('Hidden posts refresh - waiting for backend implementation');
};

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / limit.value || 1);
});

// Watch for route changes and refetch data
watch(() => route.query, async () => {
  await refresh();
});
</script>