<template>
  <div>
    <div :id="comment.id.toString()" class="comment group flex relative" :class="{
      'opacity-60 hover:opacity-100 focus:opacity-100 comments-center':
        isCollapsed,
    }" style="scroll-margin-top: 7rem;">
      <!-- Stretched Click Area -->
      <div v-show="isCollapsed" class="absolute w-full h-full inset z-20 cursor-pointer"
        @click="isCollapsed = !isCollapsed"></div>
      <!-- Comment -->
      <div class="relative flex flex-col flex-shrink-0 comments-center mr-2">
        <!-- User "avator" - ghost icon -->
        <div class="z-10">
          <div
            class="flex flex-shrink-0 w-6 h-6 md:w-9 md:h-9 rounded border-dashed border-2 border-gray-400 justify-center items-center bg-white dark:bg-gray-700">
            <svg class="w-4 h-4 md:w-6 md:h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7" />
              <path d="M10 10h.01" />
              <path d="M14 10h.01" />
            </svg>
          </div>
        </div>
        <!-- Comment Collapse Bar -->
        <div class="comment-collapse-bar dark:opacity-30 dark:hover:opacity-100" @click="isCollapsed = !isCollapsed"
          v-show="!isCollapsed"></div>
      </div>
      <!-- User Details -->
      <div class="flex-grow" :class="{ 'flex comments-center': isCollapsed }">
        <div :class="{ 'flex flex-grow comments-center leading-none': isCollapsed }">
          <div class="flex comments-center min-h-[24px] sm:min-h-[36px] items-center">
            <div class="inline-flex flex-wrap space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="text-sm text-gray-500 font-semibold">Deleted User</span>
              <!-- Parent Context Link -->
              <!--<NuxtLink v-if="comment.parent_id" :to="`#${comment.parent_id}`" v-show="!isCollapsed" class="flex comments-center align-middle text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                   <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
                                </svg>
                                <span>"parent author"</span>
                            </NuxtLink>-->
              <span v-show="!isCollapsed" class="flex comments-center space-x-2">
                <!-- Timestamp -->
                <span :title="comment.creationDate">{{
                  formatDate(new Date(comment.creationDate), false)
                }} <span class="hidden sm:inline">ago</span>
                </span>
              </span>
              <!-- Reply Count -->
              <span v-show="isCollapsed && comment.replyCount" class="flex comments-center space-x-2">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span>
                  {{ comment.replyCount }}
                  {{ comment.replyCount === 1 ? "reply" : "replies" }}
                </span>
              </span>
            </div>
          </div>
          <!-- Comment Text Body -->
          <div :id="`comment-text-${comment.id}`"
            class="comment-deleted-body target:bg-primary target:bg-opacity-10 mb-2" v-show="!isCollapsed">
            Comment {{ comment.isRemoved ? "removed by moderator" : "deleted by creator" }}
          </div>
        </div>
        <!-- Comment Actions -->
        <ul class="relative flex flex-grow flex-wrap comments-center space-x-4" v-show="!isCollapsed">
          <li class="hidden sm:inline sm:list-comment">
            <NuxtLink
              :to="`${site.enableBoards ? '/+' + comment.board!.name : ''}/post/${comment.postId}/${parentPost?.titleChunk ?? '-'}/${comment.id}#comment-text-${comment.id}`"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              Permalink
            </NuxtLink>
          </li>
          <li class="hidden sm:inline sm:list-comment">
            <NuxtLink
              :to="`${site.enableBoards ? '/+' + comment.board!.name : ''}/post/${comment.postId}/${parentPost?.titleChunk ?? '-'}/${comment.id}?context=3#comment-text-${comment.id}`"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              Context
            </NuxtLink>
          </li>
        </ul>
        <!-- Replies -->
        <!--<LazyListsComments v-if="!route.meta.hasRepliesDisabled &&
          comment.replyCount &&
          level <= limit
          " v-show="!isCollapsed" :comments="comment.replies" :offset="offset" class="relative" />-->
        <LazyListsComments v-show="!isCollapsed" :comments="comment.replies" :offset="offset" class="relative" />
        <!-- Continue Thread Link -->
        <NuxtLink v-if="comment.replyCount && level > limit" v-show="!isCollapsed"
          :to="`/post/${comment.postId}/${parentPost?.titleChunk ?? '-'}/${comment.id}`"
          class="relative inline-block text-primary text-sm hover:underline mt-2">
          Continue thread &#8594;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
// import { baseURL } from "@/server/constants";
import { formatDate } from "@/utils/formatDate";
import { useSiteStore } from "@/stores/StoreSite";
import { usePostsStore } from "@/stores/StorePosts";
import type { Comment, PostFragment } from "@/types/types";

const site = useSiteStore();
const postStore = usePostsStore();

const props = defineProps<{
  comment: Comment;
  limit?: number;
  offset?: number;
}>();

//const item = props.item;
const comment = props.comment;

const limit = props.limit ?? 3;
const offset = props.offset ?? 0;

const isCollapsed = ref(false);

// take comment level and subtract offset (depth) to get relative level
const level = computed(() => {
  return comment.level - offset;
});

const parentPost: PostFragment | undefined = comment.post ?? postStore.getPost(comment.postId);
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

.comment-deleted-body {
  @apply prose prose-sm break-words text-gray-900 max-w-none;
  opacity: 0.6 !important;
}

.comment-deleted-body :deep(p:first-of-type) {
  @apply mt-0;
}
</style>
