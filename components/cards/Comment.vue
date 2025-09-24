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
        <!-- User Avatar -->
        <NuxtLink v-if="comment.creator"
          :to="`/@${comment.creator.name}${comment.creator.instance ? '@' + comment.creator.instance : ''}`"
          class="z-10">
          <img loading="lazy" :src="comment.creator.avatar || 'https://placekitten.com/36/36'" alt="avatar"
            class="flex-shrink-0 object-cover w-6 h-6 md:w-9 md:h-9 rounded" />
        </NuxtLink>
        <!-- Comment Collapse Bar -->
        <div class="comment-collapse-bar dark:opacity-30 dark:hover:opacity-100" @click="isCollapsed = !isCollapsed"
          v-show="!isCollapsed"></div>
      </div>
      <!-- User Details -->
      <div class="flex-grow" :class="{ 'flex comments-center': isCollapsed }">
        <div :class="{ 'flex flex-grow comments-center leading-none': isCollapsed }">
          <div class="flex comments-center min-h-[24px] sm:min-h-[36px] items-center">
            <div class="inline-flex flex-wrap space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <NuxtLink v-if="comment.creator"
                :to="`/@${comment.creator.name}${comment.creator.instance ? '@' + comment.creator.instance : ''}`"
                class="flex comments-center text-sm">
                <strong>{{ comment.creator.displayName ?? comment.creator.name }}</strong>
                <span v-if="comment.creator.instance">@{{ comment.creator.instance }}</span>
                <!-- Role -->
                <span v-if="comment.creator.isAdmin" class="ml-1 badge badge-red">Admin</span>
                <span v-if="isOP" class="ml-1 badge badge-blue">OP</span>
              </NuxtLink>
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

                <!-- Edited Timestamp -->
                <span v-if="comment.updated">
                  <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                  <span :title="comment.updated" class="pl-1 italic">
                    <svg xmlns="http://www.w3.org/2000/svg" class="inline sm:hidden" width="16" height="16"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                      <path d="M16 5l3 3"></path>
                    </svg>
                    <span class="hidden sm:inline">Edited</span> {{ formatDate(new Date(comment.updated), false) }}
                    <span class="hidden sm:inline">ago</span>
                  </span>
                </span>
              </span>
              <!-- Score -->
              <span :title="`+${comment.upvotes} | -${comment.downvotes}`"
                class="hidden sm:flex comments-center space-x-2">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span>
                  {{ score }}
                  {{ score === 1 ? "pt" : "pts" }}
                </span>
              </span>
              <!-- Reply Count -->
              <span v-show="isCollapsed && comment.replies?.length" class="flex comments-center space-x-2">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span>
                  {{ comment.replies?.length }}
                  {{ comment.replies?.length === 1 ? "reply" : "replies" }}
                </span>
              </span>
              <span class="ml-2 text-red-600 text-xs" v-if="comment.isRemoved && canMod"
                title="Comment removed by moderator or admin">
                <span class="font-black text-gray-400 dark:text-gray-500 mr-1">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline sm:hidden ml-1" width="20" height="20"
                  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M13.593 19.855a9.96 9.96 0 0 1 -5.893 -.855l-4.7 1l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c2.128 1.816 3.053 4.363 2.693 6.813">
                  </path>
                  <path d="M22 22l-5 -5"></path>
                  <path d="M17 22l5 -5"></path>
                </svg>
                <span class="hidden sm:inline">Removed</span>
              </span>
              <span class="ml-2 text-yellow-600 text-xs" v-else-if="comment.isDeleted && canMod"
                title="Comment deleted by its creator">
                <span class="font-black text-gray-400 dark:text-gray-500 mr-1">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline sm:hidden ml-1" width="16" height="16"
                  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 7l16 0"></path>
                  <path d="M10 11l0 6"></path>
                  <path d="M14 11l0 6"></path>
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                </svg>
                <span class="hidden sm:inline">Deleted</span>
              </span>
              <span class="ml-2 text-green-600 text-xs" v-else-if="comment.isPinned"
                title="Comment pinned by moderators">
                <span class="font-black text-gray-400 dark:text-gray-500 mr-1">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline sm:hidden ml-1" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6" />
                  <path d="M12 16l0 5" />
                  <path d="M8 4l8 0" />
                </svg>
                <span class="hidden sm:inline">Pinned</span>
              </span>
              <!-- TODO: comment reports -->
              <!-- Report count -->
              <span class="ml-2 text-orange-400 font-bold text-xs"
                v-if="false" :title="`??? report(s)`">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline ml-1" width="20" height="20" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
                </svg>
                ???
              </span>
            </div>
          </div>
          <!-- Comment Edit Form -->
          <LazyInputsEdit v-if="isEditing" :id="comment.id" :body="comment.body" type="comment" @hasEdited="onHasEdited"
            @closed="isEditing = false" />
          <!-- Comment Text Body -->
          <div :id="`comment-text-${comment.id}`" class="comment-body target:bg-primary target:bg-opacity-10" :class="{
            'bg-red-400 bg-opacity-40': canMod && comment.isRemoved,
            'bg-yellow-400 bg-opacity-40': canMod && comment.isDeleted
          }" v-show="!isCollapsed && !isEditing" v-html="comment.bodyHTML"></div>
        </div>
        <!-- Comment Reports -->
        <div v-if="false" class="mb-2">
          <CardsReports :id="comment.id" type="comment" />
        </div>
        <!-- Comment Actions -->
        <ul class="relative flex flex-grow flex-wrap comments-center space-x-4" v-show="!isCollapsed && !isEditing">
          <li>
            <!-- If logged in, allow upvoting -->
            <button v-if="isAuthed" class="text-xs font-medium" :class="[
              voteType === 1
                ? 'upvoted text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
            ]" @click="vote(1)">
              <span class="hidden sm:inline">{{ voteType === 1 ? 'Upvoted' : 'Upvote' }} ({{ upvotes }})</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:hidden">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                </path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              <span class="hidden sm:inline">Upvote ({{ comment.upvotes }})</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:hidden">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                </path>
              </svg>
            </NuxtLink>
          </li>
          <li class="list-comment sm:hidden text-md font-bold">
            <span :class="{
              'text-primary': voteType === 1,
              'text-secondary': voteType === -1,
              'text-gray-900 dark:text-gray-300': voteType === 0,
            }">
              {{ comment.score + voteType }}
            </span>
          </li>
          <li>
            <!-- If logged in, allow downvoting -->
            <button v-if="isAuthed" class="text-xs font-medium" :class="[
              voteType === -1
                ? 'downvoted text-secondary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
            ]" @click="vote(-1)">
              <span class="hidden sm:inline">{{ voteType === -1 ? 'Downvoted' : 'Downvote' }} ({{ downvotes }})</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="sm:hidden w-5 h-5">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z">
                </path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              <span class="hidden sm:inline">Downvote ({{ comment.downvotes }})</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="sm:hidden w-5 h-5">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z">
                </path>
              </svg>
            </NuxtLink>
          </li>
          <li v-if="isAuthed && !route.meta.hasRepliesDisabled">
            <button @click="isReplying = true"
              class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="sm:hidden w-6 h-6" width="24" height="24"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 14l-4 -4l4 -4"></path>
                <path d="M5 10h11a4 4 0 1 1 0 8h-1"></path>
              </svg>
              <span class="hidden sm:inline">Reply</span>
            </button>
          </li>
          <li v-if="isAuthed && isAuthor">
            <button @click="isEditing = !isEditing"
              class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="sm:hidden w-6 h-6" width="24" height="24"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                <path d="M16 5l3 3"></path>
              </svg>
              <span class="hidden sm:inline">Edit</span>
            </button>
          </li>
          <li v-if="isAuthed && !isAuthor">
            <button class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
              @click="save" :disabled="isSaving">
              <svg v-if="isSaved" xmlns="http://www.w3.org/2000/svg" class="sm:hidden w-6 h-6" width="24"
                height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 3l18 18"></path>
                <path d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7">
                </path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="sm:hidden w-6 h-6" width="24" height="24"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
              </svg>
              <span class="hidden sm:inline">{{ isSaving ? 'Saving...' : (isSaved ? "Unsave" : "Save") }}</span>
            </button>
          </li>
          <li class="sm:hidden">
            <button @click="openOptions"
              class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
              </svg>
            </button>
          </li>
          <li v-if="isAuthed && isAuthor" class="hidden sm:inline sm:list-comment">
            <button @click="confirmDelete"
              class="text-xs font-medium text-gray-500 hover:text-red-600 dark:text-gray-400">
              Delete
            </button>
          </li>
          <li v-if="isAuthed && !isAuthor" class="hidden sm:inline sm:list-comment">
            <button @click="confirmReport"
              class="text-xs font-medium text-gray-500 hover:text-yellow-600 dark:text-gray-400">
              Report
            </button>
          </li>
          <li class="hidden sm:inline sm:list-comment">
            <NuxtLink
              :to="`${site.enableBoards && comment.board ? '/b/' + comment.board.name + '/p' : '/p'}/${comment.postId}/${parentPost?.titleChunk ?? '-'}/${comment.id}#comment-text-${comment.id}`"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              Permalink
            </NuxtLink>
          </li>
          <li class="hidden sm:inline sm:list-comment">
            <NuxtLink
              :to="`${site.enableBoards && comment.board ? '/b/' + comment.board.name + '/p' : '/p'}/${comment.postId}/${parentPost?.titleChunk ?? '-'}/${comment.id}?context=3#comment-text-${comment.id}`"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              Context
            </NuxtLink>
          </li>
          <li v-if="canMod && !(comment.isRemoved || comment.isDeleted)" class="hidden sm:inline sm:list-comment">
            <button @click="() => confirmRemoveOrApprove(false)"
              class="text-xs font-medium text-gray-500 hover:text-red-600 dark:text-gray-400">
              Remove
            </button>
          </li>
          <li v-if="canMod && comment.isRemoved" class="hidden sm:inline sm:list-comment">
            <button @click="() => confirmRemoveOrApprove(true)"
              class="text-xs font-medium text-gray-500 hover:text-green-600 dark:text-gray-400">
              Approve
            </button>
          </li>
        </ul>
        <!-- Write Form -->
        <div v-if="isAuthed && isReplying" class="relative flex md:space-x-2 mt-4">
          <img loading="lazy" :src="userStore.user!.avatar!" alt="avatar"
            class="hidden md:inline-block flex-shrink-0 w-9 h-9 object-cover sm:p-0.5 sm:border bg-white" />
          <LazyInputsComment :post-id="comment.postId" :parent-id="comment.id" @closed="isReplying = false"
            @comment-published="onCommentPublished" />
        </div>
        <!-- Replies -->
        <!--<LazyListsComments v-if="!route.meta.hasRepliesDisabled &&
          comment.replyCount &&
          level <= limit
          " v-show="!isCollapsed" :comments="comment.replies" :offset="offset" class="relative" />-->
        <LazyListsComments v-show="!isCollapsed" :comments="comment.replies" :offset="offset" class="relative" />
        <!-- Continue Thread Link -->
        <NuxtLink v-if="comment.replyCount && level > limit" v-show="!isCollapsed"
          :to="`/p/${comment.postId}/${parentPost?.titleChunk ?? '-'}/${comment.id}`"
          class="relative inline-block text-primary text-sm hover:underline mt-2">
          Continue thread &#8594;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { useCommentsStore } from "@/stores/StoreComments";
import { usePostsStore } from "@/stores/StorePosts";
import { useSiteStore } from "@/stores/StoreSite";
import { formatDate } from "@/utils/formatDate";
import { requirePermission } from "@/composables/admin";
import { requireModPermission } from "@/composables/mod";
import { useBoardStore } from "@/stores/StoreBoard";
import { useGraphQLMutation } from '@/composables/useGraphQL';
import type { Comment, Post, PostFragment } from "@/types/types";

const route = useRoute();

const modalStore = useModalStore();
const toast = useToastStore();
const site = useSiteStore();
const boardStore = useBoardStore();
// used for getting the parent post
const postStore = usePostsStore();
const modPermissions = boardStore.hasBoard ? boardStore.board?.myModPermissions ?? 0 : 0;

const userStore = useLoggedInUser();
const isAuthed = userStore.isAuthed;

const authCookie = useCookie("token").value;

// const props = defineProps({
//   comment: TComment,
//   offset: {
//     type: Number,
//     default: 0,
//   },
//   limit: {
//     type: Number,
//     default: 3,
//   },
// });

const props = defineProps<{
  comment: Comment;
  offset?: number;
  limit?: number;
}>();

//const comment = ref(props.comment);
const comment = ref(props.comment);
const offset = props.offset ?? 0;
const limit = props.limit ?? 0;
//const commentsStore = useCommentsStore();
//commentsStore.comments.push(props.comment);

const isReplying = ref(false);
const isCollapsed = ref(false);

// take comment level and subtract offset (depth) to get relative level
const level = computed(() => {
  return comment.value!.level - offset;
});

// in some queries, we request the parent post
// if we don't, it can be obtained from the post store (in post pages, it's the only post in the store)
const parentPost: PostFragment | undefined = comment.value.post ?? postStore.getPost(comment.value.postId);

const onCommentPublished = (newComment: Comment) => {
  // Append reply to list of replies.
  comment.value!.replies!.unshift({
    ...newComment,
    replies: []
  });

  // Close the reply form.
  toggleReplying();
  // Navigate to comment if replies are hidden.
  if (route.meta.hasRepliesDisabled) {
    navigateTo(
      `/p/${comment.value!.postId}/${comment.value!.parentId}/#${comment.value!.id}`
    );
  }
};

// Vote
const voteType = ref(comment.value!.myVote);
const vote = async (type = 0) => {
  const previousVote = voteType.value;
  voteType.value = voteType.value === type ? 0 : type;

  try {
    const { data: result } = await useGraphQLMutation(`
      mutation voteOnComment($id: Int!, $voteType: Int!) {
        voteOnComment(id: $id, voteType: $voteType) {
          score
          upvotes
          downvotes
          myVote
        }
      }
    `, {
      variables: {
        id: comment.value!.id,
        voteType: voteType.value
      }
    });

    if (result.value?.voteOnComment) {
      // Update comment score from response
      if (comment.value!.score !== undefined) {
        comment.value!.score = result.value.voteOnComment.score;
      }
    }
  } catch (error) {
    // Revert failed vote & show error toast
    voteType.value = previousVote;
    toast.addNotification({
      header: "Vote failed",
      message: error.message || "Your vote failed to cast. Please try again.",
      type: "error",
    });
    console.error(error);
  }
};

const score = computed(() => {
  // return comment.value.score + (comment.value.myVote + voteType.value === 0 ? 0 : voteType.value) || 0
  return comment.value!.score + voteType.value;
});

// TODO: figure this out
const isOP = computed(() => (parentPost?.creatorId ?? -1) === comment.value.creatorId);

const upvotes = computed(() => voteType.value == 1 ? comment.value.upvotes + 1 : comment.value.upvotes);
const downvotes = computed(() => voteType.value == -1 ? comment.value.downvotes + 1 : comment.value.downvotes);

// Author
const isAuthor = computed(() => {
  if (userStore.user && comment.value.creator) {
    return userStore.user.name === comment.value.creator.name;
  } else {
    return false;
  }
});

// Mod
const canMod = requirePermission("content") || requireModPermission(modPermissions, "content");

// Edit
const isEditing = ref(false);
const onHasEdited = (payload: {
  newBody: string;
  newBodyHTML: string;
}) => {
  // Update comment with saved edits.
  comment.value.body = payload.newBody;
  comment.value.bodyHTML = payload.newBodyHTML;
};

// Save
const isSaved = ref(comment.value.isSaved);
const isSaving = ref(false);

const save = async () => {
  const previousSaved = isSaved.value;
  isSaved.value = !isSaved.value;
  isSaving.value = true;

  try {
    const { data: result } = await useGraphQLMutation(`
      mutation saveComment($commentId: Int!, $save: Boolean!) {
        saveComment(commentId: $commentId, save: $save) {
          isSaved
        }
      }
    `, {
      variables: {
        commentId: comment.value.id,
        save: isSaved.value
      }
    });

    if (result.value?.saveComment) {
      // Update comment save status from response
      comment.value.isSaved = result.value.saveComment.isSaved;
      isSaved.value = result.value.saveComment.isSaved;

      toast.addNotification({
        header: `Comment ${isSaved.value ? 'saved' : 'unsaved'}`,
        message: `Comment ${isSaved.value ? 'saved' : 'unsaved'} successfully.`,
        type: "success",
      });
    }
  } catch (error) {
    // Revert failed save & show error toast
    isSaved.value = previousSaved;
    toast.addNotification({
      header: "Save failed",
      message: error.message || `Failed to ${!previousSaved ? 'save' : 'unsave'} comment. Please try again.`,
      type: "error",
    });
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};

// Delete
const confirmDelete = () => {
  modalStore.setModal({
    modal: "ModalDelete",
    id: comment.value.id,
    contentType: "comment",
    isOpen: true,
  });
};

// Report
const confirmReport = () => {
  modalStore.setModal({
    modal: "ModalReport",
    id: comment.value.id,
    contentType: "comment",
    isOpen: true,
  });
};

// Remove
const confirmRemoveOrApprove = (approve: boolean) => {
  modalStore.setModal({
    modal: "ModalRemoveOrApprove",
    id: comment.value.id,
    contentType: "comment",
    isOpen: true,
    options: {
      approve
    }
  });
};

// Options
const openOptions = () => {
  modalStore.setModal({
    modal: "ModalOptions",
    id: comment.value.id,
    contentType: "comment",
    isOpen: true,
    options: {
      object: comment
    }
  });
};

// utils
const toggleReplying = () => {
  isReplying.value = !isReplying.value;
};
</script>

<style scoped>
:target::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 0;
  animation: blinker 3000ms ease-out forwards;
  pointer-events: none;
  @apply w-full h-full bg-yellow-100;
}

:target * {
  position: relative;
  z-index: 1;
}

/* Comment Body */
.comment-body {
  @apply prose prose-sm break-words text-gray-900 max-w-none;
}

.comment-body :deep(p:first-of-type) {
  @apply mt-0;
}

.comment-body :deep(img) {
  max-width: 100px;
  aspect-ratio: auto;
}

@media (min-width: 768px) {
  .comment-body :deep(img) {
    max-width: 320px;
  }
}

/* Collapse Bar */
.comment-collapse-bar {
  @apply cursor-pointer;
}

.comment-collapse-bar:hover::before {
  @apply border-primary;
}

.comment-collapse-bar::before {
  content: "";
  left: calc(50% - 0.5px);
  width: 14px;
  height: calc(100% - 24px);
  @apply absolute bottom-0 border-l border-gray-300;
}

/* Animation */
@keyframes blinker {
  from {
    opacity: 100;
  }

  to {
    opacity: 0;
  }
}
</style>
