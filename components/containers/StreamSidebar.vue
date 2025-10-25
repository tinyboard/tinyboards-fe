<template>
  <div
    v-if="stream"
    id="sidebar-stream"
    class="w-[290px] hidden md:flex flex-col flex-shrink-0 space-y-6 text-base"
  >
    <!-- Follow/Edit Actions -->
    <div class="flex flex-col gap-2">
      <button
        @click="$emit('toggleFollow')"
        :disabled="followLoading"
        :class="[
          'w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm',
          stream.isFollowing
            ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
      >
        {{ stream.isFollowing ? 'Unfollow' : 'Follow' }}
      </button>

      <button
        v-if="isOwner"
        @click="$emit('edit')"
        class="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Edit Stream
      </button>
    </div>

    <!-- Stream Details -->
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-700">
        About
        <span class="text-gray-700 dark:text-gray-400">{{ stream.name }}</span>
      </h2>
      <div class="prose prose-sm text-gray-900 dark:text-gray-200">
        <p v-if="stream.description">{{ stream.description }}</p>
        <p v-else class="text-gray-500 dark:text-gray-400 italic">No description provided</p>
      </div>
      <div class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z" />
            <path d="M3 14.803c.312 .135 .654 .204 1 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1 -.197" />
            <path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z" />
          </svg>
          Created
          <span class="ml-1 text-gray-900 dark:text-gray-200">{{
            stream.creationDate ? format(parseISO(stream.creationDate), "yyyy MMM. dd") : 'Unknown'
          }}</span>
        </div>
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="9" />
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
          <span>{{ stream.isPublic ? 'Public' : 'Private' }}</span>
        </div>
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M13.45 11.55l2.05 -2.05" />
            <path d="M6.4 20a9 9 0 1 1 11.2 0z" />
          </svg>
          <span>{{ stream.isDiscoverable ? 'Discoverable' : 'Not discoverable' }}</span>
        </div>
      </div>
    </div>

    <!-- Stream Statistics -->
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-700">
        Statistics
      </h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Followers</span>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ stream.followerCount || 0 }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Total Sources</span>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ stream.totalSubscriptions || 0 }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Board Subscriptions</span>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ stream.boardSubscriptionCount || 0 }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Flair Subscriptions</span>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ stream.flairSubscriptionCount || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Content Settings -->
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-700">
        Content Settings
      </h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Sort Type</span>
          <span class="font-medium text-gray-900 dark:text-gray-200 capitalize">{{ stream.sortType }}</span>
        </div>
        <div v-if="stream.timeRange" class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Time Range</span>
          <span class="font-medium text-gray-900 dark:text-gray-200 capitalize">{{ stream.timeRange }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">NSFW Content</span>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ stream.showNsfw ? 'Shown' : 'Hidden' }}</span>
        </div>
        <div v-if="stream.maxPostsPerBoard" class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Max per Board</span>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ stream.maxPostsPerBoard }}</span>
        </div>
      </div>
    </div>

    <!-- Owner Actions -->
    <div v-if="isOwner">
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-700">
        <span>Danger Zone</span>
      </h2>
      <button
        @click="$emit('delete')"
        class="flex items-center w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
        <span>Delete Stream</span>
      </button>
    </div>

    <!-- Creator Info -->
    <div v-if="stream.creator">
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-700">
        Creator
      </h2>
      <NuxtLink :to="`/@${stream.creator.name}`" class="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors">
        <div class="p-0.5 bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardsAvatar :src="stream.creator.avatar" alt="creator avatar" size="sm" class="!w-10 !h-10" />
        </div>
        <div class="flex flex-col justify-center leading-normal">
          <div class="flex items-center">
            <strong class="text-sm text-gray-900 dark:text-gray-200">
              {{ stream.creator.displayName || stream.creator.name }}
            </strong>
            <span v-if="stream.creator.isAdmin" class="ml-1 badge badge-red">Admin</span>
          </div>
          <small class="text-gray-400 block">@{{ stream.creator.name }}</small>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import type { Stream } from '@/types/stream'

const props = defineProps<{
  stream: Stream | null
  isOwner: boolean
  followLoading?: boolean
}>()

defineEmits<{
  edit: []
  delete: []
  toggleFollow: []
}>()
</script>
