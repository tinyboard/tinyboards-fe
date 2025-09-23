<template>
	<NuxtLayout name="inbox">
		<div
			class="flex flex-col h-full bg-white sm:shadow-inner-white sm:rounded-md border-b sm:border sm:overflow-hidden">
			<!-- Page Heading & Description -->
			<div class="flex items-center p-4 border-b">
				<h2 class="text-lg font-bold leading-6 text-gray-900 capitalize">
					Messages
				</h2>
				<div class="ml-auto flex items-center">
					<p class="text-sm text-gray-600">
						<strong>{{ unreadCount ?? 0 }}</strong> unread messages
					</p>
					<button class="ml-4 button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
						&#10003; Mark all read
					</button>
					<button v-if="route.params?.id" class="ml-2 flex items-center button button-sm gray" @click="markRead"
						:disabled="unreadCount === 0 || isLoading">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24" stroke-width="2"
							stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
			<div class="grid grid-cols-12 h-full sm:overflow-hidden">
				<ul class="col-span-12 md:col-span-12 h-full divide-y md:border-r sm:overflow-y-auto">
					<li v-if="conversations.length === 0" class="p-4 text-center text-gray-500">
						No conversations found.
					</li>
					<li v-for="(conversation, i) in conversations" :key="conversation.id || i">
						<!--<NuxtLink :to="`/inbox/messages`" custom v-slot="{ href, navigate, isActive }">
							<a @click="navigate" class="flex p-2.5 hover:bg-gray-100 shadow-inner-white"
								:class="{ 'bg-gray-100': isActive }">-->
						<div class="p-2.5 hover:bg-gray-100 shadow-inner-white"
							:class="conversation.notif?.read ? 'bg-gray-100' : 'bg-blue-100'">
							<p class="mb-1 text-sm text-gray-900 font-bold">
								<span v-if="conversation.creator.id == 1">
									{{ site.name }} system notification
								</span>
								<span v-else>
									Message from @{{ conversation.creator.name }}
								</span>
							</p>
							<div class="flex">
								<img loading="lazy" :src="conversation.creator.avatar" alt="avatar"
									class="object-cover w-16 h-16 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent" />
								<span class="ml-2 text-gray-900">
									<strong class="text-sm"
										:class="conversation.creator.is_admin ? 'text-red-700' : 'text-gray-900'">
										{{ userStore.user.name === conversation.creator.name ?
											conversation.recipient_user.name : conversation.creator.name }}

										<span v-if="conversation.creator.is_admin" class="ml-1 badge badge-red">
											{{ conversation.creator.id == 1 ? "System" : "Admin" }}
										</span>
									</strong>
									<!--<p class="text-xs text-gray-600 font-medium">
											{{ conversation.private_message.subject }}
										</p>-->
									<div class="msg-body" v-html="conversation.message.body_html"></div>
								</span>
							</div>
						</div>
						<!--</a>
						</NuxtLink>-->
					</li>
				</ul>
				<!-- Nested Page -->
				<NuxtPage v-if="route.path !== '/inbox/messages'" class="col-span-8 overflow-hidden" />
				<!-- Empty State -->
				<!--<div v-else
					class="col-span-8 flex flex-col flex-grow items-center justify-center p-4 text-center text-gray-500 overflow-hidden">
					<p>
						<span class="font-medium">
							There are no messages in your inbox...
						</span>
						<br />
						how about composing a message
					<div class="mt-4 flex justify-center">
						<NuxtLink to="/inbox/messages/new" class="flex items-center button gray">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24"
								stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z"></path>
								<path d="M13.5 6.5l4 4"></path>
								<path d="M16 18h4m-2 -2v4"></path>
							</svg>
							Message someone
						</NuxtLink>
					</div>
					</p>
				</div>-->
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from "@/stores/StoreSite";
import { useToastStore } from "@/stores/StoreToast";
import { ref } from 'vue';

definePageMeta({
	'hasAuthRequired': true
});

const route = useRoute();
const userStore = useLoggedInUser();
const site = useSiteStore();
const toast = useToastStore();

const isLoading = ref(false);
const conversations = ref([]);
const unreadCount = ref(0);

// Fetch conversations using GraphQL
const fetchConversations = async () => {
	try {
		const { data: conversationsResult } = await useAsyncGql({
			operation: 'GetConversations'
		});

		if (conversationsResult.value?.listConversations) {
			conversations.value = conversationsResult.value.listConversations || [];
		}

		// Fetch unread count
		const { data: unreadResult } = await useAsyncGql({
			operation: 'GetUnreadMessageCount'
		});

		if (unreadResult.value?.getUnreadMessageCount !== undefined) {
			unreadCount.value = unreadResult.value.getUnreadMessageCount || 0;
		}
	} catch (error) {
		console.error('Error fetching conversations:', error);
		toast.addNotification({
			header: 'Error loading messages',
			message: 'Unable to load conversations. Please try again.',
			type: 'error'
		});
	}
};

// Mark all conversations as read
const markRead = async () => {
	if (unreadCount.value === 0) return;

	isLoading.value = true;
	try {
		// Mark conversations as read - this mutation expects userId parameter
		// We'll need to loop through conversations or implement a "mark all" mutation
		const promises = conversations.value.map(conv =>
			useAsyncGql({
				operation: 'markConversationRead',
				variables: {
					userId: conv.otherUser?.id || conv.creator?.id
				}
			})
		);

		await Promise.all(promises);

		unreadCount.value = 0;
		// Update conversations to mark them as read
		conversations.value = conversations.value.map(conv => ({
			...conv,
			unreadCount: 0
		}));

		toast.addNotification({
			header: 'Marked all read',
			message: 'All messages marked as read.',
			type: 'success'
		});
	} catch (error) {
		console.error('Error marking conversations as read:', error);
		toast.addNotification({
			header: 'Failed to mark all read',
			message: 'Please try again.',
			type: 'error'
		});
	} finally {
		isLoading.value = false;
	}
};

// Load conversations on mount
onMounted(() => {
	fetchConversations();
});
</script>

<style scoped>
/* Message Body */
.msg-body {
	@apply prose prose-sm break-words text-gray-900 max-w-none;
}

.msg-body :deep(p:first-of-type) {
	@apply mt-0;
}

.msg-body :deep(img) {
	max-width: 100px;
	aspect-ratio: auto;
}

@media (min-width: 768px) {
	.msg-body :deep(img) {
		max-width: 320px;
	}
}</style>