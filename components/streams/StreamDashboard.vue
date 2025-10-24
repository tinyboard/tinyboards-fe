<template>
  <div class="stream-dashboard">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Streams
        </h1>
        <NuxtLink
          to="/streams/create"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Stream
        </NuxtLink>
      </div>
      <p class="text-gray-600 dark:text-gray-400">
        Manage your custom streams and discover new ones
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        @click="refresh"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          @click="activeTab = 'my-streams'"
          :class="[
            'px-6 py-3 font-medium transition-colors border-b-2',
            activeTab === 'my-streams'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          ]"
        >
          My Streams ({{ myStreams.length }})
        </button>
        <button
          @click="activeTab = 'following'"
          :class="[
            'px-6 py-3 font-medium transition-colors border-b-2',
            activeTab === 'following'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          ]"
        >
          Following ({{ followedStreams.length }})
        </button>
      </div>

      <!-- My Streams Tab -->
      <div v-show="activeTab === 'my-streams'">
        <!-- Pinned streams -->
        <div v-if="pinnedStreams.length > 0" class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
              Pinned to Navbar
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Drag to reorder
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StreamCard
              v-for="stream in pinnedStreams"
              :key="stream.id"
              :stream="stream"
              :current-user-id="currentUserId"
              @edit="editStream"
              @share="shareStream"
              @delete="confirmDelete"
            />
          </div>
        </div>

        <!-- Other streams -->
        <div v-if="unpinnedStreams.length > 0">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Other Streams
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StreamCard
              v-for="stream in unpinnedStreams"
              :key="stream.id"
              :stream="stream"
              :current-user-id="currentUserId"
              @edit="editStream"
              @share="shareStream"
              @delete="confirmDelete"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="myStreams.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p class="font-medium mb-2">No streams yet</p>
          <p class="text-sm mb-4">Create your first custom stream to get started</p>
          <NuxtLink
            to="/streams/create"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Stream
          </NuxtLink>
        </div>
      </div>

      <!-- Following Tab -->
      <div v-show="activeTab === 'following'">
        <div v-if="followedStreams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StreamCard
            v-for="stream in followedStreams"
            :key="stream.id"
            :stream="stream"
            :current-user-id="currentUserId"
            @share="shareStream"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="font-medium mb-2">Not following any streams</p>
          <p class="text-sm mb-4">Discover and follow streams created by other users</p>
          <NuxtLink
            to="/streams/discover"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Discover Streams
          </NuxtLink>
        </div>
      </div>
    </div>

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

    <!-- Share Modal -->
    <StreamShareModal
      v-if="streamToShare"
      :stream="streamToShare"
      @close="streamToShare = null"
    />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="streamToDelete"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="streamToDelete = null"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Delete Stream?
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete "{{ streamToDelete.name }}"? This action cannot be undone.
              </p>

              <div class="flex gap-3">
                <button
                  @click="deleteStream"
                  :disabled="deleteLoading"
                  class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ deleteLoading ? 'Deleting...' : 'Delete' }}
                </button>
                <button
                  @click="streamToDelete = null"
                  :disabled="deleteLoading"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Stream } from '~/types/stream'
import StreamCard from './StreamCard.vue'
import StreamShareModal from './StreamShareModal.vue'

interface Props {
  currentUserId?: number
}

defineProps<Props>()

const router = useRouter()
const {
  streams: myStreams,
  followedStreams,
  pinnedStreams,
  unpinnedStreams,
  loading,
  error,
  fetchMyStreams,
  fetchFollowedStreams,
  deleteStream: deleteStreamAction,
} = useStream()

const activeTab = ref<'my-streams' | 'following'>('my-streams')
const streamToShare = ref<Stream | null>(null)
const streamToDelete = ref<Stream | null>(null)
const deleteLoading = ref(false)

const refresh = async () => {
  await Promise.all([
    fetchMyStreams(),
    fetchFollowedStreams(),
  ])
}

const editStream = (stream: Stream) => {
  router.push(`/streams/${stream.id}/edit`)
}

const shareStream = (stream: Stream) => {
  streamToShare.value = stream
}

const confirmDelete = (stream: Stream) => {
  streamToDelete.value = stream
}

const deleteStream = async () => {
  if (!streamToDelete.value || deleteLoading.value) return

  deleteLoading.value = true

  try {
    await deleteStreamAction(streamToDelete.value.id)
    streamToDelete.value = null
  } catch (err) {
    console.error('Error deleting stream:', err)
  } finally {
    deleteLoading.value = false
  }
}

// Fetch data on mount
onMounted(() => {
  refresh()
})
</script>

<style scoped>
.stream-dashboard {
  @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8;
}
</style>
