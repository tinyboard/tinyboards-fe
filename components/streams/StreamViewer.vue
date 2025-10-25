<template>
  <div class="stream-viewer">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-4 mb-4">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div
            v-if="stream.icon"
            class="w-20 h-20 rounded-full overflow-hidden"
          >
            <img :src="stream.icon" :alt="stream.name" class="w-full h-full object-cover">
          </div>
          <div
            v-else
            class="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl"
            :style="{ backgroundColor: stream.color || '#3B82F6' }"
          >
            {{ stream.name.charAt(0).toUpperCase() }}
          </div>
        </div>

        <!-- Info and actions -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4 mb-2">
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {{ stream.name }}
              </h1>
              <p v-if="stream.creator" class="text-gray-600 dark:text-gray-400">
                by @{{ stream.creator.name }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                v-if="!isOwner"
                @click="toggleFollow"
                :disabled="followLoading"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  stream.isFollowing
                    ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                ]"
              >
                {{ stream.isFollowing ? 'Following' : 'Follow' }}
              </button>

              <button
                v-if="isOwner"
                @click="$emit('edit')"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit
              </button>

              <button
                v-if="isOwner"
                @click="confirmDelete"
                class="px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Delete
              </button>

              <button
                @click="$emit('share')"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Share
              </button>
            </div>
          </div>

          <p
            v-if="stream.description"
            class="text-gray-700 dark:text-gray-300 mb-4"
          >
            {{ stream.description }}
          </p>

          <!-- Stats -->
          <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{{ stream.followerCount || 0 }} follower{{ (stream.followerCount || 0) !== 1 ? 's' : '' }}</span>
            </div>

            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{{ totalSources }} source{{ totalSources !== 1 ? 's' : '' }}</span>
            </div>

            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                stream.isPublic
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              ]"
            >
              {{ stream.isPublic ? 'Public' : 'Private' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Subscriptions summary -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-900 dark:text-gray-100">
            Active Subscriptions
          </span>
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ stream.flairSubscriptionCount || 0 }} flair{{ (stream.flairSubscriptionCount || 0) !== 1 ? 's' : '' }}</span>
            <span>{{ stream.boardSubscriptionCount || 0 }} board{{ (stream.boardSubscriptionCount || 0) !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter controls -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort:
          </label>
          <select
            v-model="sortType"
            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="HOT">Hot</option>
            <option value="NEW">New</option>
            <option value="TOP">Top</option>
            <option value="RISING">Rising</option>
          </select>
        </div>

        <button
          @click="refresh"
          :disabled="loading"
          class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            :class="['w-4 h-4', loading ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Posts feed -->
    <div
      ref="containerRef"
      class="space-y-4"
    >
      <!-- Loading initial posts -->
      <div v-if="loading && posts.length === 0" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Posts -->
      <template v-else-if="posts.length > 0">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />

        <!-- Load more -->
        <div v-if="hasMore" class="flex justify-center py-6">
          <button
            v-if="!loading"
            @click="loadMore"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Load More
          </button>
          <div v-else class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- End of feed -->
        <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400">
          <p class="text-sm">You've reached the end of this stream</p>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="font-medium mb-1">No posts yet</p>
        <p class="text-sm">Posts from your subscribed sources will appear here</p>
      </div>

      <!-- Error state -->
      <div v-if="error" class="text-center py-12">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button
          @click="refresh"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="cancelDelete"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Delete Stream
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete "{{ stream.name }}"? This action cannot be undone.
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="cancelDelete"
              :disabled="deleting"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="deleteStream"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Stream } from '~/types/stream'

interface Props {
  stream: Stream
  currentUserId?: number
}

interface Emits {
  (e: 'edit'): void
  (e: 'share'): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { followStream, unfollowStream } = useStream()
const { posts, hasMore, loading, error, loadMore, refresh, containerRef } = useStreamInfiniteScroll(
  computed(() => props.stream.id)
)

const sortType = ref(props.stream.sortType)
const followLoading = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)

const totalSources = computed(() => {
  return (props.stream.flairSubscriptionCount || 0) + (props.stream.boardSubscriptionCount || 0)
})

const isOwner = computed(() => {
  if (!props.currentUserId) return false
  return props.currentUserId === (props.stream.creator?.id || props.stream.creatorId)
})

const toggleFollow = async () => {
  if (followLoading.value) return

  followLoading.value = true

  try {
    if (props.stream.isFollowing) {
      await unfollowStream(props.stream.id)
    } else {
      await followStream(props.stream.id)
    }
  } catch (err) {
    console.error('Error toggling follow:', err)
  } finally {
    followLoading.value = false
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const deleteStream = async () => {
  if (deleting.value) return

  deleting.value = true

  try {
    const { deleteStream: deleteStreamFn } = useStream()
    await deleteStreamFn(props.stream.id)

    // Emit delete event to parent
    emit('delete')
  } catch (err) {
    console.error('Error deleting stream:', err)
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}

// Watch sort type changes
watch(sortType, () => {
  refresh()
})
</script>

<style scoped>
.stream-viewer {
  @apply w-full max-w-4xl mx-auto;
}
</style>
