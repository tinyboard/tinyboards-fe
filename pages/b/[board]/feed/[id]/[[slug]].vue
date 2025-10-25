<template>
    <main id="page-feed-post" class="flex flex-col pt-12 sm:pt-14">
        <!-- Sub Navigation & Banner -->
        <section class="flex-col flex">
            <NavigationNavbarSub
                :links="links"
                class="sm:order-first"
            />
            <div
                class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-8 sm:px-4 md:px-6"
            >
                <CardsBoardBanner
                    v-if="shouldShowBoardBanner"
                    :board="board"
                    :key="board?.id"
                    class="col-span-full"
                />
            </div>
        </section>

        <!-- Breadcrumbs -->
        <section class="container mx-auto max-w-8xl sm:px-4 md:px-6 mt-4">
            <NavigationBreadcrumbs
                :board-slug="boardName"
                :board-name="board?.title || board?.name"
                :current-page="post?.title"
                :stream-slug="String(route.query.streamSlug || '')"
                :stream-name="String(route.query.streamName || '')"
                :stream-creator-username="String(route.query.streamCreator || '')"
            />
        </section>

        <!-- Main Content -->
        <section class="container mx-auto max-w-8xl grid grid-cols-12 md:mt-4 sm:px-4 md:px-6">
            <div class="col-span-full flex gap-6 sm:py-6">
                <div class="relative w-full">
                    <div v-if="loading && !post" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Loading post...</p>
                    </div>

                    <div v-else-if="!loading && !post" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Post not found or has been removed.</p>
                    </div>

                    <!-- Post Content -->
                    <div v-else-if="post">
                        <component :post="post" :is="thread" />
                        <LazyContainersCommentSection :post="post" />
                    </div>
                </div>

                <!-- Sidebar -->
                <ContainersSidebarThread v-if="post" :post="post" />
            </div>
        </section>
    </main>
</template>

<script setup>
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from "@/stores/StoreSite";
import { usePost } from "@/composables/post";
import CardsBoardBanner from "@/components/cards/BoardBanner.vue";

const thread = defineAsyncComponent(() => import('@/components/containers/Thread.vue'));
const userStore = useLoggedInUser();
const site = useSiteStore();
const v = userStore.user;

const route = useRoute();
const boardStore = useBoardStore();

const boardName = route.params.board;
const postId = parseInt(route.params.id);

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

    if (!boardData.value.board.hasFeed) {
        throw createError({
            statusCode: 403,
            statusMessage: `Feed is not enabled for /b/${boardName}`,
            fatal: true
        });
    }

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

const shouldShowBoardBanner = computed(() => {
    return route.params?.board && boardStore.hasBoard && board.value && board.value.id;
});

// Handle invalid post ID
if (Number.isNaN(postId)) {
    throw createError({
        status: 400,
        statusText: "Bad post ID given.",
        fatal: true
    });
}

// Fetch post with comments using composable
let postResult;
try {
    postResult = await usePost(postId);

    // Handle authentication errors
    if (process.server && postResult.error.value?.isAuthError) {
        const tokenCookie = useCookie('token');
        tokenCookie.value = null;
        await navigateTo('/login?redirect=' + encodeURIComponent(route.fullPath));
    }
} catch (error) {
    console.error('Error fetching post:', error);
    throw createError({
        status: 500,
        statusText: 'Failed to load post data',
        fatal: true
    });
}

// Error checking
if (postResult.error.value && postResult.error.value.response && !postResult.data.value) {
    throw createError({
        status: 404,
        statusText: 'Post not found',
        fatal: true
    });
}

const post = postResult.post;
const loading = postResult.pending;

// Validate this is a feed post (commented out for now as postType might not be set correctly)
// if (post.value && post.value.postType && post.value.postType !== 'feed') {
//     throw createError({
//         statusCode: 400,
//         statusMessage: 'This post is not a feed post',
//         fatal: true
//     });
// }

// Canonical URL redirects removed - using consistent routing structure

const title = computed(() => `${post.value?.title || 'Post'} | ${board.value?.name}`);

useHead({
    title,
});

definePageMeta({
    key: (route) => route.fullPath,
    title: "Post",
});

// Links for sub navbar
const links = computed(() => {
    const baseLinks = [];

    if (board.value?.hasThreads) {
        baseLinks.push({ name: "Threads", href: `/b/${board.value?.name}/threads` });
    }

    if (board.value?.hasFeed) {
        baseLinks.push({ name: "Feed", href: `/b/${board.value?.name}` });
    }

    return baseLinks;
});
</script>
