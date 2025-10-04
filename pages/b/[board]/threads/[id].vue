<template>
    <main id="page-thread-detail" class="flex flex-col pt-12 sm:pt-10">
        <!-- Sub Navigation & Banner -->
        <section class="flex-col flex">
            <NavigationNavbarSub
                :links="links"
                class="sm:order-first sm:hidden"
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

        <!-- Main Content -->
        <section
            class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6"
        >
            <div class="col-span-full flex gap-6">
                <div class="w-full max-w-4xl">
                    <!-- Thread Content -->
                    <article
                        v-if="thread"
                        class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6 mb-6"
                    >
                        <!-- Pin indicator -->
                        <div v-if="thread.featuredBoard" class="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 text-sm font-medium mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
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
                            <span>Pinned</span>
                        </div>

                        <!-- Title -->
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {{ thread.title }}
                        </h1>

                        <!-- Metadata -->
                        <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            <NuxtLink
                                :to="`/@${thread.creator?.name}`"
                                class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <img
                                    v-if="thread.creator?.avatar"
                                    :src="thread.creator.avatar"
                                    :alt="thread.creator.displayName || thread.creator.name"
                                    class="w-6 h-6 rounded-full"
                                />
                                <strong>{{ thread.creator?.displayName || thread.creator?.name }}</strong>
                            </NuxtLink>
                            <span>·</span>
                            <span>{{ formatDate(thread.creationDate) }}</span>
                            <span>·</span>
                            <span>{{ thread.commentCount }} {{ thread.commentCount === 1 ? 'reply' : 'replies' }}</span>
                        </div>

                        <!-- Body -->
                        <div
                            v-if="thread.bodyHTML"
                            class="prose dark:prose-invert max-w-none"
                            v-html="thread.bodyHTML"
                        ></div>
                        <div
                            v-else-if="thread.body"
                            class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                        >
                            {{ thread.body }}
                        </div>

                        <!-- Thread Reactions -->
                        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <CardsReactionBar
                                :reaction-counts="thread.reactionCounts || []"
                                :my-reaction="thread.myReaction?.emoji"
                                @toggle="toggleThreadReaction"
                            >
                                <template #add-reaction>
                                    <InputsReactionPicker
                                        :my-reaction="thread.myReaction?.emoji"
                                        @select="toggleThreadReaction"
                                    />
                                </template>
                            </CardsReactionBar>
                        </div>
                    </article>

                    <!-- Comment Form -->
                    <div
                        v-if="v"
                        class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6 mb-6"
                    >
                        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Reply to thread
                        </h3>
                        <form @submit.prevent="submitComment">
                            <textarea
                                v-model="commentBody"
                                rows="4"
                                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                placeholder="Write your reply..."
                                :disabled="submitting"
                            ></textarea>
                            <div class="flex items-center gap-2 mt-3">
                                <button
                                    type="submit"
                                    class="button primary"
                                    :disabled="!commentBody.trim() || submitting"
                                >
                                    {{ submitting ? 'Posting...' : 'Post Reply' }}
                                </button>
                                <button
                                    v-if="quotedComment"
                                    type="button"
                                    @click="clearQuote"
                                    class="button secondary"
                                >
                                    Clear Quote
                                </button>
                            </div>
                            <div v-if="quotedComment" class="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded border-l-4 border-blue-500">
                                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Quoting <strong>{{ quotedComment.creator?.displayName || quotedComment.creator?.name }}</strong>:
                                </div>
                                <div class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                    {{ quotedComment.body?.substring(0, 200) }}{{ quotedComment.body?.length > 200 ? '...' : '' }}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div
                        v-else
                        class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6 mb-6 text-center"
                    >
                        <p class="text-gray-600 dark:text-gray-400 mb-3">
                            Please log in to reply to this thread
                        </p>
                        <NuxtLink to="/login" class="button primary">
                            Log In
                        </NuxtLink>
                    </div>

                    <!-- Comments -->
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Replies ({{ thread?.commentCount || 0 }})
                        </h2>

                        <div
                            v-for="comment in comments"
                            :key="comment.id"
                            :id="`comment-${comment.id}`"
                            class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-4"
                        >
                            <!-- Comment Header -->
                            <div class="flex items-center gap-3 mb-3">
                                <NuxtLink
                                    :to="`/@${comment.creator?.name}`"
                                    class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <img
                                        v-if="comment.creator?.avatar"
                                        :src="comment.creator.avatar"
                                        :alt="comment.creator.displayName || comment.creator.name"
                                        class="w-8 h-8 rounded-full"
                                    />
                                    <strong class="text-gray-900 dark:text-gray-100">
                                        {{ comment.creator?.displayName || comment.creator?.name }}
                                    </strong>
                                </NuxtLink>
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ formatDate(comment.creationDate) }}
                                </span>
                            </div>

                            <!-- Quoted Comment Reference -->
                            <div
                                v-if="comment.quotedCommentId"
                                class="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-400"
                            >
                                <a
                                    :href="`#comment-${comment.quotedCommentId}`"
                                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    In reply to comment #{{ comment.quotedCommentId }}
                                </a>
                            </div>

                            <!-- Comment Body -->
                            <div
                                v-if="comment.bodyHTML"
                                class="prose dark:prose-invert prose-sm max-w-none mb-3"
                                v-html="comment.bodyHTML"
                            ></div>
                            <div
                                v-else-if="comment.body"
                                class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3"
                            >
                                {{ comment.body }}
                            </div>

                            <!-- Comment Actions -->
                            <div class="flex items-center gap-4 text-sm mb-3">
                                <button
                                    v-if="v"
                                    @click="quoteComment(comment)"
                                    class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                >
                                    Quote
                                </button>
                                <a
                                    :href="`#comment-${comment.id}`"
                                    class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                >
                                    Link
                                </a>
                            </div>

                            <!-- Comment Reactions -->
                            <CardsReactionBar
                                :reaction-counts="comment.reactionCounts || []"
                                :my-reaction="comment.myReaction?.emoji"
                                @toggle="(emoji) => toggleCommentReaction(comment, emoji)"
                            >
                                <template #add-reaction>
                                    <InputsReactionPicker
                                        :my-reaction="comment.myReaction?.emoji"
                                        @select="(emoji) => toggleCommentReaction(comment, emoji)"
                                    />
                                </template>
                            </CardsReactionBar>
                        </div>

                        <!-- Empty State -->
                        <div
                            v-if="comments.length === 0 && !loading"
                            class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-12 text-center"
                        >
                            <p class="text-gray-500 dark:text-gray-400">
                                No replies yet. Be the first to reply!
                            </p>
                        </div>

                        <!-- Load More -->
                        <button
                            v-if="hasMoreComments"
                            @click="loadMoreComments"
                            :disabled="loading"
                            class="w-full button secondary"
                        >
                            {{ loading ? 'Loading...' : 'Load More Replies' }}
                        </button>
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
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useGraphQLQuery, useGraphQLMutation } from "@/composables/useGraphQL";
import CardsBoardBanner from "@/components/cards/BoardBanner.vue";

const SidebarBoard = defineAsyncComponent(
    () => import("@/components/containers/SidebarBoard"),
);

const router = useRouter();
const route = useRoute();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const v = userStore.user;

const boardName = route.params.board;
const threadId = parseInt(route.params.id);

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

    if (!boardData.value.board.hasThreads) {
        throw createError({
            statusCode: 403,
            statusMessage: `Threads are not enabled for /b/${boardName}`,
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

definePageMeta({
    key: (route) => route.fullPath,
    title: "Thread",
});

// Thread data
const thread = ref(null);
const comments = ref([]);
const loading = ref(false);
const page = ref(1);
const limit = 50;
const hasMoreComments = ref(true);

// Comment form
const commentBody = ref('');
const quotedComment = ref(null);
const submitting = ref(false);

// Fetch thread
const threadQuery = `
    query GetPost($id: Int!) {
        post(id: $id) {
            id
            title
            body
            bodyHTML
            postType
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
            }
            board {
                id
                name
            }
            reactionCounts {
                id
                emoji
                count
            }
            myReaction {
                id
                emoji
                score
            }
        }
    }
`;

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

const title = computed(() => `${thread.value?.title || 'Thread'} - ${board.value?.name}`);

useHead({
    title,
});

// Fetch comments (chronological)
const fetchComments = async (pageNum = 1) => {
    loading.value = true;
    try {
        // TODO: Create a chronological comments query on backend
        // For now, we'll use a simple comment list query
        const commentsQuery = `
            query GetComments($postId: Int!, $limit: Int, $offset: Int) {
                comments(postId: $postId, limit: $limit, offset: $offset) {
                    id
                    body
                    bodyHTML
                    creationDate
                    updated
                    quotedCommentId
                    creator {
                        id
                        name
                        displayName
                        avatar
                    }
                    reactionCounts {
                        id
                        emoji
                        count
                    }
                    myReaction {
                        id
                        emoji
                        score
                    }
                }
            }
        `;

        const { data, error } = await useGraphQLQuery(commentsQuery, {
            variables: {
                postId: threadId,
                limit,
                offset: (pageNum - 1) * limit
            }
        });

        if (error.value) {
            console.error('Error fetching comments:', error.value);
            return;
        }

        const newComments = data.value?.comments || [];

        if (pageNum === 1) {
            comments.value = newComments;
        } else {
            comments.value = [...comments.value, ...newComments];
        }

        hasMoreComments.value = newComments.length === limit;
        page.value = pageNum;
    } finally {
        loading.value = false;
    }
};

await fetchComments();

const loadMoreComments = async () => {
    await fetchComments(page.value + 1);
};

// Quote comment
const quoteComment = (comment) => {
    quotedComment.value = comment;
    // Scroll to comment form
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearQuote = () => {
    quotedComment.value = null;
};

// Submit comment
const submitComment = async () => {
    if (!commentBody.value.trim() || submitting.value) return;

    submitting.value = true;
    try {
        const mutation = `
            mutation CreateComment($postId: Int!, $body: String!, $quotedCommentId: Int) {
                createComment(replyToPostId: $postId, body: $body, quotedCommentId: $quotedCommentId) {
                    id
                    body
                    bodyHTML
                    creationDate
                    quotedCommentId
                    creator {
                        id
                        name
                        displayName
                        avatar
                    }
                    reactionCounts {
                        id
                        emoji
                        count
                    }
                    myReaction {
                        id
                        emoji
                        score
                    }
                }
            }
        `;

        const { data, error } = await useGraphQLMutation(mutation, {
            variables: {
                postId: threadId,
                body: commentBody.value,
                quotedCommentId: quotedComment.value?.id || null
            }
        });

        if (error.value) {
            console.error('Error creating comment:', error.value);
            alert('Failed to post comment. Please try again.');
            return;
        }

        // Add new comment to the list
        if (data.value?.createComment) {
            comments.value.unshift(data.value.createComment);
            thread.value.commentCount++;
        }

        // Clear form
        commentBody.value = '';
        quotedComment.value = null;
    } finally {
        submitting.value = false;
    }
};

// Reaction handlers
const toggleThreadReaction = async (emoji) => {
    if (!v) {
        alert('Please log in to react');
        return;
    }

    const isRemoving = thread.value.myReaction?.emoji === emoji;

    try {
        if (isRemoving) {
            // Remove reaction
            const mutation = `
                mutation RemoveReaction($postId: Int, $emoji: String!) {
                    removeReaction(input: { postId: $postId, emoji: $emoji }) {
                        success
                    }
                }
            `;

            const { error } = await useGraphQLMutation(mutation, {
                variables: {
                    postId: threadId,
                    emoji
                }
            });

            if (error.value) {
                console.error('Error removing reaction:', error.value);
                return;
            }

            // Update local state
            thread.value.myReaction = null;
            const reactionCount = thread.value.reactionCounts.find(r => r.emoji === emoji);
            if (reactionCount) {
                reactionCount.count--;
                if (reactionCount.count <= 0) {
                    thread.value.reactionCounts = thread.value.reactionCounts.filter(r => r.emoji !== emoji);
                }
            }
        } else {
            // Add reaction
            const mutation = `
                mutation AddReaction($postId: Int, $emoji: String!) {
                    addReaction(input: { postId: $postId, emoji: $emoji }) {
                        reaction {
                            id
                            emoji
                            score
                        }
                    }
                }
            `;

            const { data, error } = await useGraphQLMutation(mutation, {
                variables: {
                    postId: threadId,
                    emoji
                }
            });

            if (error.value) {
                console.error('Error adding reaction:', error.value);
                alert(error.value.message || 'Failed to add reaction');
                return;
            }

            // Remove old reaction if exists
            if (thread.value.myReaction) {
                const oldEmoji = thread.value.myReaction.emoji;
                const oldReactionCount = thread.value.reactionCounts.find(r => r.emoji === oldEmoji);
                if (oldReactionCount) {
                    oldReactionCount.count--;
                    if (oldReactionCount.count <= 0) {
                        thread.value.reactionCounts = thread.value.reactionCounts.filter(r => r.emoji !== oldEmoji);
                    }
                }
            }

            // Update local state
            thread.value.myReaction = data.value.addReaction.reaction;
            const existingCount = thread.value.reactionCounts.find(r => r.emoji === emoji);
            if (existingCount) {
                existingCount.count++;
            } else {
                thread.value.reactionCounts.push({ emoji, count: 1 });
            }
        }
    } catch (err) {
        console.error('Reaction error:', err);
    }
};

const toggleCommentReaction = async (comment, emoji) => {
    if (!v) {
        alert('Please log in to react');
        return;
    }

    const isRemoving = comment.myReaction?.emoji === emoji;

    try {
        if (isRemoving) {
            // Remove reaction
            const mutation = `
                mutation RemoveReaction($commentId: Int, $emoji: String!) {
                    removeReaction(input: { commentId: $commentId, emoji: $emoji }) {
                        success
                    }
                }
            `;

            const { error } = await useGraphQLMutation(mutation, {
                variables: {
                    commentId: comment.id,
                    emoji
                }
            });

            if (error.value) {
                console.error('Error removing reaction:', error.value);
                return;
            }

            // Update local state
            comment.myReaction = null;
            const reactionCount = comment.reactionCounts.find(r => r.emoji === emoji);
            if (reactionCount) {
                reactionCount.count--;
                if (reactionCount.count <= 0) {
                    comment.reactionCounts = comment.reactionCounts.filter(r => r.emoji !== emoji);
                }
            }
        } else {
            // Add reaction
            const mutation = `
                mutation AddReaction($commentId: Int, $emoji: String!) {
                    addReaction(input: { commentId: $commentId, emoji: $emoji }) {
                        reaction {
                            id
                            emoji
                            score
                        }
                    }
                }
            `;

            const { data, error } = await useGraphQLMutation(mutation, {
                variables: {
                    commentId: comment.id,
                    emoji
                }
            });

            if (error.value) {
                console.error('Error adding reaction:', error.value);
                alert(error.value.message || 'Failed to add reaction');
                return;
            }

            // Remove old reaction if exists
            if (comment.myReaction) {
                const oldEmoji = comment.myReaction.emoji;
                const oldReactionCount = comment.reactionCounts.find(r => r.emoji === oldEmoji);
                if (oldReactionCount) {
                    oldReactionCount.count--;
                    if (oldReactionCount.count <= 0) {
                        comment.reactionCounts = comment.reactionCounts.filter(r => r.emoji !== oldEmoji);
                    }
                }
            }

            // Update local state
            comment.myReaction = data.value.addReaction.reaction;
            const existingCount = comment.reactionCounts.find(r => r.emoji === emoji);
            if (existingCount) {
                existingCount.count++;
            } else {
                comment.reactionCounts.push({ emoji, count: 1 });
            }
        }
    } catch (err) {
        console.error('Reaction error:', err);
    }
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

// Links for sub navbar
const links = computed(() => {
    const baseLinks = [];

    if (board.value?.hasFeed) {
        baseLinks.push({ name: "Feed", href: `/b/${board.value?.name}` });
    }

    if (board.value?.hasThreads) {
        baseLinks.push({ name: "Threads", href: `/b/${board.value?.name}/threads` });
    }

    baseLinks.push({ name: "About", href: `/b/${board.value?.name}/sidebar` });

    return baseLinks;
});
</script>
