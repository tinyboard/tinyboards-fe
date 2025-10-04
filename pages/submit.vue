<template>
    <main class="flex flex-col pt-12 sm:pt-14">
        <!-- Sub Navigation & Banner -->
        <section class="flex flex-col">
            <NavigationNavbarSub :links="links" class="sm:order-first" />
            <div
                class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
                <!-- Banner -->
                <CardsSubmitBanner
                    :board="selectedBoard"
                    :title="selectedBoard ? (isThread ? `Create new thread in ${selectedBoard.name}` : `Create new post in ${selectedBoard.name}`) : (isThread ? 'Create new thread' : 'Create new post')"
                    :sub-title="selectedBoard ? selectedBoard.description || (isThread ? 'Start a new discussion thread' : 'Share a link, image or text with the community.') : (isThread ? 'Start a new discussion thread' : 'Share a link, image or text with the community.')"
                    class="col-span-full"
                />
            </div>
        </section>
        <!-- Main Content -->
        <section class="container mx-auto max-w-4xl grid grid-cols-12 sm:px-4 sm:py-6 md:px-6">
            <div class="col-span-full flex flex-row gap-6">
                <!-- Form -->
                <form @submit.prevent="submit" class="block w-full">
                    <div class="bg-white overflow-visible shadow-inner-xs sm:border sm:rounded-md">
                        <div v-if="!isEditingBoard && site.enableBoards"
                            class="w-full p-4 bg-gray-50 border-b space-y-2 md:space-y-0 flex flex-col md:flex-row justify-center md:justify-between items-center">
                            <div class="flex flex-row space-x-2 items-center">
                                <img :src="selectedBoard?.icon || '/img/default-board-icon.png'" class="hidden md:block w-11 h-11 object-cover rounded"
                                    alt="board icon" />
                                <div class="w-full text-center md:text-left">
                                    <p class="font-bold text-gray-700">
                                        You are posting to {{ boardName }}
                                    </p>
                                    <p class="text-sm text-gray-500">
                                        {{ selectedBoard?.description || 'No description available' }}
                                    </p>
                                </div>
                            </div>
                            <button class="button white" @click="isEditingBoard = true">
                                Change board
                            </button>
                        </div>
                        <!-- Board info when boards are disabled -->
                        <div v-if="!site.enableBoards"
                            class="w-full p-4 bg-gray-50 border-b space-y-2 md:space-y-0 flex flex-col md:flex-row justify-center md:justify-between items-center">
                            <div class="flex flex-row space-x-2 items-center">
                                <img :src="defaultBoard?.icon || '/img/default-board-icon.png'" class="hidden md:block w-11 h-11 object-cover rounded"
                                    alt="board icon" />
                                <div class="w-full text-center md:text-left">
                                    <p class="font-bold text-gray-700">
                                        You are posting to {{ boardName }}
                                    </p>
                                    <p class="text-sm text-gray-500">
                                        {{ defaultBoard?.title || 'Default community board' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 bg-white">
                            <div class="grid grid-cols-6 gap-6">
                                <!-- Board -->
                                <div v-if="isEditingBoard && site.enableBoards" class="col-span-full">
                                    <label for="board-selector" class="block text-sm font-bold">Board</label>
                                    <InputsBoardSelector
                                        id="board-selector"
                                        :boards="allBoards"
                                        :model-value="selectedBoard"
                                        @board-selected="onBoardSelected"
                                        placeholder="Search for a board to post to..."
                                        class="mt-1"
                                    />
                                </div>
                                <!-- Title -->
                                <div class="col-span-full">
                                    <label for="title" class="block text-sm font-bold">Title</label>
                                    <input type="text" name="title" id="title" placeholder="Pick an interesting title"
                                        class="mt-1 form-input gray" v-model="title" required />
                                </div>
                                <!-- Link (feed posts only) -->
                                <div v-if="!isThread" class="relative col-span-full">
                                    <label for="link">
                                        <span class="flex justify-between text-sm font-bold">
                                            Link
                                        </span>
                                        <input type="url" name="link" id="link" placeholder="https://youtube.com"
                                            class="peer mt-1 form-input gray" v-model="url" :required="!body && !image"
                                            @focus="hasFocusedUrl = true" />
                                        <p class="absolute right-0 mt-1 peer-invalid:visible invisible text-red-600 text-sm"
                                            :class="!body && !image && hasFocusedUrl
                                                ? 'opacity-100'
                                                : 'opacity-0 pointer-events-none'
                                                ">
                                            Please provide a valid URL.
                                        </p>
                                    </label>
                                </div>
                                <!-- Body -->
                                <div class="relative col-span-full">
                                    <label for="body" class="flex justify-between text-sm font-bold">
                                        Body
                                        <em v-if="!isThread" class="text-gray-400 font-normal">
                                            optional if you have a link or image
                                        </em>
                                        <em v-else class="text-red-600 font-normal">
                                            required
                                        </em>
                                    </label>
                                    <!-- Rich text editor for threads -->
                                    <div v-if="isThread" class="mt-1">
                                        <InputsTiptap
                                            v-model="body"
                                            placeholder="Start your discussion..."
                                            :board-id="boardId"
                                            class="min-h-[300px]"
                                        />
                                    </div>
                                    <!-- Markdown textarea for feed posts -->
                                    <div v-else class="relative">
                                        <div id="post-body"
                                            class="relative mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base">
                                            <textarea
                                                ref="textareaRef"
                                                placeholder="Enter some words worth reading..."
                                                class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary pr-10"
                                                rows="6"
                                                v-model="body"
                                                :required="!url && !image"
                                                @focus="hasFocusedBody = true"
                                                @keydown="handleKeydown"
                                                @input="handleInput"
                                                @click="handleTextareaClick"
                                            />
                                        </div>
                                        <!-- Emoji Picker inside textarea -->
                                        <div class="absolute bottom-2 right-2">
                                            <InputsEmojiPicker :board-id="boardId" @emoji-selected="insertEmoji" />
                                        </div>
                                    </div>

                                    <!-- Emoji Suggestions (feed posts only) -->
                                    <InputsEmojiSuggestions
                                        v-if="!isThread"
                                        :suggestions="emojiSuggestions.suggestions.value"
                                        :is-visible="emojiSuggestions.isVisible.value"
                                        :position="emojiSuggestions.position.value"
                                        :selected-index="emojiSuggestions.selectedIndex.value"
                                        @select="selectEmojiSuggestion"
                                    />

                                    <p v-if="!isThread"
                                        class="absolute right-0 mt-1 flex justify-end items-center text-xs text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 w-4 h-4" width="24"
                                            height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                            fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                                            <path d="M7 15v-6l2 2l2 -2v6"></path>
                                            <path d="M14 13l2 2l2 -2m-2 2v-6"></path>
                                        </svg>
                                        Markdown supported
                                    </p>
                                </div>
                                <!-- Media Preview (feed posts only) -->
                                <div v-if="!isThread" class="col-span-full">
                                    <label for="title" class="block text-sm font-bold">Image or Video</label>
                                    <div class="mt-2 flex items-center">
                                        <!-- Image preview -->
                                        <img v-if="image && !isVideo" :src="image"
                                            class="inline-block w-56 object-contain p-0.5 border bg-white mr-5"
                                            @click="preview" />
                                        <!-- Video preview -->
                                        <video v-else-if="image && isVideo" :src="image" controls
                                            class="inline-block w-56 object-contain p-0.5 border bg-white mr-5">
                                            Your browser does not support the video tag.
                                        </video>
                                        <div>
                                            <label v-if="!image" for="media-upload"
                                                class="inline-block button button-small gray cursor-pointer">
                                                Pick image or video
                                            </label>
                                            <button v-else class="button gray" @click="clearMedia">
                                                <span class="text-red-500">Remove {{ isVideo ? 'video' : 'image' }}</span>
                                            </button>
                                            <input id="media-upload" type="file" class="hidden"
                                                accept="image/png, image/jpeg, image/gif, image/webp, video/mp4, video/webm, video/quicktime, video/3gpp, video/x-m4v, video/mpeg, video/ogg"
                                                @change="onFileChange($event)" />
                                            <small class="block mt-2 text-gray-400">
                                                Images (PNG, JPG, GIF, WebP) up to 10MB
                                                <br />
                                                Videos (MP4, WebM, MOV, 3GP, M4V, MPEG, OGV) up to 100MB
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <!-- Options -->
                                <div class="col-span-full">
                                    <!-- NSFW Checkbox -->
                                    <ul class="flex flex-col space-y-2">
                                        <li class="flex">
                                            <div class="flex h-5 items-center">
                                                <input id="is_nsfw" name="is_nsfw" type="checkbox" v-model="isNsfw"
                                                    class="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary" />
                                            </div>
                                            <div class="ml-3 text-sm">
                                                <label for="is_nsfw"
                                                    class="font-bold text-red-700 select-none">NFSW</label>
                                                <p class="text-gray-500">
                                                    This post is for 18+
                                                    audiences
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 shadow-inner-white border-t p-4">
                            <button type="submit" class="button primary" :class="{ loading: isLoading }"
                                :disabled="isLoading">
                                Create post
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </main>
</template>

<script lang="ts" setup>
import { useSiteStore } from "@/stores/StoreSite";
const site = useSiteStore();

definePageMeta({
    alias: ["", "/:board?/submit"],
    hasAuthRequired: true,
    isDropzoneDisabled: true,
    title: "Create Post",
    key: (route) => route.fullPath,
});

import { ref, computed, nextTick, watch } from "vue";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { dataURLtoFile } from "@/utils/files";
import { useBoardStore } from "@/stores/StoreBoard";
import { useGraphQLMutation } from '@/composables/useGraphQL';
import { useGqlMultipart } from "@/composables/graphql_multipart";
import { useEmojiSuggestions } from "@/composables/useEmojiSuggestions";
import CardsSubmitBanner from "@/components/cards/SubmitBanner.vue";
import InputsBoardSelector from "@/components/inputs/BoardSelector.vue";

const pageTitle = computed(() => selectedBoard.value?.name
    ? `Submit to ${selectedBoard.value.name}`
    : site.enableBoards
        ? "Submit"
        : `Submit to ${boardName.value}`
);

useHead({
    title: pageTitle,
});

const modal = useModalStore();
const toast = useToastStore();
const boardStore = useBoardStore();

const router = useRouter();
const route = useRoute();

const isEditingBoard = ref(!boardStore.hasBoard);

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
    }
  }
`);

const defaultBoard = computed(() => defaultBoardData.value?.listBoards?.[0]);
const allBoards = computed(() => allBoardsData.value?.listBoards || []);

// Check if we're creating a thread
const postType = route.query.type?.toString() || 'feed';
const isThread = computed(() => postType === 'thread');

// Fetch board data if we have a board from query parameter
const queryBoard = route.query.board?.toString() || null;
const { data: queryBoardData } = queryBoard ? await useGraphQLQuery(`
  query GetBoardByName($name: String!) {
    board(name: $name) {
      id
      name
      title
      description
      icon
      banner
      primaryColor
      secondaryColor
      hoverColor
    }
  }
`, { variables: { name: queryBoard } }) : { data: ref(null) };

// Reactive selected board for dropdown and banner updates
const selectedBoardForDropdown = ref(null);
const selectedBoard = computed(() =>
  selectedBoardForDropdown.value ||
  queryBoardData.value?.board ||
  (boardStore.hasBoard ? boardStore.board : defaultBoard.value)
);

// Using createPost mutation from GraphQL files

// Initialize selectedBoardForDropdown based on initial state
// Watch for when boards data becomes available
watch(allBoards, (boards) => {
  if (boards.length && !selectedBoardForDropdown.value) {
    if (queryBoard) {
      const initialBoard = boards.find(board => board.name === queryBoard);
      if (initialBoard) {
        selectedBoardForDropdown.value = initialBoard;
      }
    } else if (boardStore.hasBoard) {
      const storeBoard = boards.find(board => board.name === boardStore.board.name);
      if (storeBoard) {
        selectedBoardForDropdown.value = storeBoard;
      }
    }
  }
}, { immediate: true });

const boardName = computed(() => selectedBoard.value?.name || "general");

// Handle board selection from dropdown
const onBoardSelected = (board) => {
  selectedBoardForDropdown.value = board;
  // Update the URL without navigation to reflect the current board
  if (board && board.name !== route.query.board) {
    navigateTo({
      path: route.path,
      query: { ...route.query, board: board.name }
    }, { replace: true });
  }
};
const title = ref(route.query.title?.toString() || "");
const url = ref(route.query.url?.toString() || "");
const image: Ref<string | ArrayBuffer | null> = ref(null);
const body: Ref<string | null> = ref(null);
const isNsfw = ref(false);
const isVideo = ref(false);
const fileType = ref<string | null>(null);

let hasFocusedUrl = ref(false);
let hasFocusedBody = ref(false);

// Emoji functionality
const textareaRef = ref<HTMLTextAreaElement>();
const boardId = computed(() => boardStore.hasBoard ? boardStore.board.id : (defaultBoard.value?.id || null));
const emojiSuggestions = useEmojiSuggestions();

// Set image and then destroy in storage.
const setImage = () => {
    if (process.client && typeof sessionStorage !== 'undefined') {
        const storedImage = sessionStorage.getItem("image");
        if (storedImage) {
            image.value = storedImage;
            sessionStorage.removeItem("image");
        }
    }
};

if (process.client) {
    setImage();
}

// File input
const onFileChange = (e: InputEvent) => {
    const file = (e.target as HTMLInputElement).files![0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    fileType.value = file.type;

    // Check if it's a video
    const videoExtensions = /\.(mp4|webm|mov|3gp|m4v|mpeg|mpg|ogv|avi|mkv)$/i;
    const isVideoFile = videoExtensions.test(fileName) || file.type.startsWith('video/');

    // Check if it's an image
    const imageExtensions = /\.(jpe?g|png|gif|webp)$/i;
    const isImageFile = imageExtensions.test(fileName) || file.type.startsWith('image/');

    // Validate file type and size
    if (isVideoFile) {
        // Videos up to 100MB
        if (fileSize > 100 * 1024 * 1024) {
            toast.addNotification({
                header: "File too large",
                message: "Videos must be under 100MB.",
                type: "error",
            });
            return;
        }
        isVideo.value = true;
    } else if (isImageFile) {
        // Images up to 10MB
        if (fileSize > 10 * 1024 * 1024) {
            toast.addNotification({
                header: "File too large",
                message: "Images must be under 10MB.",
                type: "error",
            });
            return;
        }
        isVideo.value = false;
    } else {
        toast.addNotification({
            header: "Wrong format",
            message: "Please upload an image (PNG, JPG, GIF, WebP) or video (MP4, WebM, MOV, 3GP, M4V, MPEG, OGV).",
            type: "error",
        });
        return;
    }

    // Read file
    const reader = new FileReader();
    reader.onloadend = () => {
        image.value = reader.result;
        if (process.client && typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem("image");
        }
    };
    reader.readAsDataURL(file);
};

// Clear media
const clearMedia = () => {
    image.value = null;
    isVideo.value = false;
    fileType.value = null;
};

// Image preview
const preview = () => {
    if (!!image.value) {
        modal.setModal({
            modal: "ModalImage",
            id: 1,
            isOpen: true,
            options: {
                img: {
                    src: image.value,
                    alt: "No alt text available.",
                },
            },
        });
    } else {
        if (process.dev) console.error("No image to preview.");
    }
};

// Submit
const authCookie = useCookie("token").value;

const isLoading = ref(false);

async function submit() {
    isLoading.value = true;

    try {
        // Validate threads have body content
        // TipTap returns HTML, so check if it's empty or just contains empty tags
        const stripHtml = (html) => {
            if (!html) return '';
            return html.replace(/<[^>]*>/g, '').trim();
        };

        if (isThread.value && (!body.value || stripHtml(body.value) === '')) {
            toast.addNotification({
                header: 'Body required',
                message: 'Thread posts must have body content.',
                type: 'error'
            });
            isLoading.value = false;
            return;
        }

        // Ensure board is always set - use current board name or default
        const finalBoardName = boardName.value || defaultBoard.value?.name || "general";

        const linkValue = (url.value && typeof url.value === 'string' && url.value.trim() !== '') ? url.value.trim() : null;

        const variables = {
            title: title.value,
            board: finalBoardName && finalBoardName.trim() !== '' ? finalBoardName : null,
            body: body.value && body.value.trim() !== '' ? body.value : null,
            link: linkValue,
            isNSFW: isNsfw.value || false,
            altText: null,
            file: null,
            postType: isThread.value ? 'thread' : 'feed'
        };

        const createPostQuery = `
            mutation createPost(
                $title: String!
                $board: String
                $body: String
                $link: String
                $isNSFW: Boolean
                $altText: String
                $file: Upload
                $postType: String
            ) {
                createPost(
                    title: $title
                    board: $board
                    body: $body
                    link: $link
                    isNSFW: $isNSFW
                    altText: $altText
                    file: $file
                    postType: $postType
                ) {
                    id
                    title
                    titleChunk
                    postType
                }
            }
        `;

        let post;

        if (image.value) {
            // Use multipart upload for files
            const file = dataURLtoFile(image.value);
            const result = await useGqlMultipart({
                query: createPostQuery,
                variables: { ...variables, file: file },
                files: { file: file }
            });

            // Extract post from GraphQL response
            post = result.data?.createPost || result.createPost;
        } else {
            // Use regular GraphQL for non-file posts
            const { data, error } = await useGraphQLMutation(createPostQuery, {
                variables
            });

            if (error.value) {
                throw new Error(error.value.message || 'Failed to create post');
            }

            post = data.value?.createPost;
        }

        if (!post || !post.id) {
            throw new Error('Invalid response from server');
        }

        // Successfully created - redirect immediately
        const titleSlug = post.titleChunk || 'post';
        let redirectPath;

        if (post.postType === 'thread') {
            // Redirect to thread detail page
            redirectPath = site.enableBoards
                ? `/b/${finalBoardName}/threads/${post.id}`
                : `/threads/${post.id}`;
        } else {
            // Redirect to regular post page
            redirectPath = site.enableBoards
                ? `/b/${finalBoardName}/p/${post.id}/${titleSlug}`
                : `/p/${post.id}/${titleSlug}`;
        }

        await navigateTo(redirectPath);

    } catch (e: any) {
        if (process.dev) console.error("Error creating post:", e);
        toast.addNotification({
            header: "Failed to create post",
            message: e.message || "An error occurred while creating the post. Please try again.",
            type: "error",
            isVisibleOnRouteChange: true,
        });
    } finally {
        isLoading.value = false;
    }
}

// Emoji handler functions
const handleKeydown = (e: KeyboardEvent) => {
    // Handle emoji suggestions navigation
    if (emojiSuggestions.isVisible.value) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            emojiSuggestions.navigateDown();
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            emojiSuggestions.navigateUp();
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            const selectedEmoji = emojiSuggestions.selectSuggestion();
            if (selectedEmoji) {
                insertEmojiSuggestion(selectedEmoji);
            }
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            emojiSuggestions.hideSuggestions();
            return;
        }
    }
};

const handleInput = () => {
    if (textareaRef.value && body.value !== null) {
        const cursorPosition = textareaRef.value.selectionStart;
        emojiSuggestions.showSuggestions(body.value || '', cursorPosition, textareaRef.value);
    }
};

const handleTextareaClick = () => {
    if (textareaRef.value && body.value !== null) {
        const cursorPosition = textareaRef.value.selectionStart;
        emojiSuggestions.showSuggestions(body.value || '', cursorPosition, textareaRef.value);
    }
};

const insertEmoji = (emoji: string) => {
    if (textareaRef.value && body.value !== null) {
        const start = textareaRef.value.selectionStart;
        const end = textareaRef.value.selectionEnd;
        const text = body.value || '';
        body.value = text.substring(0, start) + emoji + text.substring(end);

        // Restore cursor position
        nextTick(() => {
            if (textareaRef.value) {
                textareaRef.value.focus();
                textareaRef.value.setSelectionRange(start + emoji.length, start + emoji.length);
            }
        });
    }
};

const insertEmojiSuggestion = (emoji: any) => {
    if (textareaRef.value && body.value !== null) {
        const result = emojiSuggestions.replaceEmojiInText(body.value || '', textareaRef.value.selectionStart, emoji);
        body.value = result.newText;

        // Restore cursor position
        nextTick(() => {
            if (textareaRef.value) {
                textareaRef.value.focus();
                textareaRef.value.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
            }
        });
    }
};

const selectEmojiSuggestion = (index: number) => {
    const selectedEmoji = emojiSuggestions.selectSuggestion(index);
    if (selectedEmoji) {
        insertEmojiSuggestion(selectedEmoji);
    }
};

const links = [
    //{ name: 'House Rules', href: '/help/rules', target: '_blank' },
    {
        name: "Formatting Guide",
        href: "https://www.markdownguide.org/cheat-sheet/",
        target: "_blank",
        isExternal: true,
    },
];
</script>

<style scoped>
#post-body {
    min-height: 8rem;
}
</style>
