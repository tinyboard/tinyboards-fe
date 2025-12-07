<template>
  <div class="w-full">
    <!-- Simple Text Area for Mobile -->
    <div class="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <!-- Simple Text Editor -->
      <textarea
        ref="textArea"
        v-model="content"
        @input="handleInput"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full h-48 p-4 pb-16 bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed"
        :style="{ height: height }"
      />

      <!-- Bottom Controls -->
      <div class="absolute bottom-3 right-3 flex items-center gap-2">
        <!-- Emoji Picker Button -->
        <button
          type="button"
          @click="toggleEmojiPicker"
          class="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Add emoji"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="m9 9 1.5 1.5L15 6"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          </svg>
        </button>
      </div>

      <!-- Emoji Picker -->
      <div
        v-if="showEmojiPicker"
        class="absolute bottom-16 right-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 z-50 w-64 max-h-48 overflow-y-auto"
      >
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in commonEmojis"
            :key="emoji"
            type="button"
            @click="insertEmoji(emoji)"
            class="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <!-- Character Count (if needed) -->
      <div v-if="showCharCount" class="absolute bottom-3 left-3 text-xs text-gray-500">
        {{ content.length }}{{ maxLength ? `/${maxLength}` : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Write a comment...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '200px'
  },
  maxLength: {
    type: Number,
    default: null
  },
  showCharCount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const textArea = ref(null)
const showEmojiPicker = ref(false)

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Common emojis for quick access
const commonEmojis = ref([
  '😀', '😂', '😍', '🤔', '😭', '😊', '👍', '👎',
  '❤️', '💯', '🔥', '😎', '🙄', '😢', '😴', '🤝',
  '👏', '🙏', '💪', '🎉', '😅', '😒', '😘', '🤗'
])

const handleInput = (event) => {
  const value = event.target.value
  if (props.maxLength && value.length > props.maxLength) {
    return
  }
  content.value = value
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const insertEmoji = (emoji) => {
  const textarea = textArea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = content.value

  content.value = text.substring(0, start) + emoji + text.substring(end)

  // Focus back to textarea and set cursor position
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + emoji.length, start + emoji.length)
  })

  showEmojiPicker.value = false
}

// Close emoji picker when clicking outside
const handleClickOutside = (event) => {
  if (showEmojiPicker.value && !event.target.closest('.emoji-picker')) {
    showEmojiPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
textarea {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>