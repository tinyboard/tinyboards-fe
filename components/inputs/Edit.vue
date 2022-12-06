<template>
	<form @submit.prevent="onSubmit" @submit="submitEdit()" class="relative flex flex-col items-end w-full">
		<textarea required :placeholder="`Edit your ${type}...`" :rows="type === 'post' ? 12 : 4" class="block w-full min-h-[96px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="localBody"/>
		<div class="flex space-x-2 mt-2">
			<button type="button" class="button gray" @click="emit('closed');">
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
			required: true
		},
	});

	// Define emit
	const emit = defineEmits(['closed','hasEdited']);

	const toast = useToastStore();
	const authCookie = useCookie("token").value;

	const localBody = ref(props.body);
	const isLoading = ref(false);

	const submitEdit = () => {
		isLoading.value = true;
		useFetch(`/${props.type}s/${props.id}`, {
			baseURL,
			method: "put",
			body: {
				"body": localBody.value
			},
			headers: {
				Authorization: authCookie ? `Bearer ${authCookie}` : '',
			}
		})
		.then(({ data, error }) => {
			if (data.value) {
				data = JSON.parse(JSON.stringify(data.value));
				// Emit response.
				emit('hasEdited',data);
				// Close the input.
				emit('closed');
				// Show success toast.
				toast.addNotification({header:'Edits saved',message:`Your ${props.type} was updated.`,type:'success'});
			} else {
				// Log the error.
				console.error(error.value);
				// Show error toast.
				toast.addNotification({header:'Edits failed',message:'Your edits failed to save. Please try again.',type:'error'});
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
	};
</script>