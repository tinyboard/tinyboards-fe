<template>
    <main id="page-feed-post" class="flex flex-col pt-12 sm:pt-14">
        <!-- Breadcrumbs -->
        <section class="container mx-auto max-w-8xl sm:px-4 md:px-6 mt-4">
            <NavigationBreadcrumbs
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
                    <div v-if="loading" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Loading post...</p>
                    </div>

                    <div v-else-if="!post" class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6">
                        <p>Post not found or has been removed.</p>
                    </div>

                    <!-- Post Content -->
                    <div v-else>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">
                            This is a single-board mode feed post. Implementation should use the same
                            post/comment components as the generic post pages.
                        </p>
                        <p class="text-sm text-gray-500">
                            Post ID: {{ postId }}<br>
                            Post Title: {{ post?.title }}<br>
                            URL Path: {{ post?.urlPath }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { useGraphQLQuery } from "@/composables/useGraphQL";
import { useSiteStore } from "@/stores/StoreSite";

const route = useRoute();
const postId = parseInt(route.params.id);
const loading = ref(true);
const post = ref(null);

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

    // Board mode redirect: if boards are enabled and post has a board, redirect to board URL
    const site = useSiteStore();
    if (site.enableBoards && post.value.board) {
        const boardUrl = `/b/${post.value.board.name}/feed/${postId}/${post.value.slug || post.value.titleChunk || 'post'}`;
        await navigateTo(boardUrl, { redirectCode: 301 });
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

const title = computed(() => post.value?.title || 'Post');

useHead({
    title,
});

definePageMeta({
    key: (route) => route.fullPath,
    title: "Post",
});
</script>
