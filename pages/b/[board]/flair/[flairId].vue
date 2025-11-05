<template>
    <main id="page-flair-feed" class="flex flex-col pt-12 sm:pt-10">
        <!-- Sub Navigation & Banner -->
        <section class="flex-col flex">
            <div class="container mx-auto max-w-8xl grid grid-cols-12 sm:mt-20 sm:px-4 md:px-6">
                <!-- Banner -->
                <CardsBoardBanner
                    v-if="board"
                    :board="board"
                    :section-links="links"
                    :key="board?.id"
                    class="col-span-full"
                />
            </div>
        </section>

        <!-- Main Content -->
        <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
            <div class="col-span-full flex gap-6">
                <div class="w-full">
                    <!-- Flair Filter Header -->
                    <div class="bg-white dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md mb-4 p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                </svg>
                                <div>
                                    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        Posts with flair: {{ flairName }}
                                    </h2>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        Viewing posts in {{ board?.name }} filtered by this flair
                                    </p>
                                </div>
                            </div>
                            <NuxtLink
                                :to="`/b/${board?.name}/feed`"
                                class="button gray text-sm"
                            >
                                Clear Filter
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Sorts & View Options -->
                    <div class="flex flex-wrap items-center gap-2 mb-4 p-2.5 sm:px-4 sm:py-3 bg-white dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md dark:border-gray-800 dark:shadow-none">
                        <MenusSort />
                        <div class="ml-auto flex space-x-2">
                            <button class="ml-auto" @click="preferCardView = true">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-primary' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                                    <rect x="4" y="14" width="16" height="6" rx="2"></rect>
                                </svg>
                            </button>
                            <button class="ml-auto" @click="preferCardView = false">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-gray-500' : 'text-primary'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                                    <line x1="4" y1="12" x2="20" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Posts -->
                    <ClientOnly>
                        <LazyListsPosts
                            v-if="hasPosts"
                            :isCompact="!preferCardView"
                            :isLoading="pending"
                            :hasError="error"
                        />
                        <!-- Empty State -->
                        <div
                            v-else
                            class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800"
                        >
                            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                            </svg>
                            <p>
                                <span class="font-medium">No posts with this flair yet</span>
                                <br />
                                Be the first to create one!
                            </p>
                        </div>
                    </ClientOnly>

                    <!-- Pagination -->
                    <LazyNavigationPaginate2 @paginate="loadMore" :is-loading="loading" />
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
import { mapToListingType } from "@/types/types";
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

const boardName = route.params.board;
const flairId = computed(() => Number(route.params.flairId));

// Fetch board data
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

// Set board data in store
boardStore.setBoard(boardData.value.board);
const board = computed(() => boardStore.board);

// Fetch flair information
const flairQuery = `
    query GetFlair($id: Int!) {
        flair(id: $id) {
            id
            name
            style
            emoji
            textColor
            backgroundColor
            borderColor
        }
    }
`;

const { data: flairData } = await useGraphQLQuery(flairQuery, {
    variables: { id: flairId.value }
});

const flairName = computed(() => flairData.value?.flair?.name || 'Unknown Flair');

definePageMeta({
    key: (route) => route.fullPath,
    title: "Filtered Posts",
});

const title = computed(() =>
    `${flairName.value} - ${board.value?.title ?? board.value?.name ?? 'Board'}`
);

useHead({
    title,
});

const preferCardView = useCookie("preferCardView") ?? false;

// Parse section links
const getSectionLinks = () => {
    const baseLinks = [];
    const sectionOrder = board.value?.sectionOrder?.split(',').filter(s => s.trim()) || ['feed', 'threads'];

    for (const section of sectionOrder) {
        if (section === 'feed' && board.value?.hasFeed) {
            baseLinks.push({ name: "Feed", href: `/b/${board.value?.name}/feed` });
        } else if (section === 'threads' && board.value?.hasThreads) {
            baseLinks.push({ name: "Threads", href: `/b/${board.value?.name}/threads` });
        } else if (section === 'wiki' && board.value?.hasWiki && board.value?.wikiEnabled) {
            baseLinks.push({ name: "Wiki", href: `/b/${board.value?.name}/wiki` });
        }
    }

    return baseLinks;
};

const links = computed(() => getSectionLinks());

// Posts with flair filter
const { hasPosts, error, queryParams, loadMore, loading } = await usePosts(
    mapToListingType("local"),
    {
        flairId: flairId.value
    }
);
</script>
