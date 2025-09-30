<template>
  <NuxtLayout name="admin">
    <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Site Emojis</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage custom emojis available across the entire site
          </p>
        </div>
        <button
          @click="showCreateDialog = true"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Emoji
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Total Emojis</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
        <div class="text-2xl font-bold text-green-600">{{ stats.active }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Active</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
        <div class="text-2xl font-bold text-gray-400">{{ stats.inactive }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Inactive</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
        <div class="text-2xl font-bold text-blue-600">{{ stats.totalUsage }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Total Usage</div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search emojis by shortcode or description..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div class="flex gap-2">
          <div class="relative">
            <select
              v-model="statusFilter"
              class="px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style="-webkit-appearance: none; -moz-appearance: none; appearance: none;"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <div class="relative">
            <select
              v-model="categoryFilter"
              class="px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style="-webkit-appearance: none; -moz-appearance: none; appearance: none;"
            >
              <option value="all">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Emoji Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading emojis...</p>
      </div>

      <div v-else-if="filteredEmojis.length === 0" class="p-8 text-center">
        <p class="text-gray-500 dark:text-gray-400">No emojis found</p>
      </div>

      <div v-else class="p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="emoji in filteredEmojis"
            :key="emoji.id"
            class="border dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <!-- Emoji Display -->
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                <img
                  :src="emoji.imageUrl"
                  :alt="emoji.altText"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 dark:text-white truncate">
                  :{{ emoji.shortcode }}:
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ emoji.altText }}
                </p>
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Category:</span>
                <span class="text-gray-900 dark:text-white">{{ emoji.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Usage:</span>
                <span class="text-gray-900 dark:text-white">{{ emoji.usageCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Status:</span>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="emoji.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
                >
                  {{ emoji.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-4">
              <button
                @click="editEmoji(emoji)"
                class="flex-1 button gray text-sm"
              >
                Edit
              </button>
              <button
                @click="toggleEmojiStatus(emoji)"
                class="flex-1 button text-sm"
                :class="emoji.isActive ? 'white' : 'primary'"
              >
                {{ emoji.isActive ? 'Disable' : 'Enable' }}
              </button>
              <button
                @click="deleteEmoji(emoji)"
                class="button red text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Emoji Dialog -->
    <div
      v-if="showCreateDialog || showEditDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeDialogs"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md"
        @click.stop
      >
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ showCreateDialog ? 'Create New Emoji' : 'Edit Emoji' }}
          </h2>

          <form @submit.prevent="saveEmoji" class="space-y-4">
            <!-- Shortcode -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shortcode
              </label>
              <input
                v-model="emojiForm.shortcode"
                type="text"
                required
                placeholder="happy_face"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p class="text-xs text-gray-500 mt-1">Used as :shortcode: in text</p>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image File
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                @change="handleImageUpload"
                :required="showCreateDialog"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 5MB. Must be 8x8 to 512x512 pixels.</p>
            </div>

            <!-- Alt Text -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                v-model="emojiForm.altText"
                type="text"
                required
                placeholder="Happy face emoji"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>


            <!-- Actions -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeDialogs"
                class="flex-1 button white"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 button primary"
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : (showCreateDialog ? 'Create' : 'Update') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/StoreToast';
import { useImageStore } from '@/stores/StoreImages';
import { useGqlMultipart } from '@/composables/graphql_multipart';
import { useDirectGraphQLRequest } from '@/composables/useGraphQL';
import { onFileChange } from '@/composables/images';

definePageMeta({
  'hasAuthRequired': true,
  'title': 'Emojis',
  'permissionRequired': "emoji",
});

interface Emoji {
  id: number;
  shortcode: string;
  imageUrl: string;
  altText: string;
  category: string;
  isActive: boolean;
  usageCount: number;
  creationDate: string;
  updated?: string;
  emojiScope: string;
}

interface EmojiForm {
  shortcode: string;
  altText: string;
  category: string;
  imageFile?: File;
}

const toast = useToastStore();
const imageStore = useImageStore();

// Reactive state
const loading = ref(true);
const saving = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const categoryFilter = ref('all');
const emojis = ref<Emoji[]>([]);
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const editingEmoji = ref<Emoji | null>(null);

const emojiForm = ref<EmojiForm>({
  shortcode: '',
  altText: '',
  category: 'custom'
});

// Computed
const stats = computed(() => {
  if (!emojis.value || emojis.value.length === 0) {
    return { total: 0, active: 0, inactive: 0, totalUsage: 0 };
  }
  return {
    total: emojis.value.length,
    active: emojis.value.filter(e => e.isActive).length,
    inactive: emojis.value.filter(e => !e.isActive).length,
    totalUsage: emojis.value.reduce((sum, e) => sum + e.usageCount, 0)
  };
});

const categories = computed(() => {
  if (!emojis.value || emojis.value.length === 0) {
    return [];
  }
  const cats = new Set(emojis.value.map(e => e.category));
  return Array.from(cats).sort();
});

const filteredEmojis = computed(() => {
  if (!emojis.value || emojis.value.length === 0) {
    return [];
  }

  let filtered = emojis.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(emoji =>
      emoji.shortcode.toLowerCase().includes(query) ||
      emoji.altText.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(emoji =>
      statusFilter.value === 'active' ? emoji.isActive : !emoji.isActive
    );
  }

  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(emoji => emoji.category === categoryFilter.value);
  }

  return filtered.sort((a, b) => a.shortcode.localeCompare(b.shortcode));
});

// Methods
const loadEmojis = async () => {
  loading.value = true;

  try {
    const query = `
      query GetAllEmojisAdmin($boardId: Int) {
        getAllEmojisAdmin(boardId: $boardId) {
          id
          shortcode
          imageUrl
          altText
          category
          isActive
          usageCount
          creationDate
          updated
          emojiScope
        }
      }
    `;

    const { data, error } = await useDirectGraphQLRequest(query, { boardId: null });

    if (error.value) {
      throw new Error(error.value.message || 'Failed to load emojis');
    }

    if (data.value?.getAllEmojisAdmin) {
      emojis.value = data.value.getAllEmojisAdmin;
    }
  } catch (error) {
    console.error('Failed to load emojis:', error);
    // Ensure emojis stays as empty array on error
    emojis.value = [];
    toast.addNotification({
      header: 'Error',
      message: 'Failed to load emojis',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const editEmoji = (emoji: Emoji) => {
  editingEmoji.value = emoji;
  emojiForm.value = {
    shortcode: emoji.shortcode,
    altText: emoji.altText,
    category: emoji.category
  };
  showEditDialog.value = true;
};

const closeDialogs = () => {
  showCreateDialog.value = false;
  showEditDialog.value = false;
  editingEmoji.value = null;
  imageStore.purgeEmoji(); // Clean up cropped image
  emojiForm.value = {
    shortcode: '',
    altText: '',
    category: 'custom'
  };
};

const handleImageUpload = (event: Event) => {
  onFileChange(event as InputEvent, 'emoji');
};

const saveEmoji = async () => {
  saving.value = true;

  try {
    if (showCreateDialog.value) {
      // Check if we have a cropped image or raw file
      if (!imageStore.emoji && !emojiForm.value.imageFile) {
        toast.addNotification({
          header: 'Error',
          message: 'Please select an image file',
          type: 'error'
        });
        return;
      }

      // Create new emoji using proper GraphQL multipart
      const mutation = `
        mutation CreateEmoji($input: CreateEmojiInput!) {
          createEmoji(input: $input) {
            id
            shortcode
            imageUrl
            altText
            category
            isActive
            usageCount
            emojiScope
          }
        }
      `;

      const variables = {
        input: {
          shortcode: emojiForm.value.shortcode,
          imageFile: null, // Will be replaced with actual file
          altText: emojiForm.value.altText,
          category: emojiForm.value.category,
          emojiScope: 'SITE'
        }
      };

      // Convert base64 to File if we have a cropped image, otherwise use raw file
      let imageFile = emojiForm.value.imageFile!;
      if (imageStore.emoji) {
        try {
          // Better base64 to file conversion
          const base64Data = imageStore.emoji;
          // Handle data URL format (data:image/jpeg;base64,...)
          const base64Index = base64Data.indexOf(',');
          if (base64Index === -1) {
            throw new Error('Invalid base64 data format');
          }

          const mimeMatch = base64Data.substring(0, base64Index).match(/data:([^;]+)/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const base64String = base64Data.substring(base64Index + 1);

          // Convert base64 to binary
          const binaryString = atob(base64String);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: mimeType });
          imageFile = new File([blob], `emoji-${emojiForm.value.shortcode}.jpg`, { type: mimeType });
        } catch (error) {
          console.error('Error converting base64 to file:', error);
          toast.addNotification({
            header: 'Image processing error',
            message: 'Failed to process cropped image. Please try uploading the original file.',
            type: 'error'
          });
          return;
        }
      } else {
        console.log('Original image file size:', imageFile.size, 'bytes');
      }

      // Additional validation
      if (imageFile.size < 100) {
        toast.addNotification({
          header: 'File too small',
          message: `File size is ${imageFile.size} bytes, which is below the 100-byte minimum.`,
          type: 'error'
        });
        return;
      }

      // Debug file information
      console.log('Final file info:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
        lastModified: imageFile.lastModified
      });

      const files = {
        'input.imageFile': imageFile
      };

      const { data, error } = await useGqlMultipart({
        query: mutation,
        variables,
        files
      });

      if (error.value) {
        throw new Error(error.value.message || 'Failed to create emoji');
      }

      toast.addNotification({
        header: 'Success',
        message: 'Emoji created successfully',
        type: 'success'
      });
    } else {
      // Update existing emoji
      if (emojiForm.value.imageFile) {
        // With file upload - use GraphQL multipart
        const mutation = `
          mutation UpdateEmoji($emojiId: Int!, $input: UpdateEmojiInput!) {
            updateEmoji(emojiId: $emojiId, input: $input) {
              id
              shortcode
              imageUrl
              altText
              category
              isActive
              usageCount
              emojiScope
            }
          }
        `;

        const variables = {
          emojiId: editingEmoji.value!.id,
          input: {
            shortcode: emojiForm.value.shortcode,
            altText: emojiForm.value.altText,
            category: emojiForm.value.category,
            imageFile: null // Will be replaced with actual file
          }
        };

        const files = {
          'input.imageFile': emojiForm.value.imageFile
        };

        const { data, error } = await useGqlMultipart({
          query: mutation,
          variables,
          files
        });

        if (error.value) {
          throw new Error(error.value.message || 'Failed to update emoji');
        }
      } else {
        // Without file upload - use regular JSON
        const mutation = `
          mutation UpdateEmoji($emojiId: Int!, $input: UpdateEmojiInput!) {
            updateEmoji(emojiId: $emojiId, input: $input) {
              id
              shortcode
              imageUrl
              altText
              category
              isActive
              usageCount
              emojiScope
            }
          }
        `;

        const variables = {
          emojiId: editingEmoji.value!.id,
          input: {
            shortcode: emojiForm.value.shortcode,
            altText: emojiForm.value.altText,
            category: emojiForm.value.category
          }
        };

        const { data, error } = await useDirectGraphQLRequest(mutation, variables);
        if (error.value) {
          throw new Error(error.value.message || 'Failed to update site emoji');
        }
      }

      toast.addNotification({
        header: 'Success',
        message: 'Emoji updated successfully',
        type: 'success'
      });
    }

    closeDialogs();
    loadEmojis();
  } catch (error) {
    console.error('Failed to save emoji:', error);
    toast.addNotification({
      header: 'Error',
      message: 'Failed to save emoji',
      type: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const toggleEmojiStatus = async (emoji: Emoji) => {
  try {
    const mutation = `
      mutation UpdateEmoji($emojiId: Int!, $input: UpdateEmojiInput!) {
        updateEmoji(emojiId: $emojiId, input: $input) {
          id
          isActive
        }
      }
    `;

    const variables = {
      emojiId: emoji.id,
      input: {
        isActive: !emoji.isActive
      }
    };

    const { data, error } = await useDirectGraphQLRequest(mutation, variables);

    if (error.value) {
      throw new Error(error.value.message || 'Failed to update emoji status');
    }

    emoji.isActive = !emoji.isActive;

    toast.addNotification({
      header: 'Success',
      message: `Emoji ${emoji.isActive ? 'enabled' : 'disabled'}`,
      type: 'success'
    });
  } catch (error) {
    console.error('Failed to toggle emoji status:', error);
    toast.addNotification({
      header: 'Error',
      message: 'Failed to update emoji status',
      type: 'error'
    });
  }
};

const deleteEmoji = async (emoji: Emoji) => {
  if (!confirm(`Are you sure you want to delete the emoji ":${emoji.shortcode}:"?`)) {
    return;
  }

  try {
    const mutation = `
      mutation DeleteEmoji($emojiId: Int!) {
        deleteEmoji(emojiId: $emojiId)
      }
    `;

    const { data, error } = await useDirectGraphQLRequest(mutation, { emojiId: emoji.id });

    if (error.value) {
      throw new Error(error.value.message || 'Failed to delete emoji');
    }

    emojis.value = emojis.value.filter(e => e.id !== emoji.id);

    toast.addNotification({
      header: 'Success',
      message: 'Emoji deleted successfully',
      type: 'success'
    });
  } catch (error) {
    console.error('Failed to delete emoji:', error);
    toast.addNotification({
      header: 'Error',
      message: 'Failed to delete emoji',
      type: 'error'
    });
  }
};

// Load emojis on mount
onMounted(() => {
  loadEmojis();
});
</script>