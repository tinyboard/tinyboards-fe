<template>
	<form @submit.prevent="onSubmit" @submit="submitEdit()" class="edit-comment-form relative flex flex-col items-end w-full">
		<!-- Rich Text Editor for Thread Comments -->
		<LazyInputsTiptap
			v-if="isThread"
			v-model="localBody"
			:placeholder="`Edit your ${type}...`"
			class="w-full mb-2"
		/>
		<!-- Textarea for Regular Comments/Posts -->
		<template v-else>
			<textarea ref="textareaRef" v-show="!isPreviewVisible" required :placeholder="`Edit your ${type}...`" :rows="type === 'post' ? 12 : 4" class="block w-full min-h-[96px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="localBody" @keydown="inputHandler" @input="handleInput"/>
			<!-- MD Preview -->
			<div v-show="isPreviewVisible" class="w-full" style="min-height: 118px;">
				<div class="prose prose-sm" v-html="preview"></div>
			</div>
			<button type="button" v-show="isPreviewVisible" class="absolute right-0 top-0 button button-sm gray" @click="isPreviewVisible = false">
				<span class="text-xs text-gray-400 uppercase font-medium tracking-wide">Preview</span>
				<span class="ml-2 text-red-500">&#10006;</span>
			</button>
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
		</template>
		<!-- Action Buttons -->
		<div class="mt-2 flex w-full">
			<!-- Show/hide MD Preview (only for non-thread) -->
			<button v-if="!isThread" type="button" class="button gray w-24" @click="isPreviewVisible = !isPreviewVisible">
				{{ isPreviewVisible ? 'Edit' : 'Preview' }}
			</button>
			<button type="button" :class="isThread ? '' : 'ml-auto'" class="button gray w-24" @click="close">
				Cancel
			</button>
			<button type="submit" class="ml-2 button primary" :class="{ 'loading':isLoading }" :disabled="props.body === localBody || isLoading">
				Save changes
			</button>
		</div>
	</form>
</template>

<script setup>
	import { marked } from 'marked';
	import { useToastStore } from '@/stores/StoreToast';
	import { useMentionAutocomplete } from '@/composables/useMentionAutocomplete';

	import { editPost } from "@/composables/post";
	import { editComment } from "@/composables/comments";
	import MentionDropdown from './MentionDropdown.vue';

	const props = defineProps({
		id: {
			type: Number,
			default: null,
			required: true
		},
		body: {
			type: String,
			default: null,
			required: true
		},
		type: {
			type: String,
			default: 'post',
			required: true,
			validator: (value) => ['post', 'comment'].includes(value)
		},
		isThread: {
			type: Boolean,
			default: false
		},
	});

	// Define emit
	const emit = defineEmits(['closed','hasEdited']);

	const toast = useToastStore();

	const localBody = ref(props.body);
	const isLoading = ref(false);
	const textareaRef = ref(null);

	// Markdown previewing
	const isPreviewVisible = ref(false);

	// Mention autocomplete (only for non-thread textarea)
	const mentionAutocomplete = useMentionAutocomplete();
	const mentionPosition = ref({ top: 0, left: 0 });
	const mentionStartPos = ref(null);

	const preview = computed(() => {
		return marked.parse(localBody.value)
	});

	const close = () => {
		emit('closed');
		isPreviewVisible.value = false;
	};

	// Check for @ mentions in textarea
	const checkForMention = () => {
		if (!textareaRef.value || props.isThread) return;

		const cursorPosition = textareaRef.value.selectionStart;
		const textBeforeCursor = localBody.value.substring(0, cursorPosition);

		// Look for @ followed by word characters
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

		if (mentionMatch) {
			const query = mentionMatch[1];
			const atPos = cursorPosition - query.length - 1;

			mentionStartPos.value = atPos;

			if (query.length > 0) {
				mentionAutocomplete.debouncedSearch(query);
			} else {
				mentionAutocomplete.reset();
			}

			// Calculate dropdown position
			const textarea = textareaRef.value;
			const textAreaRect = textarea.getBoundingClientRect();
			mentionPosition.value = {
				top: textAreaRect.bottom + 5,
				left: textAreaRect.left + 10
			};
		} else {
			if (mentionAutocomplete.isVisible.value) {
				mentionAutocomplete.reset();
				mentionStartPos.value = null;
			}
		}
	};

	// Insert selected mention
	const insertMention = (username) => {
		if (!textareaRef.value || mentionStartPos.value === null) return;

		const cursorPosition = textareaRef.value.selectionStart;
		const text = localBody.value;

		const before = text.substring(0, mentionStartPos.value);
		const after = text.substring(cursorPosition);
		localBody.value = before + '@' + username + ' ' + after;

		mentionAutocomplete.reset();
		mentionStartPos.value = null;

		nextTick(() => {
			if (textareaRef.value) {
				const newPosition = mentionStartPos.value + username.length + 2;
				textareaRef.value.focus();
				textareaRef.value.setSelectionRange(newPosition, newPosition);
			}
		});
	};

	// Handle input changes
	const handleInput = () => {
		checkForMention();
	};

	// Handle key press
	const inputHandler = (e) => {
		// Handle mention autocomplete navigation
		if (mentionAutocomplete.isVisible.value && !props.isThread) {
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

		if (e.keyCode === 13 && e.shiftKey) {
			e.preventDefault();
			submitEdit();
		}
	};

	// Submit edit
	function submitEdit() {
		if (!localBody.value.trim()) {
			toast.addNotification({header:'Edits failed',message:'Your edits need some text! Please try again.',type:'error'});
			return;
		}

		isLoading.value = true;

		const editFunction = props.type === "post" ? editPost : editComment;

		editFunction(props.id, localBody.value)
			.then((resp) => {
				if (resp && (resp.body || resp.bodyHTML)) {
					emit("hasEdited", resp);
					emit("closed");
					toast.addNotification({header:'Edits saved',message:`Your ${props.type} was updated.`,type:'success'});
				} else {
					// Show error toast.
					toast.addNotification({header:'Edits failed',message:'Your edits failed to save. Please try again.',type:'error'});
				}
			})
			.catch((error) => {
				console.error('Edit error:', error);
				toast.addNotification({header:'Edits failed',message:'Your edits failed to save. Please try again.',type:'error'});
			})
			.finally(() => {
				isLoading.value = false;
				isPreviewVisible.value = false;
			});
	}
</script>