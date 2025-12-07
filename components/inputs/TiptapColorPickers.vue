<template>
  <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
    <!-- Text Color Picker -->
    <div class="relative text-color-picker-container">
      <button ref="textColorButton" type="button" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-600 text-xs font-bold relative transition-colors" :style="{ color: editor.getAttributes('textStyle').color || '#000000' }" @click="toggleTextColorPicker" title="Text color">
        A
        <span class="absolute bottom-1 left-1 right-1 h-0.5 rounded" :style="{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }"></span>
      </button>
    </div>
    <!-- Highlight Color Picker -->
    <div class="relative highlight-color-picker-container">
      <button ref="highlightColorButton" type="button" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-600 text-xs font-bold relative transition-colors" @click="toggleHighlightColorPicker" title="Highlight color">
        A
        <span class="absolute bottom-1 left-1 right-1 h-1 rounded" :style="{ backgroundColor: editor.isActive('highlight') ? (editor.getAttributes('highlight').color || '#ffff00') : '#ffff00', opacity: editor.isActive('highlight') ? '1' : '0.5' }"></span>
      </button>
    </div>
  </div>

  <!-- Text Color Picker Popover (Teleported to body) -->
  <Teleport to="body">
    <div v-if="showTextColorPicker" data-color-picker="text" class="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl p-4 z-[9999] w-72"
         :style="{ top: textColorPosition.top + 'px', left: textColorPosition.left + 'px' }"
         style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);">
      <!-- Header -->
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Text Color</div>

      <!-- Preset Colors -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Preset Colors</div>
        <div class="grid grid-cols-8 gap-1">
          <button v-for="color in textColors" :key="color" type="button"
                  class="w-7 h-7 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform relative"
                  :class="{ 'ring-2 ring-primary': customTextColor === color }"
                  :style="`background-color: ${color}`"
                  @click="setTextColor(color)">
            <span v-if="customTextColor === color" class="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
          </button>
        </div>
      </div>

      <!-- Custom Color Picker -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom Color</div>
        <div class="flex gap-2">
          <input type="color" v-model="customTextColor"
                 class="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
          <input type="text" v-model="customTextColor"
                 placeholder="#000000"
                 @keyup.enter="setTextColor(customTextColor)"
                 class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono">
        </div>
      </div>

      <!-- Apply Button -->
      <button type="button"
              @click="setTextColor(customTextColor)"
              class="w-full px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover transition-colors">
        Apply Color
      </button>
    </div>
  </Teleport>

  <!-- Highlight Color Picker Popover (Teleported to body) -->
  <Teleport to="body">
    <div v-if="showHighlightColorPicker" data-color-picker="highlight" class="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl p-4 z-[9999] w-72"
         :style="{ top: highlightColorPosition.top + 'px', left: highlightColorPosition.left + 'px' }"
         style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);">
      <!-- Header -->
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Highlight Color</div>

      <!-- Preset Colors -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Preset Colors</div>
        <div class="grid grid-cols-8 gap-1">
          <button v-for="color in highlightColors" :key="color" type="button"
                  class="w-7 h-7 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform relative"
                  :class="{ 'ring-2 ring-primary': customHighlightColor === color }"
                  :style="`background-color: ${color}`"
                  @click="setHighlightColor(color)">
            <span v-if="customHighlightColor === color" class="absolute inset-0 flex items-center justify-center text-gray-800 text-xs">✓</span>
          </button>
        </div>
      </div>

      <!-- Custom Color Picker -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom Color</div>
        <div class="flex gap-2">
          <input type="color" v-model="customHighlightColor"
                 class="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
          <input type="text" v-model="customHighlightColor"
                 placeholder="#FFFF00"
                 @keyup.enter="setHighlightColor(customHighlightColor)"
                 class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono">
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button type="button"
                @click="setHighlightColor(customHighlightColor)"
                class="flex-1 px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover transition-colors">
          Apply Color
        </button>
        <button type="button"
                @click="removeHighlight()"
                class="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Remove
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

// Color picker states
const showTextColorPicker = ref(false)
const showHighlightColorPicker = ref(false)
const customTextColor = ref('#000000')
const customHighlightColor = ref('#ffff00')

// Button references
const textColorButton = ref(null)
const highlightColorButton = ref(null)

// Position states
const textColorPosition = ref({ top: 0, left: 0 })
const highlightColorPosition = ref({ top: 0, left: 0 })

// Predefined color palettes
const textColors = ref([
  '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF',
  '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
  '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDFF2', '#CEE7F7', '#D6D3F7', '#F2CEF7',
  '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
  '#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5',
  '#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B',
  '#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842',
  '#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031'
])

const highlightColors = ref([
  '#FFFF00', '#FFE79C', '#FFD663', '#FFFF94', '#E7FF9C', '#D6FFD6',
  '#9CFFFF', '#9CE7FF', '#9CCDFF', '#C6CEFF', '#E7CEFF', '#FFCEFF',
  '#FF9CE7', '#FFB5D6', '#FFE7CE', '#FFEFC6', '#F7C6CE', '#E79C9C',
  '#FFB5B5', '#FFC6C6', '#FFD6D6', '#FFE7E7', '#F7F7F7', '#EFEFEF'
])

// Position calculation function
const calculatePosition = (button) => {
  if (!button) return { top: 0, left: 0 }

  const rect = button.getBoundingClientRect()
  const dropdownWidth = 288 // w-72 = 18rem = 288px
  const dropdownHeight = 280 // Approximate height with new layout

  // Calculate position below the button
  let top = rect.bottom + 4 // 4px gap (mt-1)
  let left = rect.right - dropdownWidth // Align right edge

  // Ensure dropdown doesn't go off-screen
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Adjust horizontal position if off-screen
  if (left < 8) {
    left = 8 // Minimum 8px from left edge
  } else if (left + dropdownWidth > viewportWidth - 8) {
    left = viewportWidth - dropdownWidth - 8 // Maximum 8px from right edge
  }

  // Adjust vertical position if off-screen
  if (top + dropdownHeight > viewportHeight - 8) {
    top = rect.top - dropdownHeight - 4 // Show above the button instead
  }

  return { top: Math.max(8, top), left }
}

// Toggle functions
const toggleTextColorPicker = () => {
  if (showTextColorPicker.value) {
    showTextColorPicker.value = false
  } else {
    showHighlightColorPicker.value = false // Close other picker
    textColorPosition.value = calculatePosition(textColorButton.value)
    showTextColorPicker.value = true
  }
}

const toggleHighlightColorPicker = () => {
  if (showHighlightColorPicker.value) {
    showHighlightColorPicker.value = false
  } else {
    showTextColorPicker.value = false // Close other picker
    highlightColorPosition.value = calculatePosition(highlightColorButton.value)
    showHighlightColorPicker.value = true
  }
}

// Color picker functions
const setTextColor = (color) => {
  props.editor.chain().focus().setColor(color).run()
  showTextColorPicker.value = false
}

const setHighlightColor = (color) => {
  props.editor.chain().focus().toggleHighlight({ color }).run()
  showHighlightColorPicker.value = false
}

const removeHighlight = () => {
  props.editor.chain().focus().unsetHighlight().run()
  showHighlightColorPicker.value = false
}

// Click outside to close
const handleClickOutside = (event) => {
  const textColorContainer = event.target.closest('.text-color-picker-container')
  const highlightColorContainer = event.target.closest('.highlight-color-picker-container')

  // Check if click is on any color picker dropdown
  const textColorDropdown = event.target.closest('div[data-color-picker="text"]')
  const highlightColorDropdown = event.target.closest('div[data-color-picker="highlight"]')

  if (!textColorContainer && !textColorDropdown) {
    showTextColorPicker.value = false
  }
  if (!highlightColorContainer && !highlightColorDropdown) {
    showHighlightColorPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>