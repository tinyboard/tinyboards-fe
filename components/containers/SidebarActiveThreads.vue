<template>
  <div class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-md overflow-hidden">
    <!-- Header -->
    <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
      <h3 class="font-bold text-sm flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 12l3 0" />
          <path d="M12 3l0 3" />
          <path d="M7.8 7.8l-2.2 -2.2" />
          <path d="M16.2 7.8l2.2 -2.2" />
          <path d="M7.8 16.2l-2.2 2.2" />
          <path d="M12 12l9 3l-4 2l-2 4l-3 -9" />
        </svg>
        Active Threads
      </h3>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="p-4 text-center text-gray-400 text-sm">
      Loading...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-4 text-center text-red-500 text-sm">
      Failed to load active threads
    </div>

    <!-- Thread list -->
    <ul v-else-if="threads && threads.length > 0" class="divide-y divide-gray-100 dark:divide-gray-800">
      <li v-for="thread in threads" :key="thread.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <NuxtLink
          :to="thread.urlPath || `/b/${thread.board?.name || 'unknown'}/p/${thread.id}/${thread.slug || thread.titleChunk || 'post'}`"
          class="flex items-start gap-2 p-2.5"
        >
          <!-- Thread icon/avatar -->
          <div class="flex-shrink-0 mt-0.5">
            <CardsAvatar
              v-if="thread.creator?.avatar"
              :src="thread.creator.avatar"
              :alt="thread.creator.name"
              size="xs"
              class="!w-6 !h-6"
            />
            <div v-else class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M8 9h8" />
                <path d="M8 13h6" />
                <path d="M9 18h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3l-3 -3z" />
              </svg>
            </div>
          </div>

          <!-- Thread info -->
          <div class="flex-1 min-w-0">
            <div class="text-sm leading-tight">
              <!-- Title -->
              <span class="text-primary hover:underline font-medium line-clamp-2">
                {{ thread.title }}
              </span>

              <!-- Board name if available -->
              <span v-if="thread.board" class="text-gray-400 text-xs block mt-0.5">
                /{{ thread.board.name }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <!-- Empty state -->
    <div v-else class="p-4 text-center text-gray-400 text-sm">
      No active threads
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGraphQLQuery } from '@/composables/useGraphQL';

const props = defineProps<{
  limit?: number;
}>();

const limit = props.limit || 10;

// Query for active posts (with recent comment activity)
const postsQuery = `
  query ListActivePosts($limit: Int!, $sort: String!, $listingType: String!) {
    listPosts(limit: $limit, sort: $sort, listingType: $listingType) {
      id
      title
      titleChunk
      slug
      urlPath
      commentCount
      creationDate
      updated
      postType
      creator {
        id
        name
        avatar
      }
      board {
        id
        name
        title
      }
    }
  }
`;

const { data: postsData, error, pending } = await useGraphQLQuery(postsQuery, {
  variables: {
    limit,
    sort: 'newComments', // Posts with recent comments
    listingType: 'all'
  }
});

// Combine posts and threads, sorted by comment activity
const threads = computed(() => {
  const posts = postsData.value?.listPosts || [];
  // listPosts already includes both regular posts and thread posts
  // We just return them all since they're already sorted by newComments
  return posts.slice(0, limit);
});
</script>
