<template>
	<form @submit.prevent="submitComment" class="comment-form relative flex flex-col w-full">
		<!-- Application Not Approved Warning -->
		<div v-if="isBlockedFromCommenting" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
			<div class="flex items-start">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-2">
					<h3 class="text-xs font-bold text-red-800">Account Pending Approval</h3>
					<p class="mt-1 text-xs text-red-700">
						You cannot comment until your account is approved by an administrator.
					</p>
				</div>
			</div>
		</div>

		<!-- TipTap Editor -->
		<Tiptap
			v-model="body"
			placeholder="Write a comment..."
			:disabled="isBlockedFromCommenting"
			:board-id="boardId"
			height="200px"
		/>

		<!-- Action Buttons -->
		<div class="mt-2 flex justify-between w-full">
			<div class="flex items-center">
				<!-- Empty div to maintain layout -->
				<div></div>
			</div>
			<div class="flex">
				<button v-if="parentId" type="button" class="ml-2 button white w-24" @click="close">Cancel</button>
				<button class="button primary min-w-[96px] ml-2" :class="{ 'loading': isLoading }" :disabled="isLoading || authStore.isApplicationAccepted === false">
					{{ parentId ? 'Reply' : 'Comment' }}
				</button>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { useToastStore } from '@/stores/StoreToast';
import { useCommentsStore } from "@/stores/StoreComments";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useGraphQLMutation } from "@/composables/useGraphQL";
import { useBoardStore } from "@/stores/StoreBoard";
import Tiptap from './Tiptap.vue';

const props = defineProps<{
	parentId?: number;
	postId?: number;
}>();

const boardStore = useBoardStore();
const boardId = computed(() => boardStore.board?.id);

// Define emit
const emit = defineEmits(['closed', 'commentPublished']);
const toast = useToastStore();
const commentsStore = useCommentsStore();
const authStore = useLoggedInUser();

const body = ref("");
const isLoading = ref(false);

// Check if user has a pending application that hasn't been approved
// The backend logic: blocks if (is_application_accepted = false AND has_pending_application = true)
// Old users (before application mode): is_application_accepted = false, has_pending_application = false = can post
// New users with pending apps: is_application_accepted = false, has_pending_application = true = blocked
const isBlockedFromCommenting = computed(() => {
	return authStore.isApplicationAccepted === false && authStore.hasPendingApplication === true;
});

const close = () => {
	emit('closed');
};

// Submit comment
function submitComment() {
	// Check if user's application is approved
	if (authStore.isApplicationAccepted === false) {
		toast.addNotification({
			header: 'Account Not Approved',
			message: 'Your account application has not been approved yet. Please wait for an administrator to review your application.',
			type: 'error'
		});
		return;
	}

	// Validate required fields
	if (!body.value.trim()) {
		toast.addNotification({
			header: 'Comment failed',
			message: 'Comment body cannot be empty.',
			type: 'error'
		});
		return;
	}

	// For top-level comments, we need postId
	// For replies, we need both postId and parentId
	if (!props.postId) {
		toast.addNotification({
			header: 'Comment failed',
			message: 'Missing post ID.',
			type: 'error'
		});
		return;
	}

	isLoading.value = true;

	const mutation = `
		mutation CreateComment($replyToPostId: Int, $replyToCommentId: Int, $body: String!) {
			createComment(replyToPostId: $replyToPostId, replyToCommentId: $replyToCommentId, body: $body) {
				id
				body
				bodyHTML
				isRemoved
				creationDate
				updated
				score
				myVote
				creatorVote
				creator {
					id
					name
					displayName
					avatar
				}
				level
				parentId
				replyCount
			}
		}
	`;

	const variables = {
		replyToPostId: props.parentId ? null : props.postId,
		replyToCommentId: props.parentId || null,
		body: body.value.trim()
	};

	useGraphQLMutation(mutation, { variables })
		.then((response) => {
			const resp = response.data.value;
			if (!resp || !resp.createComment) {
				throw new Error('No comment data returned from mutation');
			}
			emit('commentPublished', resp.createComment);
			// save comment to comments store
			commentsStore.comments.push(resp.createComment);
			// empty the input
			body.value = "";
			// Show success toast.
			toast.addNotification({ header: 'Comment created', message: 'Your comment was published!', type: 'success' });
		})
		.catch((err) => {
			console.error('Comment submission error:', err);
			const errorMessage = err.message || 'Your comment failed to publish. Please try again.';
			toast.addNotification({ header: 'Comment failed', message: errorMessage, type: 'error' });
		})
		.finally(() => {
			isLoading.value = false;
		});
}
</script>