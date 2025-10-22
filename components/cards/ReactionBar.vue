<template>
  <div class="reaction-bar flex items-center gap-2">
    <!-- Overlapping emojis -->
    <div class="flex items-center -space-x-1">
      <button
        v-for="(reaction, index) in reactionCounts"
        :key="reaction.emoji"
        type="button"
        @click="handleReactionClick(reaction.emoji, $event)"
        class="inline-flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer ring-2 overflow-hidden"
        :class="isMyReaction(reaction.emoji)
          ? 'bg-primary/20 ring-primary hover:bg-primary/30 hover:scale-110'
          : 'bg-white dark:bg-gray-800 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 hover:scale-110'"
        :style="{ zIndex: reactionCounts.length - index }"
        :title="reaction.emoji"
      >
        <span v-if="!isCustomEmoji(reaction.emoji)" class="text-base">{{ reaction.emoji }}</span>
        <img v-else :src="getCustomEmojiUrl(reaction.emoji)" :alt="reaction.emoji" class="w-4 h-4 object-contain" />
      </button>
    </div>

    <!-- Username list (clickable to open modal) -->
    <button
      v-if="usernames.length > 0 && enableDetailsModal"
      @click="$emit('show-details', reactionCounts)"
      class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-hover hover:underline transition-colors"
      :title="allUsernames"
    >
      {{ usernameText }}
    </button>

    <!-- Add reaction button (if picker provided) -->
    <slot name="add-reaction">
      <button
        v-if="showAddButton"
        type="button"
        @click="$emit('add-click')"
        class="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <circle cx="12" cy="12" r="9"/>
          <line x1="9" y1="10" x2="9.01" y2="10"/>
          <line x1="15" y1="10" x2="15.01" y2="10"/>
          <path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>
          <line x1="12" y1="3" x2="12" y2="7"/>
          <line x1="12" y1="21" x2="12" y2="17"/>
        </svg>
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface User {
  id: number
  name: string
  displayName?: string
  avatar?: string
}

interface ReactionCount {
  id?: number
  emoji: string
  count: number
  users?: User[]
}

interface Props {
  reactionCounts?: ReactionCount[]
  myReaction?: string | null
  showAddButton?: boolean
  enableDetailsModal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  reactionCounts: () => [],
  myReaction: null,
  showAddButton: true,
  enableDetailsModal: false,
})

const emit = defineEmits<{
  toggle: [emoji: string]
  'add-click': []
  'show-details': [reactionCounts: ReactionCount[]]
}>()

const isMyReaction = (emoji: string): boolean => {
  return props.myReaction === emoji
}

const handleReactionClick = (emoji: string, event: MouseEvent) => {
  // Always toggle the reaction (single reaction per user enforced by backend)
  emit('toggle', emoji)
}

// Get all unique usernames who reacted
const usernames = computed(() => {
  const names: string[] = []
  for (const reaction of props.reactionCounts) {
    for (const user of reaction.users || []) {
      const displayName = user.displayName || user.name
      if (!names.includes(displayName)) {
        names.push(displayName)
      }
    }
  }
  return names
})

// Format username text for display
const usernameText = computed(() => {
  const names = usernames.value
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`
  if (names.length === 4) return `${names[0]}, ${names[1]}, ${names[2]} and ${names[3]}`
  if (names.length === 5) return `${names[0]}, ${names[1]}, ${names[2]}, ${names[3]} and ${names[4]}`
  if (names.length === 6) return `${names[0]}, ${names[1]}, ${names[2]}, ${names[3]}, ${names[4]} and ${names[5]}`
  // More than 6 users
  return `${names[0]}, ${names[1]}, ${names[2]}, ${names[3]}, ${names[4]}, ${names[5]} and ${names.length - 6} others`
})

// All usernames for tooltip
const allUsernames = computed(() => {
  return usernames.value.join(', ')
})

// Check if emoji is custom (starts with :)
const isCustomEmoji = (emoji: string): boolean => {
  return emoji.startsWith(':') && emoji.endsWith(':')
}

// Get custom emoji URL from shortcode
const getCustomEmojiUrl = (emojiCode: string): string => {
  if (!isCustomEmoji(emojiCode)) return ''

  // Extract shortcode (remove surrounding colons)
  const shortcode = emojiCode.slice(1, -1)

  // Construct URL - this assumes custom emojis follow TinyBoards URL pattern
  // You may need to adjust this based on your backend's actual URL structure
  const domain = window.location.hostname
  const protocol = window.location.protocol
  return `${protocol}//${domain}/pictrs/image/${shortcode}`
}
</script>

<style scoped>
.reaction-bar {
  /* Component-specific styles */
}
</style>
