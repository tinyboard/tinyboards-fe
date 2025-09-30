<template>
  <Combobox v-model="selectedBoard" @update:modelValue="onBoardSelected">
    <div class="relative">
      <ComboboxButton class="relative w-full cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-gray-100 text-left shadow-inner-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 sm:text-sm hover:bg-gray-50 transition-colors">
        <ComboboxInput
          class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
          :displayValue="(board) => board?.name || ''"
          @change="query = $event.target.value"
          :placeholder="placeholder"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </div>
      </ComboboxButton>
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ComboboxOptions
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
        >
          <div v-if="filteredBoards.length === 0 && query !== ''" class="relative cursor-default select-none py-2 px-4 text-gray-700">
            No boards found.
          </div>
          <ComboboxOption
            v-for="board in filteredBoards"
            as="template"
            :key="board.id"
            :value="board"
            v-slot="{ selected, active }"
          >
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-primary text-white': active,
                'text-gray-900': !active,
              }"
            >
              <div class="flex items-center">
                <img
                  v-if="board.icon"
                  :src="board.icon"
                  :alt="board.name"
                  class="h-6 w-6 rounded-sm mr-3 object-cover"
                />
                <div
                  v-else
                  class="h-6 w-6 rounded-sm mr-3 bg-gray-300 flex items-center justify-center"
                >
                  <span class="text-xs font-bold text-gray-600">{{ board.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <span
                    class="block truncate"
                    :class="{ 'font-medium': selected, 'font-normal': !selected }"
                  >
                    {{ board.name }}
                  </span>
                  <span v-if="board.title" class="text-xs opacity-75">{{ board.title }}</span>
                </div>
              </div>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-primary': !active }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'
import { useGraphQLQuery } from '@/composables/useGraphQL'

const props = defineProps({
  modelValue: {
    type: [Object, String],
    default: null
  },
  boards: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Search for a board...'
  }
})

const emit = defineEmits(['update:modelValue', 'board-selected'])

const query = ref('')
const selectedBoard = ref(props.modelValue)

// Filter boards based on search query
const filteredBoards = computed(() => {
  if (!props.boards?.length) return []

  return query.value === ''
    ? props.boards
    : props.boards.filter((board) =>
        board.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
})

// Handle board selection
const onBoardSelected = (board) => {
  selectedBoard.value = board
  emit('update:modelValue', board)
  emit('board-selected', board)
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  selectedBoard.value = newValue
})

// Watch for changes to boards array and update selectedBoard if needed
watch(() => props.boards, (newBoards) => {
  if (newBoards?.length && typeof selectedBoard.value === 'string') {
    // If selectedBoard is a string (board name), find the actual board object
    const foundBoard = newBoards.find(board => board.name === selectedBoard.value)
    if (foundBoard) {
      selectedBoard.value = foundBoard
      emit('update:modelValue', foundBoard)
    }
  }
}, { immediate: true })
</script>