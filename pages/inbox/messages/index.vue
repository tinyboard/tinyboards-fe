<template>
	<NuxtLayout name="inbox">
		<div class="flex flex-col h-full bg-white sm:shadow-inner-white sm:rounded-md border-b sm:border overflow-hidden">
			<!-- Page Heading & Description -->
			<div class="flex items-center p-4 border-b">
				<h2 class="text-lg font-bold leading-6 text-gray-900 capitalize">Messages</h2>
				<div class="ml-auto flex items-center space-x-4">
					<p class="text-sm text-gray-600">
						<strong>{{ unreadCount ?? 0 }}</strong> unread messages
					</p>
					<button class="button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
						&#10003; Mark all read
					</button>
				</div>
			</div>
			<!-- Messages -->
			<!-- <ul v-if="notifications[type]?.length" class="divide-y divide-gray-100 border-b border-gray-100">
				<li v-for="(notification, i) in notifications[type]" :key="i" class="p-2.5 sm:p-4 flex" :class="{'bg-gray-100':notification.comment_reply?.read || notification.user_mention?.read}">
					<LazyCardsNotification :notification="notification"/>
				</li>
			</ul> -->
			<!-- Empty State -->
			<div class="flex flex-col flex-grow items-center justify-center p-4 text-center text-gray-500">
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
			<!-- Pagination -->
			<!-- <LazyNavigationPaginate v-if="totalPages > 1" :total-pages="totalPages" :per-page="limit" :current-page="page" class="p-2.5 sm:p-4"/> -->
		</div>
	</NuxtLayout>
</template>

<script setup>
	definePageMeta({
		'hasAuthRequired': true
	});
</script>