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
        ref="dropdown"
        class="absolute z-50 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-3"
        :class="dropdownClasses"
      >
        <div class="flex flex-wrap gap-2 max-w-xs">
          <button
            v-for="[emoji, score] in sortedEmojis"
            :key="emoji"
            type="button"
            @click="selectReaction(emoji)"
            class="hover:scale-125 transition-transform p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
            :class="{
              'ring-2 ring-primary': myReaction === emoji,
            }"
            :title="`${emoji} (${score === 1 ? 'positive' : score === -1 ? 'negative' : 'neutral'})`"
          >
            <span v-if="!isCustomEmoji(emoji)" class="text-2xl">{{ emoji }}</span>
            <img v-else :src="getCustomEmojiUrl(emoji)" :alt="emoji" class="w-6 h-6 object-contain" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

interface Props {
  emojiWeights?: Record<string, number>
  myReaction?: string | null
  placement?: 'top' | 'bottom' | 'auto'
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
  placement: 'auto',
})

const emit = defineEmits<{
  select: [emoji: string]
}>()

const isOpen = ref(false)
const dropdown = ref<HTMLElement | null>(null)
const actualPlacement = ref<'top' | 'bottom'>('bottom')

// Sort emojis: positive first, then neutral, then negative
const sortedEmojis = computed(() => {
  const entries = Object.entries(props.emojiWeights)
  return entries.sort((a, b) => {
    // Sort by score descending (1, 0, -1)
    return (b[1] as number) - (a[1] as number)
  })
})

const togglePicker = async () => {
  isOpen.value = !isOpen.value

  if (isOpen.value && props.placement === 'auto') {
    await nextTick()
    detectPlacement()
  }
}

const closePicker = () => {
  isOpen.value = false
}

const detectPlacement = () => {
  if (!dropdown.value) return

  const rect = dropdown.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  // If dropdown would overflow bottom of viewport, show it above
  if (rect.bottom > viewportHeight - 20) {
    actualPlacement.value = 'top'
  } else {
    actualPlacement.value = 'bottom'
  }
}

const dropdownClasses = computed(() => {
  const finalPlacement = props.placement === 'auto' ? actualPlacement.value : props.placement

  return {
    'bottom-full mb-2': finalPlacement === 'top',
    'top-full mt-2': finalPlacement === 'bottom',
    'right-0': true,
  }
})

const selectReaction = (emoji: string) => {
  emit('select', emoji)
  closePicker()
}

// Check if emoji is custom (starts with :)
const isCustomEmoji = (emoji: string): boolean => {
  return emoji.startsWith(':') && emoji.endsWith(':')
}

// Get custom emoji URL from shortcode
const getCustomEmojiUrl = (emojiCode: string): string => {
  if (!isCustomEmoji(emojiCode)) return ''

  // Extract shortcode (remove surrounding colons)
  const shortcode = emojiCode.slice(1, -1)

  // Construct URL
  const domain = window.location.hostname
  const protocol = window.location.protocol
  return `${protocol}//${domain}/pictrs/image/${shortcode}`
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
