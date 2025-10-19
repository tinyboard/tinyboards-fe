<template>
	<form @submit.prevent="submitComment" class="comment-form relative flex flex-col w-full">
		<!-- Textarea Container -->
		<div class="relative">
			<textarea
				ref="textareaRef"
				v-show="!isPreviewVisible"
				required
				placeholder="Write a comment..."
				rows="4"
				class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary pr-10"
				v-model="body"
				@keydown="handleKeydown"
				@input="handleInput"
				@click="handleTextareaClick"
			/>
			<!-- Emoji Picker inside textarea -->
			<div v-show="!isPreviewVisible" class="absolute bottom-2 right-2">
				<EmojiPicker @emoji-selected="insertEmoji" />
			</div>
		</div>

		<!-- Emoji Suggestions -->
		<EmojiSuggestions
			:suggestions="emojiSuggestions.suggestions.value"
			:is-visible="emojiSuggestions.isVisible.value"
			:position="emojiSuggestions.position.value"
			:selected-index="emojiSuggestions.selectedIndex.value"
			@select="selectEmojiSuggestion"
		/>
		<!-- Mention Autocomplete -->
		<MentionDropdown
			:suggestions="mentionAutocomplete.suggestions.value"
			:selected-index="mentionAutocomplete.selectedIndex.value"
			:is-visible="mentionAutocomplete.isVisible.value"
			:is-loading="mentionAutocomplete.isLoading.value"
			:position="mentionPosition"
			@select="insertMention"
			@update:selected-index="mentionAutocomplete.selectedIndex.value = $event"
		/>
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
		<div class="mt-2 flex justify-between w-full">
			<div class="flex items-center">
				<!-- Empty div to maintain layout -->
				<div></div>
			</div>
			<div class="flex">
				<!-- Show/hide MD Preview -->
				<button type="button" class="button gray w-24" @click="isPreviewVisible = !isPreviewVisible">
					{{ isPreviewVisible ? 'Edit' : 'Preview' }}
				</button>
				<button v-if="parentId" type="button" class="ml-2 button white w-24" @click="close">Cancel</button>
				<button class="button primary min-w-[96px] ml-2" :class="{ 'loading': isLoading }" :disabled="isLoading">
					{{ parentId ? 'Reply' : 'Comment' }}
				</button>
			</div>
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
import { useEmojiSuggestions } from "@/composables/useEmojiSuggestions";
import { useMentionAutocomplete } from "@/composables/useMentionAutocomplete";
import EmojiPicker from './EmojiPicker.vue';
import EmojiSuggestions from './EmojiSuggestions.vue';
import MentionDropdown from './MentionDropdown.vue';

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
const textareaRef = ref<HTMLTextAreaElement>();

// Markdown previewing
const isPreviewVisible = ref(false);

// Emoji suggestions
const emojiSuggestions = useEmojiSuggestions();

// Mention autocomplete
const mentionAutocomplete = useMentionAutocomplete();
const mentionPosition = ref({ top: 0, left: 0 });
const mentionStartPos = ref<number | null>(null);

const preview = computed(() => {
	return marked.parse(body.value ?? '')
});

const close = () => {
	emit('closed');
	isPreviewVisible.value = false;
};

// Check for @ mentions in textarea
const checkForMention = () => {
	if (!textareaRef.value) return;

	const cursorPosition = textareaRef.value.selectionStart;
	const textBeforeCursor = body.value.substring(0, cursorPosition);

	// Look for @ followed by word characters
	const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

	if (mentionMatch) {
		const query = mentionMatch[1];
		const atPos = cursorPosition - query.length - 1; // Position of @

		// Store the position for later replacement
		mentionStartPos.value = atPos;

		// Trigger search if query has content (at least 1 character)
		if (query.length > 0) {
			mentionAutocomplete.debouncedSearch(query);
		} else {
			// Just typed @, reset suggestions
			mentionAutocomplete.reset();
		}

		// Calculate dropdown position
		const textarea = textareaRef.value;
		const textAreaRect = textarea.getBoundingClientRect();

		// Simple position calculation - below the cursor
		mentionPosition.value = {
			top: textAreaRect.bottom + 5,
			left: textAreaRect.left + 10
		};
	} else {
		// No @ detected, hide dropdown
		if (mentionAutocomplete.isVisible.value) {
			mentionAutocomplete.reset();
			mentionStartPos.value = null;
		}
	}
};

// Insert selected mention
const insertMention = (username: string) => {
	if (!textareaRef.value || mentionStartPos.value === null) return;

	const cursorPosition = textareaRef.value.selectionStart;
	const text = body.value;

	// Replace @query with @username
	const before = text.substring(0, mentionStartPos.value);
	const after = text.substring(cursorPosition);
	body.value = before + '@' + username + ' ' + after;

	// Reset mention state
	mentionAutocomplete.reset();
	mentionStartPos.value = null;

	// Restore focus and position cursor after the mention
	nextTick(() => {
		if (textareaRef.value) {
			const newPosition = mentionStartPos.value! + username.length + 2; // @ + username + space
			textareaRef.value.focus();
			textareaRef.value.setSelectionRange(newPosition, newPosition);
		}
	});
};

// Handle key press
const handleKeydown = (e: KeyboardEvent) => {
	// Handle mention autocomplete navigation
	if (mentionAutocomplete.isVisible.value) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			mentionAutocomplete.selectNext();
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			mentionAutocomplete.selectPrevious();
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			const selectedUsername = mentionAutocomplete.getSelectedUsername();
			if (selectedUsername) {
				insertMention(selectedUsername);
			}
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			mentionAutocomplete.reset();
			mentionStartPos.value = null;
			return;
		}
	}

	// Handle emoji suggestions navigation
	if (emojiSuggestions.isVisible.value) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			emojiSuggestions.navigateDown();
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			emojiSuggestions.navigateUp();
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			const selectedEmoji = emojiSuggestions.selectSuggestion();
			if (selectedEmoji) {
				insertEmojiSuggestion(selectedEmoji);
			}
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			emojiSuggestions.hideSuggestions();
			return;
		}
	}

	// Original functionality
	if (e.keyCode === 13 && e.shiftKey) {
		e.preventDefault();
		submitComment();
	}
};

// Handle input changes
const handleInput = () => {
	if (textareaRef.value) {
		const cursorPosition = textareaRef.value.selectionStart;
		emojiSuggestions.showSuggestions(body.value, cursorPosition, textareaRef.value);
		checkForMention();
	}
};

// Handle textarea clicks
const handleTextareaClick = () => {
	if (textareaRef.value) {
		const cursorPosition = textareaRef.value.selectionStart;
		emojiSuggestions.showSuggestions(body.value, cursorPosition, textareaRef.value);
		checkForMention();
	}
};

// Insert emoji into textarea
const insertEmoji = (emoji: string) => {
	if (textareaRef.value) {
		const start = textareaRef.value.selectionStart;
		const end = textareaRef.value.selectionEnd;
		const text = body.value;
		body.value = text.substring(0, start) + emoji + text.substring(end);

		// Restore cursor position
		nextTick(() => {
			if (textareaRef.value) {
				textareaRef.value.focus();
				textareaRef.value.setSelectionRange(start + emoji.length, start + emoji.length);
			}
		});
	}
};

// Insert emoji from suggestions
const insertEmojiSuggestion = (emoji: any) => {
	if (textareaRef.value) {
		const result = emojiSuggestions.replaceEmojiInText(body.value, textareaRef.value.selectionStart, emoji);
		body.value = result.newText;

		// Restore cursor position
		nextTick(() => {
			if (textareaRef.value) {
				textareaRef.value.focus();
				textareaRef.value.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
			}
		});
	}
};

// Select emoji suggestion from dropdown
const selectEmojiSuggestion = (index: number) => {
	const selectedEmoji = emojiSuggestions.selectSuggestion(index);
	if (selectedEmoji) {
		insertEmojiSuggestion(selectedEmoji);
	}
};

// Submit comment
function submitComment() {
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
			isPreviewVisible.value = false;
		});
}
</script>