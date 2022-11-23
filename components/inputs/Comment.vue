<template>
	<form @submit.prevent="onSubmit" @submit="submitComment()" class="relative flex flex-col items-end w-full">
		<textarea required placeholder="Write a comment..." rows="4" class="block w-full min-h-[48px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="body"/>
		<div class="flex space-x-2 mt-2">
			<button v-if="parentId" type="button" class="button white w-24" @click="close">Cancel</button>
			<button class="button primary min-w-[96px]">
				{{ parentId ? 'Reply' : 'Comment' }}
			</button>
		</div>
	</form>
</template>

<script setup>
	import { ref } from 'vue';
	import { baseURL } from "@/server/constants";
	import { useToastStore } from '@/stores/StoreToast';

	// Define emit
	const emit = defineEmits(['closed','commentPublished']);

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

	const toast = useToastStore();

	const authCookie = useCookie("token").value;

	const body = ref("");

	const close = () => {
		emit('closed');
	};

	const submitComment = () => {
		return new Promise((resolve, reject) => {
			useFetch('/comment', {
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
			.then(({ data }) => {
				data = JSON.parse(JSON.stringify(data.value));
				emit('commentPublished', data);
				// Empty the input.
				body.value = null;
				// Show success toast.
				toast.addNotification({header:'Comment created',message:'Your comment was published!',type:'success'});
			})
			.catch((error) => {
				console.log(error);
				// Show error toast.
				toast.addNotification({header:'Comment failed',message:'Your comment failed to publish. Please try again.',type:'error'});
			});
		});
	};
</script>