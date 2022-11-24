<template>
	<form @submit.prevent="onSubmit" @submit="submitEdit()" class="relative flex flex-col items-end w-full">
		<textarea required placeholder="Edit your post..." rows="4" class="block w-full min-h-[48px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="localBody"/>
		<div class="flex space-x-2 mt-2">
			<button type="button" class="button white" @click="close">
				Cancel
			</button>
			<button type="submit" class="button primary" :class="{ 'loading':isLoading }" :disabled="props.body === localBody || isLoading">
				Save changes
			</button>
		</div>
	</form>
</template>

<script setup>
	import { ref } from 'vue';
	import { baseURL } from "@/server/constants";
	import { useToastStore } from '@/stores/StoreToast';

	const props = defineProps({
		body: {
			type: String,
			default: null,
			required: true
		},
		postId: {
			type: Number,
			default: null,
			required: true
		},
	});

	// Define emit
	const emit = defineEmits(['closed','postEdited']);

	const toast = useToastStore();
	const authCookie = useCookie("token").value;

	const localBody = ref(props.body);
	const isLoading = ref(false);

	const close = () => {
		emit('closed');
	};

	const submitEdit = () => {
		isLoading.value = true;
		useFetch(`/posts/${props.postId}`, {
			baseURL,
			method: "put",
			body: {
				"body": "test"
			},
			headers: {
				Authorization: authCookie ? `Bearer ${authCookie}` : '',
			}
		})
		.then(({ data }) => {
			data = JSON.parse(JSON.stringify(data.value));
			emit('postEdited', data);
				// Empty the input.
			body.value = null;
				// Show success toast.
			toast.addNotification({header:'Edits saved!',message:'Your post was updated.',type:'success'});
		})
		.catch((error) => {
			console.log(error);
				// Show error toast.
			toast.addNotification({header:'Edits failed',message:'Your edits failed to save. Please try again.',type:'error'});
		})
		.finally(() => {
			isLoading.value = false;
		});
	};
</script>