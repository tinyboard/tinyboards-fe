<template>
	<NuxtLayout name="inbox">
		<div class="flex flex-col h-full bg-white sm:shadow-inner-white sm:rounded-md border-b sm:border sm:overflow-hidden">
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
					<button v-if="route.params.id" class="ml-2 flex items-center button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
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
			<div class="grid grid-cols-12 h-full sm:overflow-hidden">
				<ul class="col-span-4 md:col-span-4 h-full divide-y md:border-r sm:overflow-y-auto">
					<li v-for="(conversation, i) in conversations.messages" :key="i">
						<NuxtLink :to="`/inbox/messages/${conversation.private_message.chat_id}`" custom v-slot="{ href, navigate, isActive }">
							<a @click="navigate" class="flex p-2.5 hover:bg-gray-100 shadow-inner-white" :class="{'bg-gray-100':isActive}">
								<img loading="lazy" :src="conversation.creator.avatar" alt="avatar" class="object-cover w-16 h-16 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
								<span class="ml-2 text-gray-900">
									<strong class="text-sm">
										{{ userStore.user.name === conversation.creator.name ? conversation.recipient.name : conversation.creator.name }}
									</strong>
									<p class="text-xs text-gray-600 font-medium">
										{{ conversation.private_message.subject }}
									</p>
									<div v-html="conversation.private_message.body"></div>
								</span>
							</a>
						</NuxtLink>
					</li>
				</ul>
				<!-- Nested Page -->
				<NuxtPage v-if="route.path !== '/inbox/messages'" class="col-span-8 overflow-hidden"/>
				<!-- Empty State -->
				<div v-else class="col-span-8 flex flex-col flex-grow items-center justify-center p-4 text-center text-gray-500 overflow-hidden">
					<p>
						<span class="font-medium">
							There are no messages in your inbox...
						</span>
						<br/>
						how about composing a message
						<div class="mt-4 flex justify-center">
							<NuxtLink to="/inbox/messages/new" class="flex items-center button gray">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								   <path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z"></path>
								   <path d="M13.5 6.5l4 4"></path>
								   <path d="M16 18h4m-2 -2v4"></path>
								</svg>
								Message someone
							</NuxtLink>
						</div>
					</p>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
	// import { baseURL } from '@/server/constants';
	import { useApi } from "@/composables/api";
	import { useLoggedInUser } from "@/stores/StoreAuth";

	definePageMeta({
		'hasAuthRequired': true
	});

	const route = useRoute();

	const authCookie = useCookie("token").value;

	const userStore = useLoggedInUser();

	const { data: conversations, pending, error, refresh } = await useApi('/messages', {
		query: {
			limit: 25,
			page: 1,
		}
	})
</script>