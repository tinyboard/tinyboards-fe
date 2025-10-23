<template>
  <div
    class="stream-card bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
  >
    <div class="p-5">
      <!-- Header -->
      <div class="flex items-start gap-4 mb-4">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div
            v-if="stream.icon"
            class="w-16 h-16 rounded-full overflow-hidden"
          >
            <img :src="stream.icon" :alt="stream.name" class="w-full h-full object-cover">
          </div>
          <div
            v-else
            class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            :style="{ backgroundColor: stream.color || '#3B82F6' }"
          >
            {{ stream.name.charAt(0).toUpperCase() }}
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {{ stream.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                by @{{ stream.creator.username }}
              </p>
            </div>

            <!-- Privacy badge -->
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded flex-shrink-0',
                stream.isPublic
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              ]"
            >
              {{ stream.isPublic ? 'Public' : 'Private' }}
            </span>
          </div>

          <p
            v-if="stream.description"
            class="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2"
          >
            {{ stream.description }}
          </p>
        </div>
      </div>

      <!-- Subscription summary -->
      <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="font-medium">
              {{ totalSources }} source{{ totalSources !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span v-if="stream.aggregates.flairSubscriptionCount > 0">
              {{ stream.aggregates.flairSubscriptionCount }} flair{{ stream.aggregates.flairSubscriptionCount !== 1 ? 's' : '' }}
            </span>
            <span v-if="stream.aggregates.boardSubscriptionCount > 0">
              {{ stream.aggregates.boardSubscriptionCount }} board{{ stream.aggregates.boardSubscriptionCount !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{{ stream.aggregates.followers }} follower{{ stream.aggregates.followers !== 1 ? 's' : '' }}</span>
        </div>

        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ formatDate(stream.createdAt) }}</span>
        </div>

        <div v-if="stream.addedToNavbar" class="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <span>Pinned</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <NuxtLink
          :to="`/streams/@${stream.creator.username}/${stream.slug}`"
          class="flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          View Stream
        </NuxtLink>

        <button
          v-if="canEdit"
          @click="$emit('edit', stream)"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Edit stream"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          v-if="stream.isPublic"
          @click="$emit('share', stream)"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Share stream"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        <!-- Follow/Unfollow button -->
        <button
          v-if="!isOwner"
          @click="toggleFollow"
          :disabled="followLoading"
          :class="[
            'px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed',
            stream.isFollowedByMe
              ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          ]"
          :title="stream.isFollowedByMe ? 'Unfollow stream' : 'Follow stream'"
        >
          <svg v-if="!followLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="stream.isFollowedByMe" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </button>

        <!-- Delete button -->
        <button
          v-if="canDelete"
          @click="$emit('delete', stream)"
          class="px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Delete stream"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stream } from '~/types/stream'

interface Props {
  stream: Stream
  currentUserId?: number
}

interface Emits {
  (e: 'edit', stream: Stream): void
  (e: 'share', stream: Stream): void
  (e: 'delete', stream: Stream): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { followStream, unfollowStream } = useStream()

const followLoading = ref(false)

const totalSources = computed(() => {
  return props.stream.aggregates.flairSubscriptionCount + props.stream.aggregates.boardSubscriptionCount
})

const isOwner = computed(() => {
  return props.currentUserId === props.stream.creator.id
})

const canEdit = computed(() => isOwner.value)
const canDelete = computed(() => isOwner.value)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

const toggleFollow = async () => {
  if (followLoading.value) return

  followLoading.value = true

  try {
    if (props.stream.isFollowedByMe) {
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
</script>

<style scoped>
.stream-card {
  @apply w-full;
}
</style>
