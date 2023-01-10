<template>
	<NuxtLayout name="inbox">
		<div class="h-full bg-white sm:shadow-inner-xs sm:rounded-md border-b sm:border">
			<!-- Page Heading & Description -->
			<div class="flex items-center p-4 bg-white border-b rounded-t-md">
				<h2 class="text-lg font-medium leading-6 text-gray-900 capitalize">
					<NuxtLink to="/inbox/messages">Messages</NuxtLink>
					<span class="px-2 text-gray-300">/</span>
					<span>{{ route.params.id }}</span>
				</h2>
				<div class="ml-auto flex items-center space-x-2">
					<button class="button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
						&#10003; Mark read
					</button>
					<button class="flex items-center button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <line x1="4" y1="7" x2="20" y2="7"></line>
						   <line x1="10" y1="11" x2="10" y2="17"></line>
						   <line x1="14" y1="11" x2="14" y2="17"></line>
						   <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
						   <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
						</svg>
						Delete
					</button>
				</div>
			</div>
			<!-- Messages -->
			<div class="h-full">
				<ul class="h-96 flex flex-col flex-col-reverse overflow-y-scroll p-2.5 sm:p-4">
					<li v-for="(message,i) in messages.slice().reverse()" :key="message" class="flex mt-4">
						<div class="flex w-3/4 p-2.5">
							{{ message }}
						</div>
					</li>
				</ul>
				<form @submit.prevent="onSubmit" @submit="submitMessage()" class="flex items-end space-x-2 p-2.5 sm:p-4">
					<textarea ref="textarea" required rows="1" class="form-input gray scrollbar-hidden" :placeholder="`Message ${route.params.id}`" v-model="text" autofocus @input="inputHandler" @keydown="inputHandler" style="resize: none;"></textarea>
					<button type="submit" class="flex items-center button primary">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <line x1="10" y1="14" x2="21" y2="3"></line>
						   <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"></path>
						</svg>
						<span>Send</span>
					</button>
				</form>
			</div>
			<!-- Empty State -->
			<!-- Pagination -->
			<!-- <LazyNavigationPaginate v-if="totalPages > 1" :total-pages="totalPages" :per-page="limit" :current-page="page" class="p-2.5 sm:p-4"/> -->
		</div>
	</NuxtLayout>
</template>

<script setup>
	const route = useRoute();

	const messages = ref([]);

	const rows = ref(1);
	const text = ref(null);

	const textarea = ref(null);

	const submitMessage = () => {
		if (text.value.replace(/\s/g,'').length) {
			messages.value.push(text.value);
			textarea.value.style.height = "38px";
			text.value = null;
		}
	}

	// Resize textarea
	const resize = () => {
      let element = textarea.value;

      element.style.height = "0px";
      element.style.height = element.scrollHeight + 2 + "px";
	};

	// Handle key press
	const inputHandler = (e) => {
		if (e.keyCode === 13 && e.shiftKey) {
			e.preventDefault();
			submitMessage();
		} else {
			resize();
		}
	};

    onMounted(() => {
	  textarea.value.focus();
	})
</script>