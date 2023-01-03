<template>
	<form @submit.prevent="onSubmit" @submit="submitComment()" class="relative flex flex-col w-full">
		<!-- Textarea -->
		<textarea required placeholder="Write a comment..." rows="4" class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="body" @keydown="inputHandler"/>
		<div class="mt-2 flex items-start justify-between w-full">
			<!-- Show/hide MD Preview -->
			<button type="button" class="text-xs text-primary" @click="isPreviewVisible = !isPreviewVisible">
				{{ isPreviewVisible ? 'Hide' : 'Show' }} preview
			</button>
			<!-- Action Buttons -->
			<div class="flex space-x-2">
				<button v-if="parentId" type="button" class="mr-2 button white w-24" @click="close">Cancel</button>
				<button class="button primary min-w-[96px]" :class="{ 'loading':isLoading }" :disabled="isLoading">
					{{ parentId ? 'Reply' : 'Comment' }}
				</button>
			</div>
		</div>
		<!-- MD Preview -->
		<div v-show="isPreviewVisible" class="my-4 p-2.5 w-full rounded-md bg-white border">
			<div class="prose prose-sm" v-html="preview"></div>
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
						console.log(error.value);
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