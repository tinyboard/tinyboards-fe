<template>
  <div class="reaction-picker relative inline-block" v-click-outside="closePicker">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="togglePicker"
      class="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      :class="{ 'bg-gray-100 dark:bg-gray-700': isOpen }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="12" cy="12" r="9"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
        <path d="M8 13a4 4 0 1 0 8 0m0 0H8"/>
      </svg>
      <span>React</span>
    </button>

    <!-- Reaction Picker Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-3"
        :class="placement === 'top' ? 'bottom-full mb-2' : 'top-full'"
      >
        <div class="flex flex-wrap gap-2 max-w-xs">
          <button
            v-for="[emoji, score] in sortedEmojis"
            :key="emoji"
            type="button"
            @click="selectReaction(emoji)"
            class="text-2xl hover:scale-125 transition-transform p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{
              'ring-2 ring-primary': myReaction === emoji,
            }"
            :title="`${emoji} (${score === 1 ? 'positive' : score === -1 ? 'negative' : 'neutral'})`"
          >
            {{ emoji }}
          </button>
        </div>

        <!-- Legend -->
        <div class="mt-3 pt-2 border-t dark:border-gray-700 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-1">
            <span class="text-green-500">👍</span>
            <span>Positive</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-gray-500">😂</span>
            <span>Neutral</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-red-500">👎</span>
            <span>Negative</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  emojiWeights?: Record<string, number>
  myReaction?: string | null
  placement?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  emojiWeights: () => ({
    '👍': 1,
    '❤️': 1,
    '😂': 0,
    '😮': 0,
    '😢': 0,
    '👎': -1,
  }),
  myReaction: null,
  placement: 'bottom',
})

const emit = defineEmits<{
  select: [emoji: string]
}>()

const isOpen = ref(false)

// Sort emojis: positive first, then neutral, then negative
const sortedEmojis = computed(() => {
  const entries = Object.entries(props.emojiWeights)
  return entries.sort((a, b) => {
    // Sort by score descending (1, 0, -1)
    return (b[1] as number) - (a[1] as number)
  })
})

const togglePicker = () => {
  isOpen.value = !isOpen.value
}

const closePicker = () => {
  isOpen.value = false
}

const selectReaction = (emoji: string) => {
  emit('select', emoji)
  closePicker()
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any).clickOutsideEvent)
  },
}
</script>

<style scoped>
.reaction-picker {
  /* Ensure proper stacking */
}
</style>
