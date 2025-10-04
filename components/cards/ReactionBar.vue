<template>
  <div v-if="reactionCounts && reactionCounts.length > 0" class="reaction-bar flex flex-wrap gap-2 items-center">
    <!-- Each reaction count -->
    <button
      v-for="reaction in reactionCounts"
      :key="reaction.emoji"
      type="button"
      @click="toggleReaction(reaction.emoji)"
      class="flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all"
      :class="isMyReaction(reaction.emoji)
        ? 'bg-primary/20 text-primary ring-1 ring-primary hover:bg-primary/30'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
    >
      <span class="text-base">{{ reaction.emoji }}</span>
      <span class="font-medium">{{ reaction.count }}</span>
    </button>

    <!-- Add reaction button (if picker provided) -->
    <slot name="add-reaction">
      <button
        v-if="showAddButton"
        type="button"
        @click="$emit('add-click')"
        class="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

interface ReactionCount {
  emoji: string
  count: number
}

interface Props {
  reactionCounts?: ReactionCount[]
  myReaction?: string | null
  showAddButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  reactionCounts: () => [],
  myReaction: null,
  showAddButton: true,
})

const emit = defineEmits<{
  toggle: [emoji: string]
  'add-click': []
}>()

const isMyReaction = (emoji: string): boolean => {
  return props.myReaction === emoji
}

const toggleReaction = (emoji: string) => {
  emit('toggle', emoji)
}
</script>

<style scoped>
.reaction-bar {
  /* Component-specific styles */
}
</style>
