<template>
    <div
        v-show="comment.replies?.length"
        :id="`comment-${comment.id}`"
        class="group flex relative"
        :class="{
            'opacity-60 hover:opacity-100 focus:opacity-100 items-center':
                isCollapsed,
        }"
    >
        <div
            v-show="isCollapsed"
            class="absolute w-full h-full inset z-20 cursor-pointer"
            @click="isCollapsed = !isCollapsed"
        ></div>
        <div class="relative flex flex-col flex-shrink-0 items-center mr-2">
            <!-- Deleted User Comment -->
            <div class="z-10 text-gray-500 dark:text-gray-400">
                <svg
                    v-if="comment.isRemoved"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-message-circle-x"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                        d="M13.593 19.855a9.96 9.96 0 0 1 -5.893 -.855l-4.7 1l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c2.128 1.816 3.053 4.363 2.693 6.813"
                    ></path>
                    <path d="M22 22l-5 -5"></path>
                    <path d="M17 22l5 -5"></path>
                </svg>
                <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-trash"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 7l16 0"></path>
                    <path d="M10 11l0 6"></path>
                    <path d="M14 11l0 6"></path>
                    <path
                        d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                    ></path>
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                </svg>
            </div>
            <!-- Comment Collapse Bar -->
            <div
                v-if="comment.replies?.length"
                class="comment-collapse-bar dark:opacity-30 dark:hover:opacity-100"
                @click="isCollapsed = !isCollapsed"
                v-show="!isCollapsed"
            ></div>
        </div>
        <!-- User Details -->
        <div class="flex-grow" :class="{ 'flex items-center': isCollapsed }">
            <div
                :id="comment.id"
                :class="[
                    { 'flex flex-grow items-center leading-none': isCollapsed },
                    { 'mb-4': comment.replies?.length && !isCollapsed },
                ]"
            >
                <div
                    class="flex items-center"
                    :class="isCollapsed ? 'h-8' : 'h-6'"
                >
                    <div
                        class="inline-flex flex-wrap space-x-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                        <span>
                            Comment
                            {{
                                comment.isDeleted
                                    ? "deleted by author"
                                    : "removed by moderators"
                            }}
                        </span>
                        <span v-show="!isCollapsed" class="space-x-2">
                            <!-- Timestamp -->
                            <span :title="comment.creationDate">{{
                                formatDate(new Date(comment.creationDate))
                            }}</span>
                        </span>
                        <!-- Reply Count -->
                        <span
                            v-show="isCollapsed && comment.replyCount"
                            class="flex items-center space-x-2"
                        >
                            <span
                                class="font-black text-gray-400 dark:text-gray-500"
                                >·</span
                            >
                            <span>
                                {{ comment.replyCount }}
                                {{
                                    comment.replyCount === 1
                                        ? "reply"
                                        : "replies"
                                }}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <!-- Replies -->
            <!--<LazyListsComments
                v-if="comment.replies?.length && level <= limit"
                v-show="!isCollapsed"
                :comments="comment.replies"
                :offset="offset"
            />-->
            <LazyListsComments
                v-show="!isCollapsed"
                :comments="comment.replies"
                :offset="offset"
            />
            <!-- Continue Thread Link -->
            <NuxtLink
                v-if="comment.replies?.length && level > limit"
                :to="`/post/${comment.post.id}/${comment.id}`"
                class="inline-block mt-2 text-primary text-sm hover:underline"
            >
                Continue thread &#8594;
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
// import { baseURL } from "@/server/constants";
import { formatDate } from "@/utils/formatDate";

const props = defineProps({
    comment: Object,
    offset: {
        type: Number,
        default: 0,
    },
    limit: {
        type: Number,
        default: 3,
    },
});

//const item = props.item;
const comment = props.comment;

const isCollapsed = ref(false);

// take comment level and subtract offset (depth) to get relative level
const level = computed(() => {
    return comment.level - props.offset;
});
</script>

<style scoped>
/* Collapse Bar */
.comment-collapse-bar {
    @apply cursor-pointer;
}
.comment-collapse-bar:hover::before {
    @apply border-primary;
}
.comment-collapse-bar::before {
    content: "";
    left: calc(50% - 1px);
    width: 14px;
    height: calc(100% - 24px);
    @apply absolute bottom-0 border-l border-gray-300;
}
</style>
