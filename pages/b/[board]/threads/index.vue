<template>
    <main id="page-threads" class="flex flex-col pt-12 sm:pt-10">
        <!-- Sub Navigation & Banner -->
        <section
            class="flex-col"
            :class="route.params?.board ? 'flex' : 'hidden md:flex'"
        >
            <div
                class="container mx-auto max-w-8xl grid grid-cols-12 sm:mt-20 sm:px-4 md:px-6"
            >
                <!-- Banner -->
                <CardsBoardBanner
                    v-if="shouldShowBoardBanner"
                    :board="board"
                    :section-links="links"
                    :key="board?.id"
                    class="col-span-full"
                />
            </div>
        </section>
        <!-- Main Content -->
        <section
            class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6"
        >
            <div class="col-span-full flex gap-6">
                <div class="w-full">
                    <!-- Threads List -->
                    <div v-if="hasThreads">
                        <!-- Sorts & View Options -->
                        <div
                            class="flex items-center mb-4 p-2.5 sm:px-4 sm:py-3 bg-white dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md dark:border-gray-800 dark:shadow-none"
                        >
                            <div class="flex items-center gap-2 text-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-5 h-5 text-gray-600 dark:text-gray-400"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
                                    <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
                                    <line x1="3" y1="6" x2="3" y2="19"></line>
                                    <line x1="12" y1="6" x2="12" y2="19"></line>
                                    <line x1="21" y1="6" x2="21" y2="19"></line>
                                </svg>
                                <span class="font-semibold text-gray-700 dark:text-gray-300">
                                    Threads
                                </span>
                                <span class="text-gray-500 dark:text-gray-400">
                                    · Sorted by activity
                                </span>
                            </div>
                            <div class="ml-auto">
                                <NuxtLink
                                    :to="`/submit?board=${board?.name}&type=thread`"
                                    class="button primary text-sm"
                                >
                                    Create Thread
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- Thread Cards -->
                        <div class="space-y-3">
                            <div
                                v-for="thread in threads"
                                :key="thread.id"
                                class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md hover:shadow-md transition-shadow"
                            >
                                <NuxtLink
                                    :to="thread.urlPath || `/b/${board?.name}/threads/${thread.id}/${thread.slug || 'thread'}`"
                                    class="block p-4"
                                >
                                    <div class="flex items-start gap-3">
                                        <!-- Pin indicator -->
                                        <div v-if="thread.featuredBoard" class="text-yellow-500 flex-shrink-0">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-5 h-5"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6"></path>
                                                <line x1="12" y1="16" x2="12" y2="21"></line>
                                                <line x1="8" y1="4" x2="16" y2="4"></line>
                                            </svg>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <!-- Title -->
                                            <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                                                {{ thread.title }}
                                            </h3>
                                            <!-- Metadata -->
                                            <div class="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                <span>
                                                    By <strong>{{ thread.creator?.displayName || thread.creator?.name }}</strong>
                                                </span>
                                                <span>·</span>
                                                <span>{{ formatDate(thread.creationDate) }}</span>
                                                <span>·</span>
                                                <span>{{ thread.commentCount }} {{ thread.commentCount === 1 ? 'reply' : 'replies' }}</span>
                                                <span v-if="thread.participants && thread.participants.length > 0">·</span>
                                                <CardsParticipantAvatars v-if="thread.participants && thread.participants.length > 0" :participants="thread.participants" />
                                            </div>
                                            <!-- Preview -->
                                            <p v-if="thread.bodyHTML" class="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                                {{ stripHtml(thread.bodyHTML).substring(0, 200) }}{{ stripHtml(thread.bodyHTML).length > 200 ? '...' : '' }}
                                            </p>
                                        </div>
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <LazyNavigationPaginate2
                            @paginate="loadMore"
                            :is-loading="loading"
                        />
                    </div>

                    <!-- Empty State -->
                    <ClientOnly>
                        <div
                            v-if="!hasThreads && !loading"
                            class="w-full flex items-center justify-center p-12 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md"
                        >
                            <div class="text-center text-gray-500 dark:text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-16 h-16 mx-auto mb-4 opacity-50"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
                                    <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
                                    <line x1="3" y1="6" x2="3" y2="19"></line>
                                    <line x1="12" y1="6" x2="12" y2="19"></line>
                                    <line x1="21" y1="6" x2="21" y2="19"></line>
                                </svg>
                                <p>
                                    <span class="font-medium">
                                        No threads yet
                                    </span>
                                    <br />
                                    Be the first to start a discussion...
                                </p>
                                <NuxtLink
                                    :to="`/submit?board=${board?.name}&type=thread`"
                                    class="button primary mt-4 inline-block"
                                >
                                    Create Thread
                                </NuxtLink>
                            </div>
                        </div>
                    </ClientOnly>
                </div>
                <!-- Sidebar -->
                <component :is="SidebarBoard" />
            </div>
        </section>
    </main>
</template>

<script setup>
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useGraphQLQuery } from "@/composables/useGraphQL";
import CardsBoardBanner from "@/components/cards/BoardBanner.vue";

// Import sidebar component
const SidebarBoard = defineAsyncComponent(
    () => import("@/components/containers/SidebarBoard"),
);

const router = useRouter();
const route = useRoute();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const v = userStore.user;

// Fetch board data
const boardName = route.params.board;

const boardQuery = `
    query GetBoard($name: String!) {
        board(name: $name) {
            id
            name
            title
            description
            icon
            banner
            isNSFW
            subscribedType
            subscribers
            postCount
            commentCount
            myModPermissions
            primaryColor
            secondaryColor
            creationDate
            isRemoved
            sidebarHTML
            hasFeed
            hasThreads
            sectionOrder
            defaultSection
        }
    }
`;

try {
    const { data: boardData, error: boardError } = await useGraphQLQuery(boardQuery, {
        variables: { name: boardName }
    });

    if (boardError.value || !boardData.value?.board) {
        throw createError({
            statusCode: 404,
            statusMessage: `Board "${boardName}" not found`,
            fatal: true
        });
    }

    // Check if threads are enabled for this board
    if (!boardData.value.board.hasThreads) {
        throw createError({
            statusCode: 403,
            statusMessage: `Threads are not enabled for /b/${boardName}`,
            fatal: true
        });
    }

    // Set board data in store
    boardStore.setBoard(boardData.value.board);
} catch (error) {
    console.error('Error fetching board:', error);
    throw createError({
        statusCode: 404,
        statusMessage: `Board "${boardName}" not found`,
        fatal: true
    });
}

const board = computed(() => boardStore.board);

// Computed property for banner display
const shouldShowBoardBanner = computed(() => {
    return route.params?.board && boardStore.hasBoard && board.value && board.value.id;
});

definePageMeta({
    key: (route) => route.fullPath,
    title: "Board Threads",
});

const title = computed(() => `${board.value?.title ?? board.value?.name ?? 'Unknown Board'} - Threads`);

useHead({
    title,
});

// Threads data
const threads = ref([]);
const loading = ref(false);
const page = ref(1);
const limit = 25;

// Fetch threads
const threadsQuery = `
    query ListThreads($boardId: Int!, $limit: Int, $page: Int) {
        listThreads(boardId: $boardId, limit: $limit, page: $page) {
            id
            title
            slug
            urlPath
            body
            bodyHTML
            creationDate
            updated
            commentCount
            featuredBoard
            creator {
                id
                name
                displayName
                avatar
                flairs {
                    id
                    templateId
                    textDisplay
                    backgroundColor
                    textColor
                    template {
                        id
                        textDisplay
                        isEditable
                        backgroundColor
                        textColor
                        styleConfig
                        emojiIds
                        style {
                            backgroundColor
                            textColor
                            borderColor
                            borderWidth
                            borderRadius
                            fontWeight
                            fontSize
                            padding
                            margin
                            customCss
                        }
                    }
                }
            }
            participants {
                id
                name
                displayName
                avatar
            }
            flairs {
                id
                templateId
                textDisplay
                backgroundColor
                textColor
                template {
                    id
                    textDisplay
                    isEditable
                    backgroundColor
                    textColor
                    styleConfig
                    emojiIds
                    style {
                        backgroundColor
                        textColor
                        borderColor
                        borderWidth
                        borderRadius
                        borderStyle
                        fontWeight
                        fontSize
                        padding
                        margin
                        customCss
                        shadowColor
                        shadowOffsetX
                        shadowOffsetY
                        shadowBlur
                        animationType
                        animationDuration
                        gradientStart
                        gradientEnd
                        gradientDirection
                    }
                }
            }
        }
    }
`;

const fetchThreads = async (pageNum = 1) => {
    loading.value = true;
    try {
        const { data, error } = await useGraphQLQuery(threadsQuery, {
            variables: {
                boardId: board.value.id,
                limit,
                page: pageNum
            }
        });

        if (error.value) {
            console.error('Error fetching threads:', error.value);
            return;
        }

        if (pageNum === 1) {
            threads.value = data.value?.listThreads || [];
        } else {
            threads.value = [...threads.value, ...(data.value?.listThreads || [])];
        }

        page.value = pageNum;
    } finally {
        loading.value = false;
    }
};

// Load threads on mount
await fetchThreads();

const hasThreads = computed(() => threads.value.length > 0);

// Pagination
const loadMore = async () => {
    await fetchThreads(page.value + 1);
};

// Format date helper
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
};

// Import text utilities
const { stripHtml } = await import('@/composables/text');

// Parse section order
const getSectionLinks = () => {
    const baseLinks = [];
    const sectionOrder = board.value?.sectionOrder?.split(',').filter(s => s.trim()) || ['feed', 'threads'];

    // Build links in the configured order
    for (const section of sectionOrder) {
        if (section === 'threads' && board.value?.hasThreads) {
            baseLinks.push({ name: "Threads", href: `/b/${board.value?.name}/threads` });
        } else if (section === 'feed' && board.value?.hasFeed) {
            baseLinks.push({ name: "Feed", href: `/b/${board.value?.name}/feed` });
        }
    }

    return baseLinks;
};

// Links for sub navbar
const links = computed(() => getSectionLinks());
</script>
