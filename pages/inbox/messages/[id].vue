<template>
	<NuxtLayout name="inbox">
		<div class="h-full grid grid-cols-12">
			<div class="h-full col-span-4 flex flex-col bg-white border border-r-0 rounded-l-md overflow-hidden">
				<ul class="flex flex-col divide-y overflow-auto">
					<li v-for="i in 20" class="p-4 leading-6">
						test
					</li>
				</ul>
			</div>
			<div class="h-full col-span-8 bg-white sm:shadow-inner-white sm:rounded-r-md border-b sm:border">
				<!-- Page Heading & Description -->
				<div class="flex items-center p-4 bg-white border-b rounded-t-md">
					<h2 class="text-lg font-bold leading-6 text-gray-900 capitalize">
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
						<li v-for="(message,i) in messages.slice().reverse()" :key="message" class="flex mt-4 last:mt-0">
							<div class="flex w-full">
								<img loading="lazy" :src="message.avatar || 'https://placekitten.com/36/36'" alt="avatar" class="object-cover w-12 h-12 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
								<div class="ml-2">
									<strong class="text-sm">
										{{ message.name }}
									</strong>
									<p>
										{{ message.message }}
									</p>
								</div>
							</div>
						</li>
					</ul>
					<form @submit.prevent="onSubmit" @submit="submitMessage()" class="flex space-x-2 p-2.5 sm:p-4 border-t border-gray-100">
						<!-- <textarea ref="textarea" required rows="1" class="form-input gray scrollbar-hidden" :placeholder="`Message ${route.params.id}`" v-model="text" autofocus @input="inputHandler" @keydown="inputHandler" style="resize: none;"></textarea> -->
						<textarea ref="textarea" required :placeholder="`Message ${route.params.id}`" rows="4" class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="text" @keydown="inputHandler"/>
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
		</div>
	</NuxtLayout>
</template>

<script setup>
	const route = useRoute();

	const messages = ref([
	{
		avatar: 'https://placekitten.com/50/50',
		name: 'jony',
		message: 'hello world'
	},
	{
		avatar: 'https://placekitten.com/50/50',
		name: 'jony',
		message: 'hello world'
	}
	]);

	const text = ref(null);
	const textarea = ref(null);

	const submitMessage = () => {
		const message = {
			avatar: 'https://placekitten.com/50/50',
			name: 'jony',
			message: 'hello world'
		}

		if (text.value.replace(/\s/g,'').length) {
			message.message = text.value;
			messages.value.push(message);
			// textarea.value.style.height = "38px";
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
		}
		// } else {
		// 	resize();
		// }
	};

    onMounted(() => {
	  textarea.value.focus();
	})
</script>