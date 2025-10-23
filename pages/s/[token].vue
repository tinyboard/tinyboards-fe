<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        Invalid or Expired Share Link
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ error }}
      </p>
      <NuxtLink
        to="/streams/discover"
        class="mt-6 inline-block button primary"
      >
        Discover Public Streams
      </NuxtLink>
    </div>

    <!-- Stream Content -->
    <div v-else-if="sharedStream">
      <!-- Share Notice -->
      <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <p class="font-medium text-blue-800 dark:text-blue-200">
              You're viewing a shared stream
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
              This stream was shared by <strong>@{{ sharedStream.creator.username }}</strong>
            </p>
            <div v-if="!isLoggedIn" class="mt-3">
              <NuxtLink to="/login" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Log in to create your own streams
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Stream Viewer -->
      <StreamViewer :stream="sharedStream" :read-only="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StreamViewer from '@/components/streams/StreamViewer.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { getStreamByShareToken } = useStreamMutations()
const auth = useLoggedInUser()

const loading = ref(true)
const error = ref<string | null>(null)
const sharedStream = ref<any>(null)

const isLoggedIn = computed(() => auth.isAuthed)

// Fetch stream by share token
onMounted(async () => {
  const token = route.params.token as string
  if (!token) {
    error.value = 'No share token provided'
    loading.value = false
    return
  }

  try {
    sharedStream.value = await getStreamByShareToken(token)
  } catch (err: any) {
    error.value = err.message || 'Failed to load shared stream'
    console.error('Error loading shared stream:', err)
  } finally {
    loading.value = false
  }
})

// Dynamic head based on stream
useHead(() => ({
  title: sharedStream.value ? `${sharedStream.value.name} - Shared Stream` : 'Shared Stream',
  meta: [
    {
      name: 'description',
      content: sharedStream.value?.description || 'View this shared stream'
    }
  ]
}))
</script>
