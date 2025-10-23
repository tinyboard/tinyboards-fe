<template>
  <div class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-md overflow-hidden">
    <!-- Header -->
    <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
      <h3 class="font-bold text-sm flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        New Submissions
      </h3>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="p-4 text-center text-gray-400 text-sm">
      Loading...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-4 text-center text-red-500 text-sm">
      Failed to load new submissions
    </div>

    <!-- Submissions list -->
    <ul v-else-if="submissions && submissions.length > 0" class="divide-y divide-gray-100 dark:divide-gray-800">
      <li v-for="post in submissions" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <NuxtLink
          :to="`/b/${post.board?.name || 'unknown'}/p/${post.id}/${post.titleChunk || 'post'}`"
          class="flex items-start gap-2 p-2.5"
        >
          <!-- Post icon/avatar -->
          <div class="flex-shrink-0 mt-0.5">
            <CardsAvatar
              v-if="post.creator?.avatar"
              :src="post.creator.avatar"
              :alt="post.creator.name"
              size="xs"
              class="!w-6 !h-6"
            />
            <div v-else class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                <path d="M3 6l0 13" />
                <path d="M12 6l0 13" />
                <path d="M21 6l0 13" />
              </svg>
            </div>
          </div>

          <!-- Post info -->
          <div class="flex-1 min-w-0">
            <div class="text-sm leading-tight">
              <!-- Title -->
              <span class="text-primary hover:underline font-medium line-clamp-2">
                {{ post.title }}
              </span>

              <!-- Metadata -->
              <div class="text-gray-400 text-xs mt-0.5 space-y-0.5">
                <!-- Board name -->
                <div v-if="post.board">
                  <span v-if="post.board.name" class="block">
                    {{ post.board.name }}
                  </span>
                </div>

                <!-- Additional info with badge -->
                <div class="flex items-center gap-1.5">
                  <span v-if="post.creator?.name">{{ post.creator.name }}</span>
                  <span v-if="post.board?.name" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                    {{ post.board.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <!-- Empty state -->
    <div v-else class="p-4 text-center text-gray-400 text-sm">
      No new submissions
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGraphQLQuery } from '@/composables/useGraphQL';

const props = defineProps<{
  limit?: number;
}>();

const limit = props.limit || 10;

// Query for newest posts (includes both regular posts and thread posts)
const query_str = `
  query ListNewPosts($limit: Int!, $sort: String!, $listingType: String!) {
    listPosts(limit: $limit, sort: $sort, listingType: $listingType) {
      id
      title
      titleChunk
      creationDate
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

const { data, error, pending } = await useGraphQLQuery(query_str, {
  variables: {
    limit,
    sort: 'new', // Newest posts first
    listingType: 'all'
  }
});

const submissions = computed(() => {
  // listPosts already includes both regular posts and thread posts
  return data.value?.listPosts || [];
});
</script>
