<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Streams
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Manage your custom content feeds
          </p>
        </div>

        <NuxtLink
          to="/streams/create"
          class="button primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Stream
        </NuxtLink>
      </div>
    </div>

    <!-- Dashboard Component -->
    <StreamDashboard />

    <!-- Discover Link -->
    <div class="mt-8 text-center">
      <NuxtLink
        to="/streams/discover"
        class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Discover Public Streams
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import StreamDashboard from '@/components/streams/StreamDashboard.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

useHead({
  title: 'My Streams',
  meta: [
    {
      name: 'description',
      content: 'Manage your custom content feeds and streams'
    }
  ]
})

// Fetch streams on mount
const { fetchMyStreams, loading } = useStream()

onMounted(() => {
  fetchMyStreams()
})
</script>
