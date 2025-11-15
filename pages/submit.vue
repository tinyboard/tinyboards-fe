<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12 sm:pt-14">
    <!-- Integrated Header with Banner Background -->
    <div
      v-if="selectedBoard"
      class="relative bg-cover bg-center border-b border-gray-200 dark:border-gray-800"
      :style="selectedBoard.banner ? `background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${selectedBoard.banner}')` : `background: linear-gradient(135deg, rgb(${selectedBoard.primaryColor || '96, 165, 250'}) 0%, rgb(${selectedBoard.secondaryColor || '139, 92, 246'}) 100%)`"
    >
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="flex items-center gap-4 text-white">
          <div class="flex items-center gap-3">
            <img
              :src="selectedBoard.icon || '/img/default-board-icon.png'"
              class="w-16 h-16 rounded-lg object-cover border-2 border-white/20 shadow-lg"
              :alt="selectedBoard.name"
            />
            <div>
              <h1 class="text-3xl font-bold text-white drop-shadow-lg">
                {{ isThread ? `Create new thread in ${selectedBoard.name}` : `Create new post in ${selectedBoard.name}` }}
              </h1>
              <p class="text-white/90 drop-shadow-md mt-1">
                {{ selectedBoard.description || (isThread ? 'Start a new discussion thread' : 'Share a link, image or text with the community.') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback Header (when no board selected) -->
    <div v-else class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Create {{ isThread ? 'Thread' : 'Post' }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Share your thoughts with the community
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="max-w-4xl mx-auto px-4 py-4">
      <form @submit.prevent="submit" class="space-y-4">

        <!-- Board Selection -->
        <div v-if="site.enableBoards" class="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Choose Board
          </label>
          <InputsBoardSelector
            :boards="allBoards"
            :model-value="selectedBoard"
            @board-selected="onBoardSelected"
            placeholder="Search for a board to post to..."
          />

          <!-- Board validation message -->
          <div v-if="boardValidationMessage" class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-700 dark:text-red-300">
              {{ boardValidationMessage }}
            </p>
          </div>
        </div>

        <!-- Combined Post Details -->
        <div class="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <!-- Post Type Toggle -->
          <div v-if="!isThread" class="mb-4">
            <div class="flex items-center gap-4">
              <label class="text-sm font-semibold text-gray-900 dark:text-white">
                Post Type:
              </label>
              <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  type="button"
                  :class="postType === 'text' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  @click="postType = 'text'"
                >
                  Text
                </button>
                <button
                  type="button"
                  :class="postType === 'link' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  @click="postType = 'link'"
                >
                  Link
                </button>
                <button
                  type="button"
                  :class="postType === 'media' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  @click="postType = 'media'"
                >
                  Image/Video
                </button>
              </div>
            </div>
          </div>

          <!-- Title and Media Upload -->
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                v-model="title"
                placeholder="What's your post about?"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            <!-- Media Upload -->
            <div v-if="postType === 'media' && !isThread">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Image or Video (Optional)
              </label>

              <div v-if="image" class="mb-3">
                <div class="relative inline-block">
                  <img v-if="!isVideo" :src="image" class="max-w-xs rounded-lg border border-gray-200" />
                  <video v-else :src="image" controls class="max-w-xs rounded-lg border border-gray-200">
                    Your browser does not support video.
                  </video>
                  <button
                    type="button"
                    @click="clearMedia"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div
                v-else
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center transition-colors"
                :class="{ 'border-primary bg-primary/5': isDragOver }"
                @dragover.prevent="handleDragOver"
                @dragenter.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleDrop"
              >
                <label for="media-upload" class="cursor-pointer">
                  <div class="text-gray-400 mb-2">
                    <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {{ isDragOver ? 'Drop your file here' : 'Click to upload or drag and drop' }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Images (PNG, JPG, GIF, WebP) up to 10MB<br>
                    Videos (MP4, WebM, MOV) up to 100MB
                  </p>
                </label>
              </div>

              <input
                id="media-upload"
                type="file"
                class="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp, video/mp4, video/webm, video/quicktime, video/3gpp, video/x-m4v, video/mpeg, video/ogg"
                @change="handleMediaUpload"
              />
            </div>
          </div>

          <!-- Link Input (for link posts) -->
          <div v-if="postType === 'link' && !isThread" class="mt-4">
            <label for="link" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              URL *
            </label>
            <input
              type="url"
              id="link"
              v-model="url"
              placeholder="https://example.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              :required="postType === 'link'"
            />
          </div>

          <!-- Flair Selection -->
          <div v-if="hasFlairs && selectedBoard" class="mt-4">
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Post Flairs (Optional)
            </label>
            <FlairSelectorInline
              :board-id="selectedBoard.id"
              flair-type="post"
              :max-flairs="5"
              v-model="selectedFlairIds"
              @flairs-loaded="hasFlairs = $event"
            />
          </div>

          <!-- Post Options -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center">
              <input
                id="is_nsfw"
                type="checkbox"
                v-model="isNsfw"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label for="is_nsfw" class="ml-3">
                <span class="text-sm font-medium text-red-600 dark:text-red-400">NSFW</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">(18+ content)</span>
              </label>
            </div>
          </div>

        </div>


        <!-- Main Content Editor -->
        <div class="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <!-- Editor container -->
          <div class="editor-wrapper" style="height: 300px;">
            <LazyInputsTiptap
              v-model="body"
              :placeholder="isThread ? 'Start your discussion...' : 'Add some context to your post...'"
              :board-id="boardId"
              class="editor-instance"
            />
          </div>
        </div>


        <!-- Submit Actions -->
        <div class="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              By posting, you agree to our guidelines
            </div>

            <div class="flex items-center gap-3">
              <button type="button" class="button secondary" @click="$router.back()">
                Cancel
              </button>
              <button
                type="submit"
                class="button primary px-6"
                :disabled="!canSubmit"
              >
                {{ isThread ? 'Create Thread' : 'Create Post' }}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useBoardStore } from "@/stores/StoreBoard";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { useGraphQLMutation, useGraphQLQuery } from '@/composables/useGraphQL';
import { useGqlMultipart } from '@/composables/graphql_multipart';
import CardsSubmitBanner from "@/components/cards/SubmitBanner.vue";
import InputsBoardSelector from "@/components/inputs/BoardSelector.vue";
import FlairSelectorInline from "@/components/flair/selector/FlairSelectorInline.vue";

const site = useSiteStore();
const authStore = useLoggedInUser();
const boardStore = useBoardStore();
const modal = useModalStore();
const toast = useToastStore();
const router = useRouter();
const route = useRoute();

definePageMeta({
    hasAuthRequired: true,
    isDropzoneDisabled: true,
    title: "Create Post",
});

// Fetch all boards for the dropdown
const { data: allBoardsData } = await useGraphQLQuery(`
  query GetAllBoards {
    listBoards(limit: 100) {
      id
      name
      title
      description
      icon
      banner
      primaryColor
      secondaryColor
      hoverColor
      hasThreads
      hasFeed
    }
  }
`);

// Fetch default board for auto-selection
const { data: defaultBoardData } = await useGraphQLQuery(`
  query GetDefaultBoard {
    listBoards(limit: 1) {
      id
      name
      title
      icon
      banner
      primaryColor
      secondaryColor
      hoverColor
      hasThreads
      hasFeed
    }
  }
`);

const defaultBoard = computed(() => defaultBoardData.value?.listBoards?.[0]);
const allBoards = computed(() => allBoardsData.value?.listBoards || []);

// Check if we're creating a thread
const postTypeParam = route.query.type?.toString() || 'feed';
const isThread = computed(() => postTypeParam === 'thread');

// Board selection logic
const selectedBoard = computed(() => {
    // First, check for board parameter in URL
    const boardParam = route.query.board?.toString();
    if (boardParam && allBoards.value.length > 0) {
        const boardFromUrl = allBoards.value.find(b => b.name === boardParam);
        if (boardFromUrl) {
            return boardFromUrl;
        }
    }

    // Fallback to store if available
    if (boardStore.hasBoard) return boardStore.board;

    // Default to first board if boards are enabled and available
    if (site.enableBoards && allBoards.value.length > 0) return allBoards.value[0];

    // Final fallback to default board
    return defaultBoard.value;
});

const boardId = computed(() => selectedBoard.value?.id);
const boardName = computed(() => selectedBoard.value?.name || 'General');

// Form data
const title = ref('')
const body = ref('')
const url = ref('')
const image = ref('')
const isVideo = ref(false)
const uploadedFile = ref(null) // Store the actual file for upload
const isNsfw = ref(false)
const postType = ref('text') // 'text', 'link', 'media'
const isDragOver = ref(false)

// Flair selection
interface FlairSelection {
  templateId: number;
  customText?: string;
}
const selectedFlairIds = ref<FlairSelection[]>([]);
const hasFlairs = ref(true); // Start with true to show section initially, will be updated by component

// Computed properties
const canSubmit = computed(() => {
  if (!title.value.trim()) return false
  if (isThread.value && !body.value.trim()) return false
  if (postType.value === 'link' && !url.value.trim()) return false
  if (postType.value === 'media' && !image.value) return false

  // Validate board capabilities
  if (selectedBoard.value) {
    if (isThread.value && !selectedBoard.value.hasThreads) return false
    if (!isThread.value && !selectedBoard.value.hasFeed) return false
  }

  return true
})

// Show validation messages for board capabilities
const boardValidationMessage = computed(() => {
  if (!selectedBoard.value) return null

  if (isThread.value && !selectedBoard.value.hasThreads) {
    return `Thread posts are not enabled for /b/${selectedBoard.value.name}. Please select a different board.`
  }

  if (!isThread.value && !selectedBoard.value.hasFeed) {
    return `Feed posts are not enabled for /b/${selectedBoard.value.name}. Please select a different board.`
  }

  return null
})

// Methods
const handleMediaUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Validate file type and size
    const isImage = file.type.startsWith('image/')
    const isVideoFile = file.type.startsWith('video/')

    if (!isImage && !isVideoFile) {
      toast.addNotification({
        header: "Error",
        message: "Please select a valid image or video file.",
        type: "error"
      });
      return;
    }

    // Check file size limits
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxVideoSize = 100 * 1024 * 1024; // 100MB

    if (isImage && file.size > maxImageSize) {
      toast.addNotification({
        header: "Error",
        message: "Image file size must be less than 10MB.",
        type: "error"
      });
      return;
    }

    if (isVideoFile && file.size > maxVideoSize) {
      toast.addNotification({
        header: "Error",
        message: "Video file size must be less than 100MB.",
        type: "error"
      });
      return;
    }

    // Create object URL for preview
    const objectURL = URL.createObjectURL(file);
    image.value = objectURL;
    isVideo.value = isVideoFile;
    uploadedFile.value = file; // Store the actual file for later upload
  }
}

const clearMedia = () => {
  // Clean up object URL to prevent memory leaks
  if (image.value && image.value.startsWith('blob:')) {
    URL.revokeObjectURL(image.value);
  }
  image.value = ''
  isVideo.value = false
  uploadedFile.value = null

  // Clear the file input
  const fileInput = document.getElementById('media-upload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    // Create a mock event to reuse the handleMediaUpload logic
    const mockEvent = {
      target: {
        files: files
      }
    } as Event;
    handleMediaUpload(mockEvent);
  }
}

const onBoardSelected = (board: any) => {
  boardStore.setBoard(board);
}

// Upload file to backend
const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // TODO: Replace with actual backend upload endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url; // Assuming backend returns { url: "uploaded-file-url" }
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

const submit = async () => {
  if (!canSubmit.value) return

  try {
    let finalUrl = url.value;

    // For media posts, we'll send the file directly to the GraphQL mutation
    // The backend handles the file upload internally

    console.log('Submitting post:', {
      title: title.value,
      body: body.value,
      url: finalUrl,
      postType: isThread.value ? 'thread' : 'feed',
      contentType: postType.value, // This is the frontend content type (text/link/media)
      isNsfw: isNsfw.value,
      boardId: boardId.value,
      flairSelections: selectedFlairIds.value.length > 0 ? selectedFlairIds.value : null
    });

    // Create post using GraphQL multipart for file upload
    const mutationQuery = `
      mutation CreatePost(
        $title: String!
        $board: String
        $body: String
        $link: String
        $isNSFW: Boolean
        $postType: String
        $file: Upload
        $flairSelections: [PostFlairInput!]
      ) {
        createPost(
          title: $title
          board: $board
          body: $body
          link: $link
          isNSFW: $isNSFW
          postType: $postType
          file: $file
          flairSelections: $flairSelections
        ) {
          id
          title
          url
          creationDate
        }
      }
    `;

    const variables = {
      title: title.value,
      board: selectedBoard.value?.name || null,
      body: body.value || null,
      link: finalUrl || null,
      isNSFW: isNsfw.value,
      postType: isThread.value ? 'thread' : 'feed',
      flairSelections: selectedFlairIds.value.length > 0 ? selectedFlairIds.value : null
    };

    const files = uploadedFile.value ? { file: uploadedFile.value } : {};

    // Add file to variables for GraphQL multipart spec
    if (uploadedFile.value) {
      variables.file = uploadedFile.value;
    }

    const result = await useGqlMultipart({
      query: mutationQuery,
      variables,
      files
    });

    if (!result.data?.createPost) {
      throw new Error('Failed to create post');
    }

    const data = { value: result.data };
    const error = { value: null };

    if (error.value) {
      throw new Error(error.value.message || 'Failed to create post');
    }

    toast.addNotification({
      header: "Success",
      message: "Post created successfully!",
      type: "success"
    });

    // Navigate back to the board or home
    if (selectedBoard.value) {
      router.push(`/b/${selectedBoard.value.name}`);
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    toast.addNotification({
      header: "Error",
      message: "Failed to create post. Please try again.",
      type: "error"
    });
  }
}

// Watch postType changes to reset fields
watch(postType, (newType) => {
  if (newType !== 'link') url.value = ''
  if (newType !== 'media') {
    clearMedia()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (image.value && image.value.startsWith('blob:')) {
    URL.revokeObjectURL(image.value);
  }
})
</script>

<style scoped>
/* Custom styles for the new design */
.button {
  @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.button.primary {
  @apply bg-primary text-white hover:bg-primary-hover focus:ring-primary;
}

.button.secondary {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600;
}

.button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* TipTap editor container sizing */
.editor-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-instance {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>