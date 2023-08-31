<template>
  <div>
    <p v-if="route.meta.hasRepliesDisabled" class="mb-1">
      <NuxtLink :href="`/post/${item.post.id}/${comment.id}?context=2`">
        {{ item.post.title }}
      </NuxtLink>
    </p>
    <div :id="comment.id" class="comment group flex relative" :class="{
      'opacity-60 hover:opacity-100 focus:opacity-100 items-center':
        isCollapsed,
    }" style="scroll-margin-top: 7rem;">
      <!-- Stretched Click Area -->
      <div v-show="isCollapsed" class="absolute w-full h-full inset z-20 cursor-pointer"
        @click="isCollapsed = !isCollapsed"></div>
      <!-- Comment -->
      <div class="relative flex flex-col flex-shrink-0 items-center mr-2">
        <!-- User Avatar -->
        <NuxtLink v-if="item.creator"
          :to="`/@${item.creator.name}${item.creator.instance ? '@' + item.creator.instance : ''}`" class="z-10">
          <img loading="lazy" :src="item.creator.avatar || 'https://placekitten.com/36/36'" alt="avatar"
            class="flex-shrink-0 object-cover w-6 h-6 md:w-9 md:h-9 rounded" />
        </NuxtLink>
        <!-- Comment Collapse Bar -->
        <div class="comment-collapse-bar dark:opacity-30 dark:hover:opacity-100" @click="isCollapsed = !isCollapsed"
          v-show="!isCollapsed"></div>
      </div>
      <!-- User Details -->
      <div class="flex-grow" :class="{ 'flex items-center': isCollapsed }">
        <div :class="{ 'flex flex-grow items-center leading-none': isCollapsed }">
          <div class="flex items-center min-h-[24px] sm:min-h-[36px]">
            <div class="inline-flex flex-wrap space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <NuxtLink v-if="item.creator"
                :to="`/@${item.creator.name}${item.creator.instance ? '@' + item.creator.instance : ''}`"
                class="flex items-center text-sm">
                <strong>{{ item.creator.name }}</strong>
                <span v-if="item.creator.instance">@{{ item.creator.instance }}</span>
                <!-- Role -->
                <span v-if="item.creator.is_admin" class="ml-1 badge badge-red">Admin</span>
              </NuxtLink>
              <!-- Parent Context Link -->
              <!--<NuxtLink v-if="comment.parent_id" :to="`#${comment.parent_id}`" v-show="!isCollapsed" class="flex items-center align-middle text-gray-400 hover:text-gray-600">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								   <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
								</svg>
								<span>"parent author"</span>
							</NuxtLink>-->
              <span v-show="!isCollapsed" class="flex items-center space-x-2">
                <!-- Timestamp -->
                <span :title="comment.creation_date">{{
                  formatDate(new Date(comment.creation_date))
                }}</span>
                <!-- Edited Timestamp -->
                <span v-if="comment.updated">
                  <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                  <span :title="comment.updated" class="pl-1 italic">
                    Edited {{ formatDate(new Date(comment.updated)) }}
                  </span>
                </span>
              </span>
              <!-- Score -->
              <span :title="`+${item.counts.upvotes} | -${item.counts.downvotes}`" class="flex items-center space-x-2">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span>
                  {{ score }}
                  {{ score ** 2 === 1 ? "pt" : "pts" }}
                </span>
              </span>
              <!-- Reply Count -->
              <span v-show="isCollapsed && item.replies.length" class="flex items-center space-x-2">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span>
                  {{ item.replies.length }}
                  {{ item.replies.length === 1 ? "reply" : "replies" }}
                </span>
              </span>
              <span class="ml-2 text-red-500 text-xs" v-if="item.comment.is_removed && isAdmin" title="Removed comment">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline ml-1" width="20" height="20" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M13.593 19.855a9.96 9.96 0 0 1 -5.893 -.855l-4.7 1l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c2.128 1.816 3.053 4.363 2.693 6.813">
                  </path>
                  <path d="M22 22l-5 -5"></path>
                  <path d="M17 22l5 -5"></path>
                </svg>
              </span>
              <span class="ml-2 text-yellow-500 text-xs" v-else-if="item.comment.is_deleted && isAdmin"
                title="Deleted comment">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline ml-1" width="20" height="20" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 7l16 0"></path>
                  <path d="M10 11l0 6"></path>
                  <path d="M14 11l0 6"></path>
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                </svg>
              </span>
              <!-- Report count -->
              <span class="ml-2 text-orange-400 font-bold text-xs" v-if="item.report_count"
                :title="`${item.report_count} report(s)`">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline ml-1" width="20" height="20" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
                </svg>
                {{ item.report_count }}
              </span>
            </div>
          </div>
          <!-- Comment Edit Form -->
          <LazyInputsEdit v-if="isEditing" :id="comment.id" :body="comment.body" type="comment" @hasEdited="onHasEdited"
            @closed="isEditing = false" />
          <!-- Comment Text Body -->
          <div class="comment-body"
            :class="isAdmin && item.comment.is_removed ? 'bg-red-400 bg-opacity-40' : 'bg-white dark:bg-gray-800'"
            v-show="!isCollapsed && !isEditing" v-html="comment.body_html"></div>
        </div>
        <!-- Comment Reports -->
        <div v-if="item.report_count" class="mb-2">
          <CardsReports :id="item.comment.id" type="comment" />
        </div>
        <!-- Comment Actions -->
        <ul class="relative flex flex-grow flex-wrap items-center space-x-4" v-show="!isCollapsed && !isEditing">
          <li>
            <!-- If logged in, allow upvoting -->
            <button v-if="isAuthed" class="text-xs font-medium" :class="[
              { 'cursor-not-allowed': item.post.is_deleted },
              voteType === 1
                ? 'upvoted text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
            ]" @click="vote(1)" :disabled="item.post.is_deleted">
              <span class="hidden sm:inline">{{ voteType === 1 ? 'Upvoted' : 'Upvote' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:hidden">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                </path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login" class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              <span class="hidden sm:inline">Upvote</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:hidden">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                </path>
              </svg>
            </NuxtLink>
          </li>
          <li class="list-item sm:hidden text-md font-bold">
            <span :class="{
              'text-primary': voteType === 1,
              'text-secondary': voteType === -1,
              'text-gray-900 dark:text-gray-300': voteType === 0,
            }">
              {{ item.counts.score + voteType }}
            </span>
          </li>
          <li>
            <!-- If logged in, allow downvoting -->
            <button v-if="isAuthed" class="text-xs font-medium" :class="[
              { 'cursor-not-allowed': item.post.is_deleted },
              voteType === -1
                ? 'downvoted text-secondary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
            ]" @click="vote(-1)" :disabled="item.post.is_deleted">
              <span class="hidden sm:inline">{{ voteType === -1 ? 'Downvoted' : 'Downvote' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="sm:hidden w-5 h-5">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z">
                </path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login" class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              <span class="hidden sm:inline">Downvote</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="sm:hidden w-5 h-5">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z">
                </path>
              </svg>
            </NuxtLink>
          </li>
          <li v-if="isAuthed &&
            !route.meta.hasRepliesDisabled &&
            !item.post.locked &&
            !item.post.is_deleted
            ">
            <button @click="isReplying = true"
              class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="sm:hidden w-6 h-6" width="24" height="24" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
              <svg xmlns="http://www.w3.org/2000/svg" class="sm:hidden w-6 h-6" width="24" height="24" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                <path d="M16 5l3 3"></path>
              </svg>
              <span class="hidden sm:inline">Edit</span>
            </button>
          </li>
          <li class="sm:hidden">
            <button @click="openOptions" class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
              </svg>
            </button>
          </li>
          <li v-if="isAuthed" class="hidden sm:list-item">
            <button class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400" @click="save">
              {{ isSaved ? "Unsave" : "Save" }}
            </button>
          </li>
          <li v-if="isAuthed && isAuthor" class="hidden sm:list-item">
            <button @click="confirmDelete"
              class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Delete
            </button>
          </li>
          <li v-if="isAuthed && !isAuthor" class="hidden sm:list-item">
            <button @click="confirmReport"
              class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Report
            </button>
          </li>
          <li class="hidden sm:list-item">
            <NuxtLink :to="`/post/${item.post.id}/${item.comment.id}`"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              Permalink
            </NuxtLink>
          </li>
          <li class="hidden sm:list-item">
            <NuxtLink :to="`/post/${item.post.id}/${item.comment.id}?context=3`"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
              Context
            </NuxtLink>
          </li>
          <li v-if="isAdmin && !item.comment.is_removed" class="hidden sm:list-item">
            <button @click="() => confirmRemoveOrApprove(false)"
              class="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400">
              Remove
            </button>
          </li>
          <li v-if="isAdmin && (item.report_count || item.comment.is_removed)" class="hidden sm:list-item">
            <button @click="() => confirmRemoveOrApprove(true)"
              class="text-xs font-medium text-green-500 hover:text-green-700 dark:text-green-400">
              Approve
            </button>
          </li>
        </ul>
        <!-- Write Form -->
        <div v-if="isAuthed && isReplying" class="relative flex md:space-x-2 mt-4">
          <img loading="lazy" :src="userStore.user.avatar" alt="avatar"
            class="hidden md:inline-block flex-shrink-0 w-9 h-9 object-cover sm:p-0.5 sm:border bg-white" />
          <LazyInputsComment :post-id="item.comment.post_id" :parent-id="item.comment.id" @closed="isReplying = false"
            @comment-published="onCommentPublished" />
        </div>
        <!-- Replies -->
        <LazyListsComments v-if="!route.meta.hasRepliesDisabled &&
          item.replies.length &&
          level <= limit
          " v-show="!isCollapsed" :comments="item.replies" :offset="offset" class="relative" />
        <!-- Continue Thread Link -->
        <NuxtLink v-if="item.replies.length && level > limit" v-show="!isCollapsed"
          :to="`/post/${item.post.id}/${comment.id}`"
          class="relative inline-block text-primary text-sm hover:underline mt-2">
          Continue thread &#8594;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { useCommentsStore } from "@/stores/StoreComments";
import { formatDate } from "@/utils/formatDate";
import { useApi } from "@/composables/api";

const route = useRoute();

const modalStore = useModalStore();
const toast = useToastStore();

const userStore = useLoggedInUser();
const isAuthed = userStore.isAuthed;

const authCookie = useCookie("token").value;

const props = defineProps({
  item: Object,
  offset: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 3,
  },
});

const item = ref(props.item);
const comment = ref(props.item.comment);

const commentsStore = useCommentsStore();
commentsStore.comments.push(props.item);

const isReplying = ref(false);
const isCollapsed = ref(false);

// take comment level and subtract offset (depth) to get relative level
const level = computed(() => {
  return comment.value.level - props.offset;
});

const onCommentPublished = (comment) => {
  // Append reply to list of replies.
  item.value.replies.unshift(comment);
  // Close the reply form.
  toggleReplying();
  // Navigate to comment if replies are hidden.
  if (route.meta.hasRepliesDisabled) {
    navigateTo(
      `/post/${item.value.post.id}/${comment.comment.parent_id}/#${comment.comment.id}`
    );
  }
};

// Vote
const voteType = ref(item.value.my_vote);
const vote = async (type = 0) => {
  voteType.value = voteType.value === type ? 0 : type;

  await useApi(`/comment/${comment.value.id}/vote`, {
    method: "post",
    body: {
      score: voteType,
    },
  }).then(({ data, error }) => {
    if (data.value) {
      data = JSON.parse(JSON.stringify(data.value));
      console.log(data);
    } else {
      // Revert failed vote & show error toast.
      setTimeout(() => {
        voteType.value = item.value.my_vote;
        toast.addNotification({
          header: "Vote failed",
          message: "Your vote failed to cast. Please try again.",
          type: "error",
        });
      }, 400);
      // Log the error.
      console.log(error.value);
    }
  });
};

const score = computed(() => {
  // return item.value.counts.score + (item.value.my_vote + voteType.value === 0 ? 0 : voteType.value) || 0
  return item.value.counts.score + voteType.value;
})

// Author
const isAuthor = computed(() => {
  if (userStore.user && item.value.creator) {
    return userStore.user.name === item.value.creator.name;
  } else {
    return false;
  }
});

// Admin
const isAdmin = computed(() => {
  return !!userStore.user && userStore.user.is_admin;
});

// Edit
const isEditing = ref(false);
const onHasEdited = (payload) => {
  // Update comment with saved edits.
  comment.value = payload.comment_view.comment;
};

// Save
const isSaved = ref(comment.value.saved);
const save = async () => {
  isSaved.value = !isSaved.value;
  await useApi(`/comment/${comment.value.id}/save`, {
    method: "post",
    body: {
      save: !isSaved.value,
    }
  }).then(({ data, error }) => {
    if (data.value) {
      data = JSON.parse(JSON.stringify(data.value));
    } else {
      // Revert failed save & show error toast.
      setTimeout(() => {
        isSaved.value = false;
        toast.addNotification({
          header: "Saving failed",
          message: "Failed to save the comment. Please try again.",
          type: "error",
        });
      }, 400);
      // Log the error.
      console.error(error.value);
    }
  });
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
const confirmRemoveOrApprove = approve => {
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
      object: item
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
