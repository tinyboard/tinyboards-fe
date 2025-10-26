<template>
    <main id="page-thread-detail" class="flex flex-col pt-12 sm:pt-10">
        <!-- Breadcrumbs -->
        <section class="container mx-auto max-w-8xl sm:px-4 md:px-6 mt-4">
            <NavigationBreadcrumbs
                :current-page="thread?.title"
                :stream-slug="String(route.query.streamSlug || '')"
                :stream-name="String(route.query.streamName || '')"
                :stream-creator-username="String(route.query.streamCreator || '')"
            />
        </section>

        <!-- Main Content -->
        <section
            class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6"
        >
            <div class="col-span-full flex gap-6">
                <div class="w-full">
                    <div v-if="loading" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Loading thread...</p>
                    </div>

                    <div v-else-if="!thread" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Thread not found or has been removed.</p>
                    </div>

                    <!-- Thread Content (reuse from board thread page logic) -->
                    <div v-else>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">
                            This is a single-board mode thread. For the full implementation, this page
                            should render the same thread UI as the board-specific thread page.
                        </p>
                        <p class="text-sm text-gray-500">
                            Thread ID: {{ threadId }}<br>
                            Thread Title: {{ thread?.title }}<br>
                            URL Path: {{ thread?.urlPath }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useModalStore } from "@/stores/StoreModal";
import { useSiteStore } from "@/stores/StoreSite";
import { useGraphQLQuery } from "@/composables/useGraphQL";

const route = useRoute();
const userStore = useLoggedInUser();
const modalStore = useModalStore();
const v = userStore.user;

const threadId = parseInt(route.params.id);
const loading = ref(true);
const thread = ref(null);

// Fetch thread
const threadQuery = `
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
            creationDate
            updated
            commentCount
            featuredBoard
            isLocked
            creator {
                id
                name
                displayName
                avatar
                signature
                creationDate
                postCount
                commentCount
            }
            board {
                id
                name
            }
        }
    }
`;

try {
    const { data: threadData, error: threadError } = await useGraphQLQuery(threadQuery, {
        variables: { id: threadId }
    });

    if (threadError.value || !threadData.value?.post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Thread not found',
            fatal: true
        });
    }

    if (threadData.value.post.postType !== 'thread') {
        throw createError({
            statusCode: 400,
            statusMessage: 'This post is not a thread',
            fatal: true
        });
    }

    thread.value = threadData.value.post;

    // Board mode redirect: if boards are enabled and thread has a board, redirect to board URL
    const site = useSiteStore();
    if (site.enableBoards && thread.value.board) {
        const boardUrl = `/b/${thread.value.board.name}/threads/${threadId}/${thread.value.slug || thread.value.titleChunk || 'post'}`;
        await navigateTo(boardUrl, { redirectCode: 301 });
    }
} catch (error) {
    console.error('Error fetching thread:', error);
    throw createError({
        statusCode: 404,
        statusMessage: 'Thread not found',
        fatal: true
    });
} finally {
    loading.value = false;
}

const title = computed(() => thread.value?.title || 'Thread');

useHead({
    title,
});

definePageMeta({
    key: (route) => route.fullPath,
    title: "Thread",
});
</script>
