<template>
	<form @submit.prevent="onSubmit" @submit="submitComment()" class="comment-form relative flex flex-col w-full">
		<!-- Textarea -->
		<textarea v-show="!isPreviewVisible" required placeholder="Write a comment..." rows="4"
			class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
			v-model="body" @keydown="inputHandler" />
		<!-- MD Preview -->
		<div v-show="isPreviewVisible" class="w-full" style="min-height: 118px;">
			<div class="min-h-[24px] sm:min-h-[36px] pt-2.5 space-x-2 text-sm text-gray-500 dark:text-gray-400">
				<strong class="text-secondary">You</strong>
				<span>Preview</span>
			</div>
			<div class="prose prose-sm" v-html="preview"></div>
		</div>
		<button type="button" v-show="isPreviewVisible" class="absolute right-0 top-0 button button-sm gray"
			@click="isPreviewVisible = false">
			<span class="text-xs text-gray-400 uppercase font-medium tracking-wide">Preview</span>
			<span class="ml-2 text-red-500">&#10006;</span>
		</button>
		<!-- Action Buttons -->
		<div class="mt-2 flex justify-end w-full">
			<!-- Show/hide MD Preview -->
			<button type="button" class="button gray w-24" @click="isPreviewVisible = !isPreviewVisible">
				{{ isPreviewVisible ? 'Edit' : 'Preview' }}
			</button>
			<button v-if="parentId" type="button" class="ml-auto button white w-24" @click="close">Cancel</button>
			<button class="button primary min-w-[96px] ml-2" :class="{ 'loading': isLoading }" :disabled="isLoading">
				{{ parentId ? 'Reply' : 'Comment' }}
			</button>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { marked } from 'marked';
// import { baseURL } from "@/server/constants";
import { useAPI } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
import { useSiteStore } from "@/stores/StoreSite";
import { useCommentsStore } from "@/stores/StoreComments";
import { useGraphQLMutation } from "@/composables/useGraphQL";

const props = defineProps<{
	parentId?: number;
	postId?: number;
}>();

// Define emit
const emit = defineEmits(['closed', 'commentPublished']);
const toast = useToastStore();
const site = useSiteStore();
const commentsStore = useCommentsStore();

const body = ref("");
const isLoading = ref(false);

// Markdown previewing
const isPreviewVisible = ref(false);

const preview = computed(() => {
	return marked.parse(body.value ?? '')
});

const close = () => {
	emit('closed');
	isPreviewVisible.value = false;
};

// Handle key press
const inputHandler = (e: KeyboardEvent) => {
	if (e.keyCode === 13 && e.shiftKey) {
		e.preventDefault();
		submitComment();
	}
};

// Submit comment
function submitComment() {
	const mutation = `
		mutation CreateComment($replyToPostId: Int, $replyToCommentId: Int, $body: String!, $withBoard: Boolean!) {
			createComment(replyToPostId: $replyToPostId, replyToCommentId: $replyToCommentId, body: $body, withBoard: $withBoard) {
				id
				body
				isRemoved
				creationDate
				updated
				score
				myVote
				creator {
					id
					name
					displayName
					avatar
				}
				depth
				parentId
				childCount
			}
		}
	`;

	useGraphQLMutation(mutation, {
		replyToPostId: props.postId,
		replyToCommentId: props.parentId,
		body: body.value,
		withBoard: site.enableBoards
	})
		.then((response) => {
			const resp = response.data.value;
			emit('commentPublished', resp.createComment);
			// save comment to comments store
			commentsStore.comments.push(resp.createComment);
			// empty the input
			body.value = "";
			// Show success toast.
			toast.addNotification({ header: 'Comment created', message: 'Your comment was published!', type: 'success' });
		})
		.catch((err) => {
			console.error(err);
			toast.addNotification({ header: 'Comment failed', message: 'Your comment failed to publish. Please try again.', type: 'error' });
		})
		.finally(() => {
			isLoading.value = false;
			isPreviewVisible.value = false;
		});
}
</script>