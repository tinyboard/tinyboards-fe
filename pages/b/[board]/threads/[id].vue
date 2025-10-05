<template>
    <main id="page-thread-detail" class="flex flex-col pt-12 sm:pt-10">
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

        <!-- Main Content -->
        <section
            class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6"
        >
            <div class="col-span-full flex gap-6">
                <div class="w-full max-w-4xl">
                    <!-- Thread Content -->
                    <article
                        v-if="thread"
                        class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md overflow-hidden mb-4"
                    >
                        <!-- Thread Header -->
                        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 min-w-0">
                                    <!-- Title with pin indicator -->
                                    <div class="flex items-start gap-2">
                                        <svg
                                            v-if="thread.featuredBoard"
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
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
                                        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {{ thread.title }}
                                        </h1>
                                    </div>
                                </div>

                                <!-- Reply count badge -->
                                <div class="flex-shrink-0 text-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                                    <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {{ thread.commentCount }}
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">
                                        {{ thread.commentCount === 1 ? 'reply' : 'replies' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Thread Body with Forum-Style Layout -->
                        <div class="flex border-b border-gray-200 dark:border-gray-700">
                            <!-- User Sidebar -->
                            <div class="w-48 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <div class="flex flex-col items-center text-center">
                                    <!-- Avatar -->
                                    <NuxtLink :to="`/@${thread.creator?.name}`">
                                        <img
                                            v-if="thread.creator?.avatar"
                                            :src="thread.creator.avatar"
                                            :alt="thread.creator.displayName || thread.creator.name"
                                            class="w-24 h-24 rounded border-2 border-gray-300 dark:border-gray-600"
                                        />
                                        <div v-else class="w-24 h-24 rounded border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
                                    </NuxtLink>

                                    <!-- Display Name -->
                                    <NuxtLink
                                        :to="`/@${thread.creator?.name}`"
                                        class="mt-3 font-bold text-base text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        {{ thread.creator?.displayName || thread.creator?.name }}
                                    </NuxtLink>

                                    <!-- Stats -->
                                    <div class="mt-3 w-full text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                        <div>Joined {{ formatDate(thread.creator?.creationDate) }}</div>
                                        <div>{{ thread.creator?.postCount || 0 }} posts</div>
                                        <div>{{ thread.creator?.commentCount || 0 }} comments</div>
                                    </div>

                                    <!-- Signature -->
                                    <div
                                        v-if="thread.creator?.signature"
                                        class="mt-4 pt-4 w-full text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700"
                                        v-html="thread.creator.signature"
                                    ></div>
                                </div>
                            </div>

                            <!-- Post Content -->
                            <div class="flex-1 p-6">
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

                                <!-- Post Date -->
                                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-500">
                                    Posted {{ formatDate(thread.creationDate) }}
                                </div>
                            </div>
                        </div>

                        <!-- Thread Reactions -->
                        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
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

                    <!-- Comments -->
                    <div class="space-y-3">
                        <div
                            v-for="(comment, index) in comments"
                            :key="comment.id"
                            :id="`comment-${comment.id}`"
                            class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md overflow-hidden"
                        >
                            <!-- Comment with Forum-Style Layout -->
                            <div class="flex">
                                <!-- User Sidebar -->
                                <div class="w-48 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                    <div class="flex flex-col items-center text-center">
                                        <!-- Avatar -->
                                        <NuxtLink :to="`/@${comment.creator?.name}`">
                                            <img
                                                v-if="comment.creator?.avatar"
                                                :src="comment.creator.avatar"
                                                :alt="comment.creator.displayName || comment.creator.name"
                                                class="w-20 h-20 rounded border-2 border-gray-300 dark:border-gray-600"
                                            />
                                            <div v-else class="w-20 h-20 rounded border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
                                        </NuxtLink>

                                        <!-- Display Name -->
                                        <NuxtLink
                                            :to="`/@${comment.creator?.name}`"
                                            class="mt-2 font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            {{ comment.creator?.displayName || comment.creator?.name }}
                                        </NuxtLink>

                                        <!-- Stats -->
                                        <div class="mt-2 w-full text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                            <div>{{ comment.creator?.postCount || 0 }} posts</div>
                                            <div>{{ comment.creator?.commentCount || 0 }} comments</div>
                                        </div>

                                        <!-- Signature -->
                                        <div
                                            v-if="comment.creator?.signature"
                                            class="mt-3 pt-3 w-full text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700"
                                            v-html="comment.creator.signature"
                                        ></div>
                                    </div>
                                </div>

                                <!-- Comment Content -->
                                <div class="flex-1 p-4">
                                    <!-- Reply Number -->
                                    <div class="flex items-center justify-end mb-3">
                                        <span class="text-xs font-semibold text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">#{{ index + 1 }}</span>
                                    </div>

                                    <!-- Quoted Comment Reference -->
                                    <div
                                        v-if="comment.quotedCommentId"
                                        class="mb-3 p-3 bg-blue-50 dark:bg-blue-950 border-l-4 border-l-blue-400 dark:border-l-blue-500 rounded"
                                    >
                                        <a
                                            :href="`#comment-${comment.quotedCommentId}`"
                                            class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold mb-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M6 15h15l-3 -3m0 6l3 -3"></path>
                                                <path d="M9 6h-3a2 2 0 0 0 -2 2v10"></path>
                                            </svg>
                                            <span>{{ getQuotedComment(comment.quotedCommentId)?.creator?.displayName || getQuotedComment(comment.quotedCommentId)?.creator?.name || 'User' }} said:</span>
                                        </a>
                                        <div
                                            v-if="getQuotedComment(comment.quotedCommentId)?.bodyHTML"
                                            class="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300"
                                            v-html="getQuotedComment(comment.quotedCommentId).bodyHTML"
                                        ></div>
                                        <div
                                            v-else-if="getQuotedComment(comment.quotedCommentId)?.body"
                                            class="text-gray-700 dark:text-gray-300 text-sm"
                                        >
                                            {{ getQuotedComment(comment.quotedCommentId).body }}
                                        </div>
                                        <div v-else class="text-gray-500 dark:text-gray-500 text-sm italic">
                                            [Comment not found or deleted]
                                        </div>
                                    </div>

                                <!-- Edit Form -->
                                <LazyInputsEdit
                                    v-if="editingCommentId === comment.id"
                                    :id="comment.id"
                                    :body="comment.body"
                                    type="comment"
                                    :isThread="true"
                                    @hasEdited="(payload) => onCommentEdited(comment, payload)"
                                    @closed="editingCommentId = null"
                                />

                                <!-- Comment Body -->
                                <div
                                    v-else-if="comment.bodyHTML"
                                    class="prose dark:prose-invert prose-sm max-w-none"
                                    v-html="comment.bodyHTML"
                                ></div>
                                <div
                                    v-else-if="comment.body"
                                    class="text-gray-700 dark:text-gray-300 text-sm"
                                >
                                    {{ comment.body }}
                                </div>

                                <!-- Comment Meta -->
                                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <span class="text-xs text-gray-500 dark:text-gray-500">
                                        Posted {{ formatDate(comment.creationDate) }}
                                    </span>

                                    <!-- Comment Actions -->
                                    <ul class="flex flex-wrap items-center gap-4 mt-3 text-xs">
                                        <li v-if="v">
                                            <button
                                                @click="quoteComment(comment)"
                                                class="font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                Quote
                                            </button>
                                        </li>
                                        <li v-if="v && comment.creator?.id === v.id">
                                            <button
                                                @click="editingCommentId = comment.id"
                                                class="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                            >
                                                Edit
                                            </button>
                                        </li>
                                        <li v-if="v && comment.creator?.id === v.id">
                                            <button
                                                @click="confirmDeleteComment(comment.id)"
                                                class="font-medium text-gray-500 hover:text-red-600 dark:text-gray-400"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                        <li v-if="v && comment.creator?.id !== v.id">
                                            <button
                                                @click="confirmReportComment(comment.id)"
                                                class="font-medium text-gray-500 hover:text-yellow-600 dark:text-gray-400"
                                            >
                                                Report
                                            </button>
                                        </li>
                                        <li>
                                            <a
                                                :href="`#comment-${comment.id}`"
                                                class="font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                Permalink
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            </div>

                            <!-- Comment Reactions -->
                            <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
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

                    <!-- Comment Form -->
                    <div
                        v-if="v"
                        id="reply-form"
                        class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6 mt-6"
                    >
                        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Reply to thread
                        </h3>
                        <form @submit.prevent="submitComment">
                            <InputsTiptap
                                v-model="commentBody"
                                placeholder="Write your reply..."
                                :board-id="board?.id"
                                :disabled="submitting"
                                class="min-h-[200px]"
                            />
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
                        class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md p-6 mt-6 text-center"
                    >
                        <p class="text-gray-600 dark:text-gray-400 mb-3">
                            Please log in to reply to this thread
                        </p>
                        <NuxtLink to="/login" class="button primary">
                            Log In
                        </NuxtLink>
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
import { useModalStore } from "@/stores/StoreModal";
import { useGraphQLQuery, useGraphQLMutation } from "@/composables/useGraphQL";
import CardsBoardBanner from "@/components/cards/BoardBanner.vue";

const SidebarBoard = defineAsyncComponent(
    () => import("@/components/containers/SidebarBoard"),
);

const router = useRouter();
const route = useRoute();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const modalStore = useModalStore();
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
            reactionSettings {
                id
                emojiWeights
            }
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
                signature
                creationDate
                postCount
                commentCount
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
        const commentsQuery = `
            query GetComments($postId: Int!, $limit: Int, $page: Int, $sort: CommentSortType) {
                comments(postId: $postId, limit: $limit, page: $page, sort: $sort) {
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
                        signature
                        creationDate
                        postCount
                        commentCount
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
                page: pageNum,
                sort: 'old' // Chronological order (oldest first)
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
    // Scroll to reply form at bottom
    nextTick(() => {
        document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
};

const clearQuote = () => {
    quotedComment.value = null;
};

// Get quoted comment by ID
const getQuotedComment = (quotedCommentId) => {
    return comments.value.find(c => c.id === quotedCommentId);
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

        // Add new comment to the end of the list (chronological order)
        if (data.value?.createComment) {
            comments.value.push(data.value.createComment);
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

// Comment editing
const editingCommentId = ref(null);

const onCommentEdited = (comment, payload) => {
    comment.body = payload.newBody;
    comment.bodyHTML = payload.newBodyHTML;
    editingCommentId.value = null;
};

// Delete comment
const confirmDeleteComment = (commentId) => {
    modalStore.setModal({
        modal: "ModalDelete",
        id: commentId,
        contentType: "comment",
        isOpen: true,
    });
};

// Report comment
const confirmReportComment = (commentId) => {
    modalStore.setModal({
        modal: "ModalReport",
        id: commentId,
        contentType: "comment",
        isOpen: true,
    });
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

    if (board.value?.hasThreads) {
        baseLinks.push({ name: "Threads", href: `/b/${board.value?.name}/threads` });
    }

    if (board.value?.hasFeed) {
        baseLinks.push({ name: "Feed", href: `/b/${board.value?.name}` });
    }

    return baseLinks;
});
</script>
