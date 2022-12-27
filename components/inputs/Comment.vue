<template>
	<form @submit.prevent="onSubmit" @submit="submitComment()" class="relative flex flex-col items-end w-full">
		<textarea required placeholder="Write a comment..." rows="4" class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="body" @keydown="inputHandler"/>
		<div class="flex space-x-2 mt-2">
			<button v-if="parentId" type="button" class="button white w-24" @click="close">Cancel</button>
			<button class="button primary min-w-[96px]" :class="{ 'loading':isLoading }" :disabled="isLoading">
				{{ parentId ? 'Reply' : 'Comment' }}
			</button>
		</div>
	</form>
</template>

<script setup>
	import { ref } from 'vue';
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

	const close = () => {
		emit('closed');
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
    			});
    		});
    	} else {
    		toast.addNotification({header:'Comment failed',message:'Your comment needs some text! Please try again.',type:'error'});
    	}
    };
</script>