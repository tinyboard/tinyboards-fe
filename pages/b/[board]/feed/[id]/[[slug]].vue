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
            />
        </section>

        <!-- Main Content -->
        <section class="container mx-auto max-w-8xl grid grid-cols-12 md:mt-4 sm:px-4 md:px-6">
            <div class="col-span-full flex gap-6 sm:py-6">
                <div class="relative w-full">
                    <div v-if="loading" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Loading post...</p>
                    </div>

                    <div v-else-if="!post" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Post not found or has been removed.</p>
                    </div>

                    <!-- Post Content -->
                    <div v-else>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">
                            This is a board-specific feed post. Implementation should use the same
                            post/comment components as the generic post pages.
                        </p>
                        <p class="text-sm text-gray-500">
                            Board: {{ boardName }}<br>
                            Post ID: {{ postId }}<br>
                            Post Title: {{ post?.title }}<br>
                            URL Path: {{ post?.urlPath }}
                        </p>
                    </div>
                </div>

                <!-- Sidebar -->
                <component :is="SidebarBoard" />
            </div>
        </section>
    </main>
</template>

<script setup>
import { useBoardStore } from "@/stores/StoreBoard";
import { useGraphQLQuery } from "@/composables/useGraphQL";
import CardsBoardBanner from "@/components/cards/BoardBanner.vue";

const SidebarBoard = defineAsyncComponent(
    () => import("@/components/containers/SidebarBoard"),
);

const route = useRoute();
const boardStore = useBoardStore();

const boardName = route.params.board;
const postId = parseInt(route.params.id);
const loading = ref(true);
const post = ref(null);

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

// Fetch post
const postQuery = `
    query GetPost($id: Int!) {
        post(id: $id) {
            id
            title
            slug
            urlPath
            body
            bodyHTML
            postType
            boardId
            url
            image
            creationDate
            updated
            commentCount
            creator {
                id
                name
                displayName
                avatar
            }
            board {
                id
                name
            }
        }
    }
`;

try {
    const { data: postData, error: postError } = await useGraphQLQuery(postQuery, {
        variables: { id: postId }
    });

    if (postError.value || !postData.value?.post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found',
            fatal: true
        });
    }

    if (postData.value.post.postType !== 'feed') {
        throw createError({
            statusCode: 400,
            statusMessage: 'This post is not a feed post',
            fatal: true
        });
    }

    post.value = postData.value.post;

    // Redirect to canonical URL if needed
    if (post.value.urlPath && route.path !== post.value.urlPath) {
        await navigateTo(post.value.urlPath, { redirectCode: 301 });
    }
} catch (error) {
    console.error('Error fetching post:', error);
    throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
        fatal: true
    });
} finally {
    loading.value = false;
}

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
