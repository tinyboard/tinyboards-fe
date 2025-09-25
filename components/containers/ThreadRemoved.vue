<template>
  <div class="relative w-full flex flex-col sm:space-y-6">
    <!-- Alert -->
    <div
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mb-2.5 sm:mb-0 p-2.5 text-center sm:text-left border-y sm:border-x sm:rounded-md sm:shadow-inner-white"
      :class="[post.isDeleted ? 'text-yellow-900 bg-yellow-100 border-yellow-300' : 'text-red-900 bg-red-100 border-red-300']"
    >
      <svg xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-trash hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4" width="24" height="24"
        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 7l16 0"></path>
        <path d="M10 11l0 6"></path>
        <path d="M14 11l0 6"></path>
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
      </svg>
      <div>
        <strong>This post was {{ post.isDeleted ? "deleted by the author" : "removed by moderators" }}</strong>
        <br />
        <p v-if="post.isDeleted" class="text-sm text-yellow-800">
          All interactions with this post are locked. The deletion of a post cannot be undone.
        </p>
        <p v-else class="text-sm text-red-800">
          Moderators and admins may remove posts that violate {{ site.name }} rules.
        </p>
      </div>
    </div>
    <!-- Post Body -->
    <div
      class="sm:order-2 w-full mb-2.5 sm:mb-0 sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded-md"
    >
      <!-- Post Meta Information & Content -->
      <div
        class="flex flex-shrink-0 items-center justify-between p-2.5 sm:p-0 border-b sm:border-0 dark:border-gray-700 dark:border-opacity-70"
      >
        <div class="flex items-center w-full overflow-x-auto">
          <!-- "Avatar" -->
          <div class="mr-2 flex flex-shrink-0 h-9 w-9 rounded border-dashed border-2 border-gray-400 justify-center items-center bg-white dark:bg-gray-700">
              <svg class="w-4 h-4 md:w-6 md:h-6 text-gray-400"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7" /><path d="M10 10h.01" /><path d="M14 10h.01" /></svg>
          </div>
          <div class="flex flex-col leading-4">
            <span class="text-sm text-gray-500 font-semibold">Deleted User</span>
            <p class="flex items-center space-x-2 text-sm mt-1 text-gray-400">
              <!-- Timestamp -->
              <span>{{ formatDate(new Date(post.creationDate)) }}</span>
              <!-- Ratio -->
              <span>
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="pl-2"> {{ percentUpvoted }}% upvoted </span>
              </span>
              <!-- Tags -->
              <span v-if="post.isNSFW" title="This post is marked 18+">
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="badge badge-red">18+</span>
              </span>
            </p>
          </div>
        </div>
        <button
          class="flex items-center justify-center md:hidden -mr-1 p-1 text-gray-600 dark:text-gray-400"
        >
          <i class="far fa-ellipsis-h fa-fw fa-lg"></i>
        </button>
      </div>
      <!-- Post Content -->
      <div class="sm:mt-4 p-2.5 sm:p-0">
        <!-- Title -->
        <h1
          class="text-lg md:text-xl leading-normal font-semibold text-primary dark:text-gray-100"
        >
          {{ post.title }}
        </h1>
        <!-- Post Text Body -->
        <div class="text-gray-800 opacity-60 text-md my-4">
            Post {{ post.isDeleted ? "deleted by creator" : "removed by moderator" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
});

import { reactive, computed } from "vue";
// import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { usePost } from "@/composables/post";
import { usePostComments } from "@/composables/comments";
import { useSave } from "@/composables/useSave";
// import { useAPI } from "@/composables/api"; // Removed - no longer used
import { useSubscribe } from "@/composables/useSubscribe";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { formatDate } from "@/utils/formatDate";
import { toPercent } from "@/utils/percent";
import { useSiteStore } from "@/stores/StoreSite";

const modalStore = useModalStore();
const toast = useToastStore();

const route = useRoute();
const userStore = useLoggedInUser();
const site = useSiteStore();

const isAuthed = userStore.isAuthed;
const authCookie = useCookie("token").value;

// Define post actions
// const { voteType, vote } = useVote();
const { isSaved, save } = useSave(props.post.saved);
const { isSubscribed, subscribe } = useSubscribe(props.post.board?.subscribedType === 'subscribed');

// Voting
// let voteType = ref(props.item.my_vote);

// Utils
const percentUpvoted = computed(() => {
  const num = 1 - props.post.downvotes / props.post.upvotes;
  if (!isFinite(num)) return 0;
  return toPercent(num);
});
</script>

<style scoped>
.upvoted > svg {
  fill: rgba(var(--color-primary));
}
.upvote:active > svg,
.downvote:active > svg {
  transform: translateY(-8px);
  transition: transform 200ms cubic-bezier(0.1, -0.5, 0.6, 1.2);
}
.downvote:active > svg {
  transform: translateY(8px);
}
.downvoted > svg {
  fill: rgba(var(--color-secondary));
}
</style>
