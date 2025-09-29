<template>
  <div class="relative emoji-picker">
    <!-- Emoji Picker Button -->
    <button
      type="button"
      class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded flex items-center justify-center"
      @click="togglePicker"
      :class="{ 'text-primary bg-primary/10': isOpen }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="12" cy="12" r="9"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
        <path d="M8 13a4 4 0 1 0 8 0m0 0H8"/>
      </svg>
    </button>

    <!-- Emoji Picker Dropdown -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg w-80 h-96 z-50 flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="p-3 border-b dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">Emoji Picker</h3>
          <button
            @click="closePicker"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Search -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search emojis..."
          class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Categories -->
      <div class="border-b dark:border-gray-700 p-2">
        <div class="grid grid-cols-5 gap-1">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="selectedCategory === category.id
              ? 'bg-primary text-white'
              : 'text-gray-600 dark:text-gray-300'"
            :title="category.label || category.name"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Emoji Grid -->
      <div class="flex-1 overflow-y-auto p-2 min-h-0">
        <div v-if="loading" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>

        <div v-else class="grid grid-cols-8 gap-1 max-w-full">
          <!-- Standard Emojis -->
          <template v-if="selectedCategory !== 'custom'">
            <button
              v-for="emoji in filteredStandardEmojis"
              :key="emoji.id"
              @click="selectEmoji(emoji.native)"
              class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg flex-shrink-0"
              :title="emoji.name"
            >
              <span class="block leading-none">{{ emoji.native }}</span>
            </button>
          </template>

          <!-- Custom Emojis -->
          <template v-else>
            <button
              v-for="customEmoji in filteredCustomEmojis"
              :key="customEmoji.id"
              @click="selectEmoji(`:${customEmoji.shortcode}:`)"
              class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded overflow-hidden flex-shrink-0"
              :title="customEmoji.altText"
            >
              <img
                :src="customEmoji.imageUrl"
                :alt="customEmoji.altText"
                class="w-full h-full object-cover"
              />
            </button>
          </template>
        </div>

        <!-- No results -->
        <div v-if="!loading && filteredEmojis.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
          <p class="text-sm">No emojis found</p>
        </div>
      </div>

      <!-- Recent Emojis -->
      <div v-if="recentEmojis.length > 0" class="p-2 border-t dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Recently Used</p>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="recentEmoji in recentEmojis.slice(0, 10)"
            :key="recentEmoji"
            @click="selectEmoji(recentEmoji)"
            class="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
          >
            <span v-if="!recentEmoji.startsWith(':')">{{ recentEmoji }}</span>
            <img v-else :src="getCustomEmojiUrl(recentEmoji)" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  boardId?: number;
}

import { standardEmojis, emojiCategories, type StandardEmoji } from '@/assets/data/emojis';

interface CustomEmoji {
  id: number;
  shortcode: string;
  imageUrl: string;
  altText: string;
  category: string;
  emojiScope: string;
  isActive: boolean;
  usageCount: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  emojiSelected: [emoji: string];
}>();

// Reactive state
const isOpen = ref(false);
const loading = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('people');
const customEmojis = ref<CustomEmoji[]>([]);
const recentEmojis = ref<string[]>([]);

// Categories - add custom category to imported categories
const categories = [
  ...emojiCategories,
  { id: 'custom', name: '⭐', label: 'Custom Emojis' },
];

// Computed properties
const filteredStandardEmojis = computed(() => {
  let emojis = standardEmojis;

  // Filter by category if not custom
  if (selectedCategory.value !== 'custom') {
    emojis = standardEmojis.filter(emoji => emoji.category === selectedCategory.value);
  }

  // Filter by search query if provided
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    emojis = emojis.filter(emoji =>
      emoji.name.includes(query) ||
      emoji.keywords.some(keyword => keyword.includes(query))
    );
  }

  return emojis;
});

const filteredCustomEmojis = computed(() => {
  if (!searchQuery.value) return customEmojis.value.filter(e => e.isActive);

  const query = searchQuery.value.toLowerCase();
  return customEmojis.value.filter(emoji =>
    emoji.isActive && (
      emoji.shortcode.includes(query) ||
      emoji.altText.toLowerCase().includes(query)
    )
  );
});

const filteredEmojis = computed(() => {
  return selectedCategory.value === 'custom' ? filteredCustomEmojis.value : filteredStandardEmojis.value;
});

// Methods
const togglePicker = () => {
  isOpen.value = !isOpen.value;
  // Custom emojis are now pre-loaded on mount, no need to load here
};

const closePicker = () => {
  isOpen.value = false;
};

const selectEmoji = (emoji: string) => {
  emit('emojiSelected', emoji);
  addToRecent(emoji);
  // Don't auto-close picker - let users select multiple emojis
};

const addToRecent = (emoji: string) => {
  const recent = [...recentEmojis.value.filter(e => e !== emoji), emoji];
  recentEmojis.value = recent.slice(-20); // Keep last 20

  // Persist to localStorage
  try {
    localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis.value));
  } catch (error) {
    console.warn('Failed to save recent emojis:', error);
  }
};

const getCustomEmojiUrl = (emojiCode: string) => {
  if (!emojiCode.startsWith(':')) return '';

  const shortcode = emojiCode.slice(1, -1);
  const emoji = customEmojis.value.find(e => e.shortcode === shortcode);
  return emoji?.imageUrl || '';
};

const loadCustomEmojis = async () => {
  loading.value = true;

  try {
    const query = `
      query ListEmojis($input: ListEmojisInput) {
        listEmojis(input: $input) {
          id
          shortcode
          imageUrl
          altText
          category
          emojiScope
          isActive
          usageCount
        }
      }
    `;

    const variables = {
      input: {
        boardId: props.boardId,
        scope: props.boardId ? "Board" : "Site",
        activeOnly: true,
        limit: 100,
        offset: 0
      }
    };

    const response = await $fetch('#gql', {
      method: 'POST',
      body: { query, variables }
    });

    if (response?.data?.listEmojis) {
      customEmojis.value = response.data.listEmojis;

      // Update categories if we have custom emojis
      if (customEmojis.value.length > 0 && !categories.find(c => c.id === 'custom')) {
        categories.push({ id: 'custom', name: '⭐' });
      }
    }
  } catch (error) {
    console.error('Failed to load custom emojis:', error);
  } finally {
    loading.value = false;
  }
};

// Load recent emojis from localStorage and pre-load custom emojis
onMounted(async () => {
  try {
    const saved = localStorage.getItem('recent-emojis');
    if (saved) {
      recentEmojis.value = JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load recent emojis:', error);
  }

  // Pre-load custom emojis to populate the custom category
  await loadCustomEmojis();
});

// Close picker when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.emoji-picker') && isOpen.value) {
    closePicker();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>