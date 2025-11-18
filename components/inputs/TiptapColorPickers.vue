<template>
  <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
    <!-- Text Color Picker -->
    <div class="relative text-color-picker-container">
      <button type="button" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-600 text-xs font-bold relative transition-colors" :style="{ color: editor.getAttributes('textStyle').color || '#000000' }" @click="showTextColorPicker = !showTextColorPicker" title="Text color">
        A
        <span class="absolute bottom-1 left-1 right-1 h-0.5 rounded" :style="{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }"></span>
      </button>
      <!-- Color Picker Popover -->
      <div v-if="showTextColorPicker" class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 z-[200] w-64">
        <div class="grid grid-cols-8 gap-1 mb-2">
          <button v-for="color in textColors" :key="color" type="button" class="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform" :style="`background-color: ${color}`" @click="setTextColor(color)"></button>
        </div>
        <input type="color" v-model="customTextColor" @change="setTextColor(customTextColor)" class="w-full h-8 border border-gray-300 dark:border-gray-600 rounded">
      </div>
    </div>
    <!-- Highlight Color Picker -->
    <div class="relative highlight-color-picker-container">
      <button type="button" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-600 text-xs font-bold relative transition-colors" @click="showHighlightColorPicker = !showHighlightColorPicker" title="Highlight color">
        A
        <span class="absolute bottom-1 left-1 right-1 h-1 rounded" :style="{ backgroundColor: editor.isActive('highlight') ? (editor.getAttributes('highlight').color || '#ffff00') : '#ffff00', opacity: editor.isActive('highlight') ? '1' : '0.5' }"></span>
      </button>
      <!-- Highlight Color Picker Popover -->
      <div v-if="showHighlightColorPicker" class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 z-[200] w-64">
        <div class="grid grid-cols-8 gap-1 mb-2">
          <button v-for="color in highlightColors" :key="color" type="button" class="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform" :style="`background-color: ${color}`" @click="setHighlightColor(color)"></button>
        </div>
        <input type="color" v-model="customHighlightColor" @change="setHighlightColor(customHighlightColor)" class="w-full h-8 border border-gray-300 dark:border-gray-600 rounded">
        <button type="button" @click="removeHighlight()" class="mt-2 w-full px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Remove Highlight</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
</script>