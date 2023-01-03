<template>
	<form @submit.prevent="onSubmit" @submit="submitComment()" class="relative flex flex-col w-full">
		<!-- Textarea -->
		<textarea v-show="!isPreviewVisible" required placeholder="Write a comment..." rows="4" class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="body" @keydown="inputHandler"/>
		<!-- MD Preview -->
		<div v-show="isPreviewVisible" class="w-full" style="min-height: 118px;">
			<div class="min-h-[24px] sm:min-h-[36px] pt-2.5 space-x-2 text-sm text-gray-500 dark:text-gray-400">
				<strong class="text-secondary">You</strong>
				<span>Preview</span>
			</div>
			<div class="prose prose-sm" v-html="preview"></div>
		</div>
		<button type="button" v-show="isPreviewVisible" class="absolute right-0 top-0 button button-sm gray" @click="isPreviewVisible = false">
			<span class="text-xs text-gray-400 hover:text-gray-600 uppercase font-medium tracking-wide">Preview</span>
			<span class="ml-2 text-red-500">&#10006;</span>
		</button>
		<!-- Action Buttons -->
		<div class="mt-2 flex justify-end space-x-2">
			<button v-if="parentId" type="button" class="button white w-24" @click="close">Cancel</button>
			<!-- Show/hide MD Preview -->
			<button type="button" class="button gray" @click="isPreviewVisible = !isPreviewVisible">
				{{ isPreviewVisible ? 'Edit' : 'Show preview' }}
			</button>
			<button class="button primary min-w-[96px]" :class="{ 'loading':isLoading }" :disabled="isLoading">
				{{ parentId ? 'Reply' : 'Comment' }}
			</button>
		</div>
	</form>
</template>

<script setup>
	import { marked } from 'marked';
	import { baseURL } from "@/server/constants";
	import { useToastStore } from '@/stores/StoreToast';

	const props = defineProps({
		parentId: {
			type: Number,
		default: null
		},
		postId: {
			type: Number,
		default: null
		},
	});

	// Define emit
	const emit = defineEmits(['closed','commentPublished']);
	const toast = useToastStore();
	const authCookie = useCookie("token").value;

	const body = ref(null);
	const isLoading = ref(false);

	// Markdown previewing
	const isPreviewVisible = ref(false);

	const preview = computed(() => {
		return marked.parse(body.value ?? 'Start typing your comment...')
	});

	const close = () => {
		emit('closed');
		isPreviewVisible.value = false;
	};

	// Handle key press
	const inputHandler = (e) => {
		if (e.keyCode === 13 && e.shiftKey) {
			e.preventDefault();
			submitComment();
		}
	};

	// Submit content
	const submitComment = () => {
		if (body.value) {
			isLoading.value = true;
			return new Promise((resolve, reject) => {
				useFetch('/comments', {
					baseURL,
					method: "post",
					body: {
						"body": body.value,
						"parent_id": props.parentId,
						"post_id": props.postId
					},
					headers: {
						Authorization: authCookie ? `Bearer ${authCookie}` : '',
					}
				})
				.then(({ data, error }) => {
					if (data.value) {
						data = JSON.parse(JSON.stringify(data.value));
						emit('commentPublished', data);
						// Empty the input.
						body.value = null;
						// Show success toast.
						toast.addNotification({header:'Comment created',message:'Your comment was published!',type:'success'});
					} else {
						console.error(error.value);
						// Show error toast.
						toast.addNotification({header:'Comment failed',message:'Your comment failed to publish. Please try again.',type:'error'});
					}
				})
				.finally(() => {
					isLoading.value = false;
					isPreviewVisible.value = false;
				});
			});
		} else {
			toast.addNotification({header:'Comment failed',message:'Your comment needs some text! Please try again.',type:'error'});
		}
	};
</script>