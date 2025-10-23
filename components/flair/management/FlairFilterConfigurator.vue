<template>
  <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm">
    <!-- Header -->
    <div class="p-4 border-b dark:border-gray-800">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Flair Filters</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Control which flaired posts you see in your feed
      </p>
    </div>

    <!-- Filter Mode Toggle -->
    <div class="p-4 border-b dark:border-gray-800">
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Mode</label>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose whether to show only or hide selected flairs
          </p>
        </div>
        <div class="flex items-center gap-3 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
          <button
            @click="filterMode = 'exclude'"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            :class="filterMode === 'exclude' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
          >
            Exclude
          </button>
          <button
            @click="filterMode = 'include'"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            :class="filterMode === 'include' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
          >
            Include Only
          </button>
        </div>
      </div>

      <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <p class="text-sm text-blue-900 dark:text-blue-100">
          <span v-if="filterMode === 'exclude'">
            <strong>Exclude mode:</strong> Hide posts with selected flairs
          </span>
          <span v-else>
            <strong>Include mode:</strong> Show only posts with selected flairs
          </span>
        </p>
      </div>
    </div>

    <!-- Board Selection -->
    <div class="p-4 border-b dark:border-gray-800">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Apply filters to:
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedBoard = null"
          class="px-3 py-1.5 text-sm rounded-md border transition-colors"
          :class="selectedBoard === null
            ? 'bg-primary border-primary text-white'
            : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          All Boards
        </button>
        <button
          v-for="board in availableBoards"
          :key="board.id"
          @click="selectedBoard = board.id"
          class="px-3 py-1.5 text-sm rounded-md border transition-colors"
          :class="selectedBoard === board.id
            ? 'bg-primary border-primary text-white'
            : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          {{ board.name }}
        </button>
      </div>
    </div>

    <!-- Flair Selection -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Flairs to {{ filterMode === 'exclude' ? 'Hide' : 'Show' }}
        </label>
        <button
          v-if="selectedFlairs.length > 0"
          @click="clearSelection"
          class="text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search flairs..."
          class="form-input gray w-full"
        />
      </div>

      <!-- Flair List -->
      <div v-if="filteredFlairs.length === 0" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M12 9h.01" />
          <path d="M11 12h1v4h1" />
        </svg>
        <p class="mt-3 text-gray-600 dark:text-gray-400">No flairs found</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        <button
          v-for="flair in filteredFlairs"
          :key="flair.id"
          @click="toggleFlair(flair.id)"
          class="flex items-center gap-2 p-3 border rounded-md transition-all"
          :class="isFlairSelected(flair.id)
            ? 'bg-primary border-primary text-white shadow-md'
            : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          <div
            class="flex-shrink-0 w-3 h-3 rounded-full"
            :style="{ backgroundColor: flair.backgroundColor || '#9ca3af' }"
          />
          <div class="flex-1 min-w-0 text-left">
            <div
              class="text-sm font-medium truncate"
              :class="isFlairSelected(flair.id) ? 'text-white' : 'text-gray-900 dark:text-gray-100'"
            >
              {{ flair.displayText }}
            </div>
            <div
              v-if="flair.category"
              class="text-xs truncate"
              :class="isFlairSelected(flair.id) ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'"
            >
              {{ flair.category.name }}
            </div>
          </div>
          <svg
            v-if="isFlairSelected(flair.id)"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </button>
      </div>

      <!-- Selected Count -->
      <div v-if="selectedFlairs.length > 0" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {{ selectedFlairs.length }} flair{{ selectedFlairs.length !== 1 ? 's' : '' }} selected
      </div>
    </div>

    <!-- Preview Section -->
    <div v-if="selectedFlairs.length > 0" class="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
      <div class="p-3 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          <span v-if="filterMode === 'exclude'">
            Posts with these flairs will be <strong class="text-red-600 dark:text-red-400">hidden</strong> from your feed:
          </span>
          <span v-else>
            Only posts with these flairs will be <strong class="text-green-600 dark:text-green-400">shown</strong> in your feed:
          </span>
        </p>
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="flairId in selectedFlairs"
            :key="flairId"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :style="{
              backgroundColor: getFlairById(flairId)?.backgroundColor || '#e5e7eb',
              color: getFlairById(flairId)?.textColor || '#374151'
            }"
          >
            {{ getFlairById(flairId)?.displayText }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
      <button
        @click="$emit('reset')"
        class="button gray"
      >
        Reset to Default
      </button>
      <button
        @click="saveFilters"
        class="button primary"
        :disabled="isSaving"
      >
        {{ isSaving ? 'Saving...' : 'Save Filters' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  flairs: {
    type: Array,
    required: true
  },
  availableBoards: {
    type: Array,
    default: () => []
  },
  initialMode: {
    type: String,
    default: 'exclude',
    validator: (value) => ['exclude', 'include'].includes(value)
  },
  initialSelectedFlairs: {
    type: Array,
    default: () => []
  },
  initialBoard: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['save', 'reset']);

const filterMode = ref(props.initialMode);
const selectedBoard = ref(props.initialBoard);
const selectedFlairs = ref([...props.initialSelectedFlairs]);
const searchQuery = ref('');
const isSaving = ref(false);

const filteredFlairs = computed(() => {
  let result = props.flairs;

  // Filter by board if selected
  if (selectedBoard.value !== null) {
    result = result.filter(flair => flair.boardId === selectedBoard.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(flair =>
      flair.displayText.toLowerCase().includes(query) ||
      flair.name.toLowerCase().includes(query) ||
      flair.category?.name.toLowerCase().includes(query)
    );
  }

  return result;
});

const isFlairSelected = (flairId) => {
  return selectedFlairs.value.includes(flairId);
};

const toggleFlair = (flairId) => {
  const index = selectedFlairs.value.indexOf(flairId);
  if (index > -1) {
    selectedFlairs.value.splice(index, 1);
  } else {
    selectedFlairs.value.push(flairId);
  }
};

const clearSelection = () => {
  selectedFlairs.value = [];
};

const getFlairById = (flairId) => {
  return props.flairs.find(f => f.id === flairId);
};

const saveFilters = async () => {
  isSaving.value = true;
  try {
    await emit('save', {
      mode: filterMode.value,
      boardId: selectedBoard.value,
      flairIds: selectedFlairs.value
    });
  } finally {
    isSaving.value = false;
  }
};
</script>
