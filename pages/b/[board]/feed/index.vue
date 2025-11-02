<template>
    <main id="page-feed" class="flex flex-col pt-12 sm:pt-10">
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
                <LazyCardsBanner
                    v-if="!route.params?.board"
                    title="Feed"
                    sub-title="Welcome to the awesome and exciting front page."
                    image-url="/img/artwork/front-page.jpeg"
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
                    <!-- Submission Form -->
                    <!-- Welcome Message -->
                    <div
                        v-if="welcome"
                        class="bg-white flex justify-center p-8 border rounded-md border-gray-300"
                    >
                        <div class="text-center flex flex-col items-center">
                            <img
                                :src="board?.icon || '/img/default-board-icon.png'"
                                class="bg-white p-[2px] border border-gray-300 w-32 h-32"
                            />
                            <h1 class="text-3xl text-gray-700 font-bold mt-4">
                                Welcome to {{ board?.name || 'Unknown Board' }}
                            </h1>
                            <p class="text-md text-gray-500">
                                Right now it's empty here. Let's get started by
                                making the first post!
                            </p>
                            <!-- Create Post -->
                            <NuxtLink
                                v-if="!submitPage && board?.name"
                                :to="`/submit?board=${board.name}`"
                                class="flex items-center button primary mt-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-4 h-4 mr-2"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    ></path>
                                    <path
                                        d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"
                                    ></path>
                                    <line
                                        x1="13.5"
                                        y1="6.5"
                                        x2="17.5"
                                        y2="10.5"
                                    ></line>
                                </svg>
                                Create post
                            </NuxtLink>
                            <!-- Dismiss welcome -->
                            <button
                                class="border-none text-center text-sm text-gray-500 font-semibold mt-4 hover:underline"
                                @click="welcome = false"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        <!-- Sorts & View Options -->
                        <div
                            class="flex flex-wrap items-center gap-2 mb-4 p-2.5 sm:px-4 sm:py-3 bg-white dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md dark:border-gray-800 dark:shadow-none"
                        >
                            <MenusSort />
                            <div class="ml-auto flex space-x-2">
                                <button
                                    class="ml-auto"
                                    @click="preferCardView = true"
                                >
                                    <!-- Rows Icon -->
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-5 h-5"
                                        :class="
                                            preferCardView
                                                ? 'text-primary'
                                                : 'text-gray-500'
                                        "
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        ></path>
                                        <rect
                                            x="4"
                                            y="4"
                                            width="16"
                                            height="6"
                                            rx="2"
                                        ></rect>
                                        <rect
                                            x="4"
                                            y="14"
                                            width="16"
                                            height="6"
                                            rx="2"
                                        ></rect>
                                    </svg>
                                </button>
                                <button
                                    class="ml-auto"
                                    @click="preferCardView = false"
                                >
                                    <!-- Cards Icon -->
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-5 h-5"
                                        :class="
                                            preferCardView
                                                ? 'text-gray-500'
                                                : 'text-primary'
                                        "
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        ></path>
                                        <rect
                                            x="4"
                                            y="4"
                                            width="16"
                                            height="16"
                                            rx="2"
                                        ></rect>
                                        <line
                                            x1="4"
                                            y1="12"
                                            x2="20"
                                            y2="12"
                                        ></line>
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
                                <p>
                                    <span class="font-medium">
                                        There are no posts
                                    </span>
                                    <br />
                                    but you can be the first...
                                </p>
                            </div>
                        </ClientOnly>
                        <!-- Pagination -->
                        <LazyNavigationPaginate2
                            @paginate="loadMore"
                            :is-loading="loading"
                        />
                        <!--<div
                            v-if="totalPages > 1"
                            class="w-full mt-4 px-2.5 sm:px-0"
                        >
                            <LazyNavigationPaginate
                                :total-pages="totalPages"
                                :per-page="limit"
                                :current-page="page"
                            />
                        </div>-->
                    </div>
                </div>
                <!-- Sidebar -->
                <component :is="route.params?.board ? SidebarBoard : Sidebar" />
            </div>
        </section>
    </main>
</template>
<script setup>
//import { usePostsStore } from "@/stores/StorePosts";
// import { getListing } from "@/composables/listing"; // Removed - using GraphQL instead
// import { getBoard } from "@/composables/board";
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { mapToListingType } from "@/types/types";
import { useGraphQLQuery } from "@/composables/useGraphQL";
import CardsBoardBanner from "@/components/cards/BoardBanner.vue";

// Import sidebar components
const Sidebar = defineAsyncComponent(
    () => import("@/components/containers/Sidebar"),
);
const SidebarBoard = defineAsyncComponent(
    () => import("@/components/containers/SidebarBoard"),
);

const router = useRouter();
const route = useRoute();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
//const postStore = usePostsStore();
const v = userStore.user;

// Fetch board data if we have a board parameter
if (route.params?.board) {
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

        // Set board data in store
        boardStore.setBoard(boardData.value.board);

        // Redirect to default section if configured
        // Only redirect if feed is NOT enabled, or if user hasn't explicitly navigated to feed
        const defaultSection = boardData.value.board.defaultSection;
        const hasFeed = boardData.value.board.hasFeed;

        if (defaultSection && defaultSection !== 'feed' && !hasFeed) {
            // If feed is disabled and default is threads, redirect to threads
            if (defaultSection === 'threads' && boardData.value.board.hasThreads) {
                await navigateTo(`/b/${boardName}/threads`, { replace: true });
            }
        } else if (defaultSection && defaultSection !== 'feed' && hasFeed) {
            // Feed is enabled but not default - only redirect if no previous navigation
            // Check if this is a direct navigation (not from clicking a link)
            if (defaultSection === 'threads' && boardData.value.board.hasThreads) {
                await navigateTo(`/b/${boardName}/threads`, { replace: true });
            }
        }
    } catch (error) {
        console.error('Error fetching board:', error);
        throw createError({
            statusCode: 404,
            statusMessage: `Board "${boardName}" not found`,
            fatal: true
        });
    }
}

//const boardView = boardStore.boardView;
const board = computed(() => boardStore.board);
//const boardCounts = boardView.counts;
const moderators = computed(() => board.value?.moderators || []);

// Computed property for banner display
const shouldShowBoardBanner = computed(() => {
    return route.params?.board && boardStore.hasBoard && board.value && board.value.id;
});


definePageMeta({
    key: (route) => route.fullPath,
    title: "Board Listing",
});

const title = computed(() => board.value?.is_removed
    ? `${board.value?.name || 'Unknown'}: Banned`
    : `${board.value?.title ?? board.value?.name ?? 'Unknown Board'} (${board.value?.name ?? 'unknown'})`);

useHead({
    title,
});

const preferCardView = useCookie("preferCardView") ?? false;

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 25);

// Welcome message
const welcome = ref(route.query.hasOwnProperty("welcome"));

/*const {
    board_view,
    site,
    moderators,
    discussion_languages,
    _pending,
    _error,
    _refresh,
} = await getBoard({
    name: route.params?.board,
   });*/

/*const board = {
  name: board_view.board.name,
  title: board_view.board.title,
  description: board_view.board.description,
  followers_count: board_view.counts.subscribers,
  posts_count: board_view.counts.posts,
  comments_count: board_view.counts.comments,
  created_at: board_view.board.creation_date,
  icon_url: board_view.board.icon,
  banner_url: board_view.board.banner,
};*/

// Posts
const { hasPosts, error, queryParams, loadMore, loading } = await usePosts(
    mapToListingType("local")
);
/*const postsStore = usePostsStore();

const sorts = [
    "hot",
    "new",
    "topall",
    "topmonth",
    "topweek",
    "topday",
    "mostcomments",
    "newcomments",
];
const sort = computed(() => {
    return sorts.includes(route.params?.sort) ? route.params?.sort : "hot";
});

const { items, totalCount, paginate, pending, error, refresh } =
    await getListing(
        {
            board_name: route.params?.board,
            sort: sort.value,
            limit: limit.value,
            page: page.value,
        },
        "posts",
    );

if (error.value && error.value.response) {
    throw createError({
        statusCode: 404,
        statusMessage:
            "We could not find the page you were looking for. Try better next time.",
        fatal: true,
    });
}

postsStore.posts = items;
const posts = postsStore.posts;

const totalPages = computed(() => {
    return Math.ceil(totalCount.value / limit.value || 1);
    });*/

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
