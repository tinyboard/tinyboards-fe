<template>
	<!-- Messages -->
	<div class="flex flex-col">
		<ul ref="list" class="h-full flex flex-col flex-col-reverse overflow-y-scroll p-2.5 sm:p-4">
			<li v-for="(message,i) in localMessages" :key="message" class="flex mt-4 last:mt-0">
				<div class="flex w-full">
					<img loading="lazy" :src="message.creator.avatar" alt="avatar" class="object-cover w-12 h-12 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
					<div class="ml-2">
						<strong class="text-sm">
							{{ message.creator.name }}
						</strong>
						<div v-html="message.private_message.body"></div>
					</div>
				</div>
			</li>
		</ul>
		<form @submit.prevent="onSubmit" @submit="submitMessage()" class="flex space-x-2 p-2.5 sm:p-4 border-t border-gray-100">
			<!-- <textarea ref="textarea" required rows="1" class="form-input gray scrollbar-hidden" :placeholder="`Message ${route.params.id}`" v-model="text" autofocus @input="inputHandler" @keydown="inputHandler" style="resize: none;"></textarea> -->
			<textarea ref="textarea" required placeholder="Write a message" rows="4" class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="text" @keydown="inputHandler"/>
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
</template>

<script setup>
	import { baseURL } from '@/server/constants';

	const route = useRoute();

	const authCookie = useCookie("token").value;

	// Fetch messages
	const localMessages = ref([]);

	const { data: messages, pending, error, refresh } = useFetch('/messages', {
		query: {
			limit: 50,
			page: 1,
			parent_id: route.query.new ? null : Number(route.params.id)
		},
		baseURL,
		headers: {
			Authorization: authCookie ? `Bearer ${authCookie}` : '',
		}
	})
	.then(({ data, error }) => {
		localMessages.value = data.value.messages;
	});

	// Submit message
	const list = ref(null);

	const text = ref(null);
	const textarea = ref(null);

	// const recipientId = computed(() => {
	// 	const id = messages.value.messages[0].private_message.recipient_id ?? route.params.id;
	// 	return Number(id);
	// });

	// const chatId = computed(() => {
	// 	const id = messages.value.messages[0].private_message.chat_id ?? null;
	// });

	const submitMessage = () => {
		// Scroll to bottom of list
		list.value.scrollTop = list.value.scrollHeight;
		// If not empty, submit the messsage
		if (text.value.replace(/\s/g,'').length) {
			useFetch(`/messages`, {
				body: {
					"recipient_id": 0,
					"subject": "Topic of Convo here",
					"body": text.value,
					"chat_id": 1
				},
				method: 'post',
				baseURL,
				headers: {
					Authorization: authCookie ? `Bearer ${authCookie}` : '',
				}
			})
			.then(({ data, error }) => {
				if (data.value) {
					data = JSON.parse(JSON.stringify(data.value));
					localMessages.value.unshift(data.message);
					text.value = null;
				}
			});
		}
	};

	// Handle key press
	const inputHandler = (e) => {
		if (e.keyCode === 13 && e.shiftKey) {
			e.preventDefault();
			submitMessage();
		}
	};

    onMounted(() => {
	  textarea.value.focus();
	})
</script>