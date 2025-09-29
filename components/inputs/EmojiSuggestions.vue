<template>
  <Teleport to="body">
    <div
      v-if="isVisible && suggestions.length > 0"
      class="fixed z-50 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg max-w-xs"
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
    >
      <div class="p-2">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
          Emoji suggestions
        </div>
        <div class="max-h-48 overflow-y-auto">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            @click="$emit('select', index)"
            class="w-full flex items-center px-2 py-1.5 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{
              'bg-primary text-white hover:bg-primary': index === selectedIndex
            }"
          >
            <img
              :src="suggestion.imageUrl"
              :alt="suggestion.altText"
              class="w-5 h-5 mr-2 object-contain"
            />
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm truncate">
                :{{ suggestion.shortcode }}:
              </div>
              <div class="text-xs opacity-75 truncate">
                {{ suggestion.altText }}
              </div>
            </div>
          </button>
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-2 px-2">
          ↑↓ navigate • Enter to select • Esc to close
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface EmojiSuggestion {
  id: number
  shortcode: string
  imageUrl: string
  altText: string
  category: string
  emojiScope: string
  isActive: boolean
  usageCount: number
  displayText: string
}

interface Props {
  suggestions: EmojiSuggestion[]
  isVisible: boolean
  position: { top: number; left: number }
  selectedIndex: number
}

defineProps<Props>()

defineEmits<{
  select: [index: number]
}>()
</script>