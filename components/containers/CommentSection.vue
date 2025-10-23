<template>
	<!-- Comment Section -->
	<div v-if="post" id="comments" class="mt-4 order-last flex flex-col">
		<!-- Comment Count & Sort Menu -->
		<div class="flex items-center sm:mb-4 p-2.5 sm:p-4 bg-gray-100 sm:border sm:shadow-inner-white sm:rounded-md">
			<p>
				<strong class="text-base leading-4 dark:text-gray-100">
					{{
						post.commentCount === 1
							? "1 comment"
							: `${post.commentCount} comments`
					}}
				</strong>
			</p>
			<MenusSort :sorts="sorts" isLeft class="ml-auto" />
		</div>
		<!-- Single Discussion Alert -->
		<div v-if="!!route.params?.comment"
			class="flex items-center justify-center sm:justify-start mb-2.5 sm:mb-4 p-2.5 text-center sm:text-left text-yellow-900 bg-yellow-100 border-y sm:border-x border-yellow-300 sm:rounded-md sm:shadow-inner-white">
			<p class="text-sm text-yellow-800">
				You are viewing a single conversation.
				<NuxtLink :to="post.urlPath || `${site.enableBoards && post.board ? '/b/' + post.board.name + '/p' : '/p'}/${post.id}/${post.slug || post.titleChunk || 'post'}`"
					class="text-yellow-800">
					<strong>View the entire thread &#8594;</strong>
				</NuxtLink>
			</p>
		</div>

		<!-- Comments & States -->
		<div id="comments" class="bg-white p-2.5 sm:p-4 sm:shadow-inner-xs sm:rounded-md border-y sm:border-x"
			style="scroll-margin-top: 7rem;">
			<!-- Write Form -->
			<div v-if="isAuthed && !isReplyingDisabled && !route.params?.comment" class="flex md:space-x-2 mb-2 sm:mb-0">
				<!-- Avatar -->
				<img loading="lazy" :src="userStore.user!.avatar!" alt="avatar"
					class="hidden md:inline-block flex-shrink-0 w-9 h-9 object-cover rounded" />
				<!-- Input -->
				<LazyInputsComment :post-id="post.id" :parent-id="null" @comment-published="onCommentPublished" />
			</div>
			<!-- Comments -->
			<LazyListsComments v-if="comments.length" :comments="comments"
				:offset="!!route.params?.comment ? 3 : null" />
			<!-- Empty -->
			<div v-else-if="comments.length === 0" class="px-4 py-24 text-center text-gray-400">
				<p>
					<span class="font-medium">This comment section is empty...</span>
					<br />
					Awkward...
				</p>
			</div>
			<!-- Error -->
			<div v-else class="px-4 py-24 text-center text-gray-400">
				<p>An unknown error occured.</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	post: Post;
}>();

import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from '@/stores/StoreSite';
import { useBoardStore } from "@/stores/StoreBoard";
import { ref, reactive, watch } from "vue";
import { requirePermission } from "@/composables/admin";
import { requireModPermission } from "@/composables/mod";
import type { Comment, Post } from "@/types/types";

const route = useRoute();

const site = useSiteStore();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();

const modPermissions = !!boardStore.board ? boardStore.board?.myModPermissions : -1;
const isAuthed = userStore.isAuthed;

const isModOrAdmin = requirePermission("content") || requireModPermission(modPermissions, "content")

// Create a reactive copy of comments that can be safely modified
const comments = ref<Comment[]>(props.post.comments || []);

// Watch for changes to the post's comments and update our reactive copy
watch(() => props.post.comments, (newComments) => {
  if (newComments) {
    comments.value = [...newComments];
  }
}, { immediate: true });

const isReplyingDisabled = ref(
	!isModOrAdmin && (props.post.isRemoved || props.post.isDeleted || props.post.isLocked)
);

// Comment sort options
const sorts = [
	{
		name: "Hot",
		key: "hot",
		href: { path: route.fullPath, query: { ...route.query, sort: "hot" } },
	},
	{
		name: "Latest",
		key: "new",
		href: { path: route.fullPath, query: { ...route.query, sort: "new" } },
	},
	{
		name: "Oldest",
		key: "old",
		href: { path: route.fullPath, query: { ...route.query, sort: "old" } },
	},
	{
		name: "Top All",
		key: "top",
		href: { path: route.fullPath, query: { ...route.query, sort: "top" } },
	},
];

function onCommentPublished(comment: Comment) {
	comment.replies = [];

	// If this is a top-level comment (no parentId), add to main comments array
	if (!comment.parentId) {
		comments.value.unshift(comment);
	} else {
		// This is a reply - find the parent comment and add to its replies
		const findAndAddToParent = (commentsArray: Comment[]): boolean => {
			for (const existingComment of commentsArray) {
				if (existingComment.id === comment.parentId) {
					// Found the parent, add reply to its replies array
					if (!existingComment.replies) {
						existingComment.replies = [];
					}
					existingComment.replies.unshift(comment);
					return true;
				}
				// Recursively search in replies
				if (existingComment.replies && existingComment.replies.length > 0) {
					if (findAndAddToParent(existingComment.replies)) {
						return true;
					}
				}
			}
			return false;
		};

		// Try to find the parent and add the reply
		if (!findAndAddToParent(comments.value)) {
			console.warn('Could not find parent comment with ID:', comment.parentId);
			// Fallback: add to top level if parent not found
			comments.value.unshift(comment);
		}
	}
};
</script>