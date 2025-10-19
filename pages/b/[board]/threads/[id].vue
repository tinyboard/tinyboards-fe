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
                        <div class="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-700">
                            <!-- User Sidebar -->
                            <div class="p-3 sm:w-48 sm:flex-shrink-0 sm:p-4 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <div class="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                                    <!-- Avatar -->
                                    <NuxtLink :to="`/@${thread.creator?.name}`" class="flex-shrink-0">
                                        <img
                                            v-if="thread.creator?.avatar"
                                            :src="thread.creator.avatar"
                                            :alt="thread.creator.displayName || thread.creator.name"
                                            class="w-12 h-12 sm:w-24 sm:h-24 rounded border-2 border-gray-300 dark:border-gray-600"
                                        />
                                        <div v-else class="w-12 h-12 sm:w-24 sm:h-24 rounded border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
                                    </NuxtLink>

                                    <div class="flex-1 sm:flex-none sm:w-full">
                                        <!-- Display Name -->
                                        <NuxtLink
                                            :to="`/@${thread.creator?.name}`"
                                            class="sm:mt-3 font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
                                        >
                                            {{ thread.creator?.displayName || thread.creator?.name }}
                                        </NuxtLink>

                                        <!-- Stats (horizontal on mobile, vertical on desktop) -->
                                        <div class="mt-1 sm:mt-3 flex sm:flex-col sm:w-full text-xs text-gray-600 dark:text-gray-400 gap-2 sm:gap-1">
                                            <div class="hidden sm:block">Joined {{ formatDate(thread.creator?.creationDate) }}</div>
                                            <div>{{ thread.creator?.postCount || 0 }} posts</div>
                                            <div>{{ thread.creator?.commentCount || 0 }} comments</div>
                                        </div>
                                    </div>

                                    <!-- Signature (hidden on mobile) -->
                                    <div
                                        v-if="thread.creator?.signature"
                                        class="hidden sm:block mt-4 pt-4 w-full text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700"
                                        v-html="thread.creator.signature"
                                    ></div>
                                </div>
                            </div>

                            <!-- Post Content -->
                            <div class="flex-1 p-4 sm:p-6">
                                <!-- Edit Form -->
                                <LazyInputsEdit
                                    v-if="editingThreadId === thread.id"
                                    :id="thread.id"
                                    :body="thread.body"
                                    type="post"
                                    :isThread="true"
                                    @hasEdited="onThreadEdited"
                                    @closed="editingThreadId = null"
                                />

                                <!-- Thread Body -->
                                <div
                                    v-else-if="thread.bodyHTML"
                                    class="prose dark:prose-invert max-w-none"
                                    v-html="thread.bodyHTML"
                                ></div>
                                <div
                                    v-else-if="thread.body"
                                    class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                                >
                                    {{ thread.body }}
                                </div>

                                <!-- Post Date and Actions -->
                                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-gray-500 dark:text-gray-500">
                                            Posted {{ formatDate(thread.creationDate) }}
                                        </span>

                                        <!-- Thread Actions -->
                                        <div class="flex items-center gap-1">
                                            <button
                                                v-if="v && thread.creator?.id === v.id"
                                                @click="editingThreadId = thread.id"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                                title="Edit thread"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                                                    <path d="M16 5l3 3"></path>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                v-if="v && thread.creator?.id === v.id"
                                                @click="confirmDeleteThread"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                                                title="Delete thread"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <line x1="4" y1="7" x2="20" y2="7"></line>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                                </svg>
                                                Delete
                                            </button>
                                            <button
                                                v-if="v && thread.creator?.id !== v.id"
                                                @click="confirmReportThread"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950 rounded transition-colors"
                                                title="Report thread"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M3 3l18 18"></path>
                                                    <path d="M5 5v16"></path>
                                                    <path d="M19 5v.5"></path>
                                                    <path d="M5 5h8m4 0h2"></path>
                                                    <path d="M14.815 9.96a3.5 3.5 0 0 1 -1.785 3.017c-.936 .498 -1.093 .927 -1.03 2.023v.5"></path>
                                                    <path d="M12 18h.01"></path>
                                                </svg>
                                                Report
                                            </button>
                                            <a
                                                :href="`#thread-top`"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors"
                                                title="Permalink to this thread"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
                                                    <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
                                                </svg>
                                                Permalink
                                            </a>
                                        </div>
                                    </div>
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
                    <div class="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
                        <div
                            v-for="(comment, index) in comments"
                            :key="comment.id"
                            :id="`comment-${comment.id}`"
                        >
                            <!-- Comment with Forum-Style Layout -->
                            <div class="flex flex-col sm:flex-row">
                                <!-- User Sidebar -->
                                <div class="p-3 sm:w-48 sm:flex-shrink-0 sm:p-4 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                    <div class="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                                        <!-- Avatar -->
                                        <NuxtLink :to="`/@${comment.creator?.name}`" class="flex-shrink-0">
                                            <img
                                                v-if="comment.creator?.avatar"
                                                :src="comment.creator.avatar"
                                                :alt="comment.creator.displayName || comment.creator.name"
                                                class="w-10 h-10 sm:w-20 sm:h-20 rounded border-2 border-gray-300 dark:border-gray-600"
                                            />
                                            <div v-else class="w-10 h-10 sm:w-20 sm:h-20 rounded border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
                                        </NuxtLink>

                                        <div class="flex-1 sm:flex-none sm:w-full">
                                            <!-- Display Name -->
                                            <NuxtLink
                                                :to="`/@${comment.creator?.name}`"
                                                class="sm:mt-2 font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
                                            >
                                                {{ comment.creator?.displayName || comment.creator?.name }}
                                            </NuxtLink>

                                            <!-- Stats (horizontal on mobile, vertical on desktop) -->
                                            <div class="mt-0.5 sm:mt-2 flex sm:flex-col sm:w-full text-xs text-gray-600 dark:text-gray-400 gap-2 sm:gap-0.5">
                                                <div>{{ comment.creator?.postCount || 0 }} posts</div>
                                                <div>{{ comment.creator?.commentCount || 0 }} comments</div>
                                            </div>
                                        </div>

                                        <!-- Signature (hidden on mobile) -->
                                        <div
                                            v-if="comment.creator?.signature"
                                            class="hidden sm:block mt-3 pt-3 w-full text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700"
                                            v-html="comment.creator.signature"
                                        ></div>
                                    </div>
                                </div>

                                <!-- Comment Content -->
                                <div class="flex-1 p-3 sm:p-4">
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
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-gray-500 dark:text-gray-500">
                                            Posted {{ formatDate(comment.creationDate) }}
                                        </span>

                                        <!-- Comment Actions -->
                                        <div class="flex items-center gap-1">
                                            <button
                                                v-if="v"
                                                @click="quoteComment(comment)"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors"
                                                title="Quote this comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M6 15h15"></path>
                                                    <path d="M21 19h-15"></path>
                                                    <path d="M15 11h6"></path>
                                                    <path d="M21 7h-6"></path>
                                                    <path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
                                                    <path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
                                                </svg>
                                                Quote
                                            </button>
                                            <button
                                                v-if="v && comment.creator?.id === v.id"
                                                @click="editingCommentId = comment.id"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                                title="Edit comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                                                    <path d="M16 5l3 3"></path>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                v-if="v && comment.creator?.id === v.id"
                                                @click="confirmDeleteComment(comment.id)"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                                                title="Delete comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <line x1="4" y1="7" x2="20" y2="7"></line>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                                </svg>
                                                Delete
                                            </button>
                                            <button
                                                v-if="v && comment.creator?.id !== v.id"
                                                @click="confirmReportComment(comment.id)"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950 rounded transition-colors"
                                                title="Report comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M3 3l18 18"></path>
                                                    <path d="M5 5v16"></path>
                                                    <path d="M19 5v.5"></path>
                                                    <path d="M5 5h8m4 0h2"></path>
                                                    <path d="M14.815 9.96a3.5 3.5 0 0 1 -1.785 3.017c-.936 .498 -1.093 .927 -1.03 2.023v.5"></path>
                                                    <path d="M12 18h.01"></path>
                                                </svg>
                                                Report
                                            </button>
                                            <a
                                                :href="`#comment-${comment.id}`"
                                                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors"
                                                title="Permalink to this comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
                                                    <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
                                                </svg>
                                                Permalink
                                            </a>
                                        </div>
                                    </div>
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
                        <form @submit.prevent="submitComment" class="space-y-3">
                            <InputsTiptap
                                v-model="commentBody"
                                placeholder="Write your reply..."
                                :board-id="board?.id"
                                :disabled="submitting"
                                class="min-h-[200px]"
                            />
                            <div class="flex justify-end">
                                <button
                                    type="submit"
                                    class="button primary px-4 py-2"
                                    :disabled="!commentBody.trim() || submitting"
                                >
                                    {{ submitting ? 'Posting...' : 'Post Reply' }}
                                </button>
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

// Extract and truncate HTML content while preserving structure
const extractQuoteContent = (html, maxLength = 500) => {
    if (!html) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Limit to first 3 images to avoid clutter
    const images = doc.querySelectorAll('img');
    if (images.length > 3) {
        Array.from(images).slice(3).forEach(img => img.remove());
    }

    // Get the innerHTML with preserved structure
    let content = doc.body.innerHTML;

    // If content is too long, truncate it intelligently
    const textContent = doc.body.textContent || '';
    if (textContent.length > maxLength) {
        // Truncate at a reasonable point
        const truncatePoint = maxLength;
        let currentLength = 0;
        const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const nodeText = node.textContent || '';

            if (currentLength + nodeText.length > truncatePoint) {
                // Truncate this text node
                const remainingLength = truncatePoint - currentLength;
                node.textContent = nodeText.substring(0, remainingLength) + '...';

                // Remove all following siblings
                let sibling = node.nextSibling;
                while (sibling) {
                    const next = sibling.nextSibling;
                    sibling.parentNode?.removeChild(sibling);
                    sibling = next;
                }
                break;
            }
            currentLength += nodeText.length;
        }

        content = doc.body.innerHTML;
    }

    return content;
};

// Quote comment - now inserts directly into editor with images in original order
const quoteComment = (comment) => {
    const username = comment.creator?.displayName || comment.creator?.name || 'User';

    // Extract content with images and text in original order
    const quotedContent = extractQuoteContent(comment.bodyHTML || comment.body || '', 500);

    // Create a blockquote with the quoted content and comment ID
    const quoteHtml = `
        <blockquote data-comment-id="${comment.id}">
            <p><strong><a href="#comment-${comment.id}" class="quote-link">${username} said:</a></strong></p>
            ${quotedContent}
        </blockquote>
        <p><br></p>
    `;

    // Get current content and append the quote
    const currentContent = commentBody.value || '';
    commentBody.value = currentContent + quoteHtml;

    // Scroll to reply form at bottom
    nextTick(() => {
        document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
};

// Get quoted comment by ID
const getQuotedComment = (quotedCommentId) => {
    return comments.value.find(c => c.id === quotedCommentId);
};

// Import text utilities
const { stripHtml, truncateText } = await import('@/composables/text');

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
                quotedCommentId: null
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

// Thread editing
const editingThreadId = ref(null);

const onThreadEdited = (payload) => {
    thread.value.body = payload.newBody;
    thread.value.bodyHTML = payload.newBodyHTML;
    editingThreadId.value = null;
};

// Comment editing
const editingCommentId = ref(null);

const onCommentEdited = (comment, payload) => {
    comment.body = payload.newBody;
    comment.bodyHTML = payload.newBodyHTML;
    editingCommentId.value = null;
};

// Delete thread
const confirmDeleteThread = () => {
    modalStore.setModal({
        modal: "ModalDelete",
        id: threadId,
        contentType: "post",
        isOpen: true,
    });
};

// Report thread
const confirmReportThread = () => {
    modalStore.setModal({
        modal: "ModalReport",
        id: threadId,
        contentType: "post",
        isOpen: true,
    });
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

<style scoped>
/* Themed blockquote styling for rendered content */
:deep(.prose blockquote) {
  @apply border-l-4 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300;
  border-left-color: rgb(var(--color-primary));
  background-color: rgba(var(--color-primary), 0.05);
  quotes: none;
}

:deep(.prose blockquote)::before,
:deep(.prose blockquote)::after {
  content: '';
  content: none;
}

:deep(.prose blockquote p)::before,
:deep(.prose blockquote p)::after {
  content: '';
  content: none;
}

:deep(.prose blockquote a.quote-link) {
  @apply not-italic font-semibold no-underline;
  color: rgb(var(--color-primary));
}

:deep(.prose blockquote a.quote-link:hover) {
  @apply underline;
}

:deep(.prose blockquote strong) {
  @apply not-italic;
}
</style>
