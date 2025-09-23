<template>
	<!-- Messages -->
	<div class="flex flex-col">
		<ul ref="list" class="h-full flex flex-col flex-col-reverse overflow-y-scroll p-2.5 sm:p-4">
			<li v-for="(message,i) in localMessages" :key="message.id" class="flex mt-4 last:mt-0 group">
				<div class="flex w-full">
					<img loading="lazy" :src="message.creator.avatar" alt="avatar" class="object-cover w-12 h-12 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
					<div class="ml-2 flex-1">
						<div class="flex items-center justify-between">
							<strong class="text-sm">
								{{ message.creator.name }}
							</strong>
							<div v-if="canEditMessage(message)" class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									@click="startEditMessage(message)"
									class="p-1 text-gray-400 hover:text-gray-600 rounded"
									title="Edit message"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
										<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
										<path d="M16 5l3 3"></path>
									</svg>
								</button>
								<button
									@click="deleteMessage(message)"
									class="p-1 text-gray-400 hover:text-red-600 rounded"
									title="Delete message"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<line x1="4" y1="7" x2="20" y2="7"></line>
										<line x1="10" y1="11" x2="10" y2="17"></line>
										<line x1="14" y1="11" x2="14" y2="17"></line>
										<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
										<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
									</svg>
								</button>
							</div>
						</div>

						<!-- Message content or edit form -->
						<div v-if="editingMessageId !== message.id" v-html="message.private_message.body"></div>
						<div v-else class="mt-2">
							<textarea
								v-model="editMessageText"
								class="block w-full min-h-[60px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-sm"
								placeholder="Edit your message"
								rows="3"
							></textarea>
							<div class="flex items-center justify-end space-x-2 mt-2">
								<button
									@click="cancelEditMessage"
									class="text-sm text-gray-500 hover:text-gray-700"
								>
									Cancel
								</button>
								<button
									@click="saveEditMessage(message)"
									class="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark disabled:opacity-50"
									:disabled="isEditingMessage || !editMessageText.trim()"
								>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
		<form @submit.prevent="onSubmit" @submit="submitMessage()" class="flex space-x-2 p-2.5 sm:p-4 border-t border-gray-100">
			<!-- <textarea ref="textarea" required rows="1" class="form-input gray scrollbar-hidden" :placeholder="`Message ${route.params?.id}`" v-model="text" autofocus @input="inputHandler" @keydown="inputHandler" style="resize: none;"></textarea> -->
			<textarea ref="textarea" required placeholder="Write a message" rows="4" class="block w-full min-h-[72px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="text" @keydown="inputHandler"/>
			<button type="submit" class="flex items-center button primary" :disabled="isSubmitting || !text.trim()">
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
	import { useToastStore } from "@/stores/StoreToast";
	import { useLoggedInUser } from "@/stores/StoreAuth";

	const route = useRoute();
	const toast = useToastStore();
	const userStore = useLoggedInUser();

	// Fetch messages
	const localMessages = ref([]);
	const isLoading = ref(false);
	const conversationId = computed(() => Number(route.params?.id));

	// Fetch conversation messages
	const fetchMessages = async () => {
		if (!conversationId.value) return;

		try {
			const { data: result } = await useAsyncGql({
				operation: 'GetConversation',
				variables: {
					userId: conversationId.value,
					limit: 50,
					offset: 0
				}
			});

			if (result.value?.getConversation) {
				localMessages.value = result.value.getConversation;
			}
		} catch (error) {
			console.error('Error fetching conversation:', error);
			toast.addNotification({
				header: 'Error loading messages',
				message: 'Unable to load conversation. Please try again.',
				type: 'error'
			});
		}
	};

	// Submit message
	const list = ref(null);
	const text = ref('');
	const textarea = ref(null);
	const isSubmitting = ref(false);

	// Get recipient information from the first message or route
	const recipientId = computed(() => {
		if (localMessages.value.length > 0) {
			const firstMessage = localMessages.value[0];
			// Return the other participant's ID (not the current user)
			return firstMessage.creator.id !== firstMessage.recipient_user?.id
				? firstMessage.creator.id
				: firstMessage.recipient_user?.id;
		}
		return Number(route.params?.id) || null;
	});

	const submitMessage = async () => {
		if (!text.value.trim() || isSubmitting.value || !recipientId.value) return;

		isSubmitting.value = true;
		const messageContent = text.value.trim();

		try {
			const { data: result } = await useAsyncGql({
				operation: 'sendMessage',
				variables: {
					input: {
						recipientId: recipientId.value,
						subject: "Message", // Default subject
						body: messageContent,
						conversationId: conversationId.value
					}
				}
			});

			if (result.value?.sendMessage?.message) {
				// Add the new message to the local list
				localMessages.value.unshift(result.value.sendMessage.message);
				text.value = '';

				// Scroll to bottom
				nextTick(() => {
					if (list.value) {
						list.value.scrollTop = list.value.scrollHeight;
					}
				});
			} else {
				toast.addNotification({
					header: 'Failed to send message',
					message: 'Please try again.',
					type: 'error'
				});
			}
		} catch (error) {
			console.error('Error sending message:', error);
			toast.addNotification({
				header: 'Failed to send message',
				message: 'Please try again.',
				type: 'error'
			});
		} finally {
			isSubmitting.value = false;
		}
	};

	// Handle key press
	const inputHandler = (e) => {
		if (e.keyCode === 13 && e.shiftKey) {
			e.preventDefault();
			submitMessage();
		}
	};

	// Message editing functionality
	const editingMessageId = ref(null);
	const editMessageText = ref('');
	const isEditingMessage = ref(false);

	// Check if user can edit message (only own messages)
	const canEditMessage = (message) => {
		return userStore.user && message.creator.id === userStore.user.id;
	};

	// Start editing a message
	const startEditMessage = (message) => {
		editingMessageId.value = message.id;
		editMessageText.value = message.private_message.body_html || message.private_message.body;
	};

	// Cancel editing
	const cancelEditMessage = () => {
		editingMessageId.value = null;
		editMessageText.value = '';
	};

	// Save edited message
	const saveEditMessage = async (message) => {
		if (!editMessageText.value.trim() || isEditingMessage.value) return;

		isEditingMessage.value = true;
		try {
			const { data: result } = await useAsyncGql({
				operation: 'editMessage',
				variables: {
					input: {
						messageId: message.id,
						body: editMessageText.value.trim()
					}
				}
			});

			if (result.value?.editMessage?.message) {
				// Update the message in the local array
				const messageIndex = localMessages.value.findIndex(m => m.id === message.id);
				if (messageIndex !== -1) {
					localMessages.value[messageIndex] = {
						...localMessages.value[messageIndex],
						private_message: {
							...localMessages.value[messageIndex].private_message,
							body: result.editMessage.message.private_message.body,
							body_html: result.editMessage.message.private_message.body_html
						}
					};
				}

				toast.addNotification({
					header: 'Message updated',
					message: 'Your message has been successfully updated.',
					type: 'success'
				});

				cancelEditMessage();
			} else {
				toast.addNotification({
					header: 'Failed to edit message',
					message: 'Please try again.',
					type: 'error'
				});
			}
		} catch (error) {
			console.error('Error editing message:', error);
			toast.addNotification({
				header: 'Failed to edit message',
				message: 'Please try again.',
				type: 'error'
			});
		} finally {
			isEditingMessage.value = false;
		}
	};

	// Delete a message
	const deleteMessage = async (message) => {
		if (!confirm('Are you sure you want to delete this message?')) return;

		try {
			const result = await GqlDeleteMessage({
				messageId: message.id
			});

			if (result?.deleteMessage?.success) {
				// Remove the message from the local array
				localMessages.value = localMessages.value.filter(m => m.id !== message.id);

				toast.addNotification({
					header: 'Message deleted',
					message: 'Your message has been successfully deleted.',
					type: 'success'
				});
			} else {
				toast.addNotification({
					header: 'Failed to delete message',
					message: 'Please try again.',
					type: 'error'
				});
			}
		} catch (error) {
			console.error('Error deleting message:', error);
			toast.addNotification({
				header: 'Failed to delete message',
				message: 'Please try again.',
				type: 'error'
			});
		}
	};

	// Load messages on mount
	onMounted(() => {
		fetchMessages();
		textarea.value?.focus();
	});

	// Watch for route changes to reload messages
	watch(() => route.params.id, () => {
		if (route.params.id) {
			fetchMessages();
		}
	});
</script>