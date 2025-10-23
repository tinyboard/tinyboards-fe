<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading && !stream" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
      <NuxtLink
        to="/streams"
        class="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
      >
        Back to Streams
      </NuxtLink>
    </div>

    <!-- Stream Viewer -->
    <StreamViewer v-else-if="stream" :stream="stream" />
  </div>
</template>

<script setup lang="ts">
import StreamViewer from '@/components/streams/StreamViewer.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { fetchStream, loading, error } = useStream()

const stream = computed(() => useStreamStore().currentStream)

// Fetch stream by slug
onMounted(async () => {
  const slug = route.params.slug as string
  if (slug) {
    try {
      await fetchStream(slug)
    } catch (err) {
      console.error('Failed to load stream:', err)
    }
  }
})

// Dynamic head based on stream
useHead(() => ({
  title: stream.value ? `${stream.value.name} - Stream` : 'Stream',
  meta: [
    {
      name: 'description',
      content: stream.value?.description || 'Custom content stream'
    }
  ]
}))

// Clear stream on unmount
onUnmounted(() => {
  useStreamStore().clearCurrentStream()
})
</script>
