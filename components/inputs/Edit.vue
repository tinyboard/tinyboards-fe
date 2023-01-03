<template>
	<form @submit.prevent="onSubmit" @submit="submitEdit()" class="relative flex flex-col items-end w-full">
		<!-- Textarea -->
		<textarea v-show="!isPreviewVisible" required :placeholder="`Edit your ${type}...`" :rows="type === 'post' ? 12 : 4" class="block w-full min-h-[96px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="localBody" @keydown="inputHandler"/>
		<!-- MD Preview -->
		<div v-show="isPreviewVisible" class="w-full" style="min-height: 118px;">
			<div class="prose prose-sm" v-html="preview"></div>
		</div>
		<button type="button" v-show="isPreviewVisible" class="absolute right-0 top-0 button button-sm gray" @click="isPreviewVisible = false">
			<span class="text-xs text-gray-400 hover:text-gray-600 uppercase font-medium tracking-wide">Preview</span>
			<span class="ml-2 text-red-500">&#10006;</span>
		</button>
		<!-- Action Buttons -->
		<div class="mt-2 flex w-full">
			<!-- Show/hide MD Preview -->
			<button type="button" class="button gray" @click="isPreviewVisible = !isPreviewVisible">
				{{ isPreviewVisible ? 'Edit' : 'Show preview' }}
			</button>
			<button type="button" class="ml-auto button gray" @click="close">
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

	// Markdown previewing
	const isPreviewVisible = ref(false);

	const preview = computed(() => {
		return marked.parse(localBody.value)
	});

	const close = () => {
		emit('closed');
		isPreviewVisible.value = false;
	};

	// Handle key press
	const inputHandler = (e) => {
		if (e.keyCode === 13 && e.shiftKey) {
			e.preventDefault();
			submitEdit();
		}
	};

	// Submit edit
	const submitEdit = () => {
		if (localBody.value) {
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
				isPreviewVisible.value = false;
			});
		} else {
			toast.addNotification({header:'Edits failed',message:'Your edits need some text! Please try again.',type:'error'});
		}
	};
</script>