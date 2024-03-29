<template>
  <div class="relative w-full flex flex-col sm:space-y-6">
    <!-- Alert -->
    <div
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mb-2.5 sm:mb-0 p-2.5 text-center sm:text-left text-yellow-900 bg-yellow-100 border-y sm:border-x border-yellow-300 sm:rounded-md sm:shadow-inner-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <rect x="5" y="11" width="14" height="10" rx="2"></rect>
        <circle cx="12" cy="16" r="1"></circle>
        <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
      </svg>
      <div>
        <strong>This post was deleted by the author</strong>
        <br />
        <p class="text-sm text-yellow-800">
          Discussion and voting has been locked
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
          <!-- Avatar -->
          <img
            src=""
            alt="avatar"
            class="mr-2 flex-shrink-0 w-9 h-9 object-cover rounded"
          />
          <div class="flex flex-col leading-4">
            <span class="text-sm text-gray-400 dark:text-gray-200 font-bold">
              deleted
            </span>
            <p class="flex items-center space-x-2 text-sm mt-1 text-gray-400">
              <!-- Timestamp -->
              <span>{{ formatDate(new Date(item.post.creation_date)) }}</span>
              <span v-if="item.post.edited_date">
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="pl-1 italic">
                  Edited {{ formatDate(new Date(item.post.edited_date)) }}
                </span>
              </span>
              <!-- Ratio -->
              <span>
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="pl-2"> {{ percentUpvoted }}% upvoted </span>
              </span>
              <!-- Tags -->
              <span v-if="item.post.is_nsfw" title="This post is marked 18+">
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="badge badge-red">18+</span>
              </span>
            </p>
          </div>
        </div>
        <div class="hidden md:block">
          <!-- External Link Icon -->
          <a
            v-if="item.post.url && item.post.type === 'link'"
            :href="item.post.url"
            target="_blank"
            class="block"
          >
            <i class="far fa-external-link text-gray-400"></i>
          </a>
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
          class="text-lg md:text-xl leading-normal font-bold dark:text-gray-100"
        >
          {{ item.post.title }}
        </h1>
        <!-- Post Text Body -->
        <div
          v-if="item.post.body_html"
          class="mt-2.5 sm:mt-4 relative overflow-hidden"
        >
          <div
            class="prose prose-sm text-gray-900 max-w-none"
            v-html="item.post.body_html"
          ></div>
        </div>
      </div>
    </div>
    <!-- Comment Section -->
    <div class="order-3 flex flex-col p-2.5 sm:p-0 bg-white sm:bg-transparent">
      <!-- Comment Count & Sort Menu -->
      <div
        class="flex items-center mb-4 p-2.5 sm:p-4 bg-gray-100 border-y sm:border-x shadow-inner-white sm:rounded-md"
      >
        <strong class="text-base leading-4 dark:text-gray-100">
          {{
            item.counts.comments === 1
              ? "1 comment"
              : `${item.counts.comments} comments`
          }}
        </strong>
        <MenusSort :sorts="sorts" class="ml-auto" />
      </div>
      <!-- Comments & States -->
      <div
        class="bg-white p-2.5 sm:p-4 sm:shadow-inner-xs sm:rounded-md border-y sm:border-x"
      >
        <!-- Comments -->
        <ListsComments
          v-if="comments.length"
          :comments="comments"
          :offset="offset"
        />
        <!-- Empty State -->
        <div
          v-if="comments.length === 0"
          class="px-4 py-24 text-center text-gray-400"
        >
          <p class="font-medium">
            No comments
          </p>
        </div>
        <!-- Error State -->
        <div
          v-else-if="commentsError"
          class="px-4 py-24 text-center text-gray-400"
        >
          <p>An unknown error occured.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
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
import { useSave } from "@/composables/save";
import { useApi } from "@/composables/api";
import { useSubscribe } from "@/composables/subscribe";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { formatDate } from "@/utils/formatDate";
import { toPercent } from "@/utils/percent";

const modalStore = useModalStore();
const toast = useToastStore();

const route = useRoute();
const userStore = useLoggedInUser();

const isAuthed = userStore.isAuthed;
const authCookie = useCookie("token").value;

// Define post actions
// const { voteType, vote } = useVote();
const { isSaved, save } = useSave();
const { isSubscribed, subscribe } = useSubscribe();

// Voting
// let voteType = ref(props.item.my_vote);

const vote = async (type = 0) => {
  voteType.value = voteType.value === type ? 0 : type;

  await useApi(`/post/${props.item.post.id}/vote`, {
    method: "post",
    body: {
      score: voteType,
    }
  }).then(({ data }) => {
    if (data.value) {
      data = JSON.parse(JSON.stringify(data.value));
      console.log(data);
    } else {
      // Revert failed vote & show error toast.
      setTimeout(() => {
        voteType.value = 0;
        toast.addNotification({
          header: "Vote failed",
          message: "Your vote failed to cast. Please try again.",
          type: "error",
        });
      }, 400);
      // Log the error.
      console.log(error);
    }
  });
};

// Comments
const onCommentPublished = (comment) => {
  props.comments.unshift(comment);
};

// Utils
const percentUpvoted = computed(() => {
  const num = 1 - props.item.counts.downvotes / props.item.counts.upvotes;
  if (!isFinite(num)) return 0;
  return toPercent(num);
});

// Author
const isAuthor = computed(() => {
  if (userStore.user && item.creator) {
    return userStore.user.name === item.creator.name;
  } else {
    return false;
  }
});

// Edit
const isEditing = ref(false);

// Delete
const confirmDelete = () => {
  modalStore.setModal({
    modal: "ModalDelete",
    id: props.item.post.id,
    contentType: "post",
    isOpen: true,
  });
};

// Report
const confirmReport = () => {
  modalStore.setModal({
    modal: "ModalReport",
    id: props.item.post.id,
    contentType: "post",
    isOpen: true,
  });
};
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
