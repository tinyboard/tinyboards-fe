<template>
	<form @submit.prevent="onSubmit" @submit="submitComment()" class="relative flex flex-col items-end w-full">
		<textarea required placeholder="Write a comment..." rows="4" class="block w-full min-h-[48px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="body"/>
		<button class="button primary mt-2">Comment</button>
	</form>
</template>

<script setup>
	import { ref } from 'vue';
	import { baseURL } from "@/server/constants";
	import { useToastStore } from '@/stores/StoreToast';

	const props = defineProps({
		parentId: {
			type: Number,
		default: 0
		},
		postId: {
			type: Number,
		default: 0
		},
	});

	const toast = useToastStore();

	const authCookie = useCookie("token").value;

	const body = ref("");

	const submitComment = () => {
		return new Promise((resolve, reject) => {
			useFetch('/comment', {
				baseURL,
				method: "post",
				body: {
					"body": body.value,
					"parentId": props.parentId,
					"post_id": props.postId
				},
				headers: {
					Authorization: authCookie ? `Bearer ${authCookie}` : '',
				}
			})
			.then(({ data }) => {
				body.value = null;
				// Show success toast.
				toast.addNotification({header:'Comment created',message:'Your comment was published!',type:'success'});
				// Navigate to thread page.
				// navigateTo(`/post/${post.id}`);
			})
			.catch((error) => {
				console.log(error);
			});
		});
	};
</script>