<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <NuxtLink
        to="/streams"
        class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Streams
      </NuxtLink>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Discover Streams
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Browse and follow public streams created by the community
      </p>
    </div>

    <!-- Search & Filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search streams..."
        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >

      <select
        v-model="sortBy"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >
        <option value="popular">Most Popular</option>
        <option value="newest">Newest</option>
        <option value="followers">Most Followers</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <!-- Stream Grid -->
    <div v-else-if="filteredStreams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StreamCard
        v-for="stream in filteredStreams"
        :key="stream.id"
        :stream="stream"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        No streams found
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Try adjusting your search or filters
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDirectGraphQLRequest } from '@/composables/useGraphQL'
import StreamCard from '@/components/streams/StreamCard.vue'
import type { Stream } from '@/types/stream'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Discover Streams',
  meta: [
    {
      name: 'description',
      content: 'Browse and discover public content streams'
    }
  ]
})

const searchQuery = ref('')
const sortBy = ref('popular')
const loading = ref(false)
const error = ref<string | null>(null)
const publicStreams = ref<Stream[]>([])

const fetchPublicStreams = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: gqlError } = await useDirectGraphQLRequest<{ publicStreams: Stream[] }>(`
      query GetPublicStreams($sortBy: String!) {
        publicStreams(sortBy: $sortBy) {
          id
          name
          slug
          description
          icon
          color
          isFollowedByMe
          creator {
            id
            name
            displayName
            avatar
          }
          aggregates {
            id
            followers
            flairSubscriptionCount
            boardSubscriptionCount
          }
          creationDate
        }
      }
    `, { sortBy: sortBy.value })

    if (gqlError.value) throw gqlError.value
    if (data.value?.publicStreams) {
      publicStreams.value = data.value.publicStreams
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch public streams'
    console.error('Error fetching public streams:', err)
  } finally {
    loading.value = false
  }
}

const filteredStreams = computed(() => {
  if (!searchQuery.value) return publicStreams.value

  const query = searchQuery.value.toLowerCase()
  return publicStreams.value.filter(stream =>
    stream.name.toLowerCase().includes(query) ||
    stream.description?.toLowerCase().includes(query) ||
    stream.creator.name.toLowerCase().includes(query)
  )
})

// Watch sort changes
watch(sortBy, () => {
  fetchPublicStreams()
})

// Fetch on mount
onMounted(() => {
  fetchPublicStreams()
})
</script>
