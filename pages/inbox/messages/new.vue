<template>
	<NuxtLayout name="inbox">
		<div class="flex flex-col h-full bg-white sm:shadow-inner-xs sm:rounded-md border-b sm:border overflow-hidden">
			<!-- Page Heading & Description -->
			<div class="flex items-center p-4 border-b">
				<h2 class="text-lg font-medium leading-6 text-gray-900 capitalize">Messages</h2>
				<div class="ml-auto flex items-center space-x-4">
					<p class="text-sm text-gray-600">
						<strong>{{ unreadCount ?? 0 }}</strong> unread messages
					</p>
					<button class="button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
						&#10003; Mark all read
					</button>
				</div>
			</div>
			<div class="flex flex-col bg-white mt-4 px-4">
				<!-- Form -->
				<input autocomplete="off" required type="text" class="form-input gray" placeholder="Enter a name" v-model="username"/>
				<!-- Suggestions -->
				<ul v-if="suggestions.length"></ul>
			</div>
			<!-- Empty State -->
			<div v-if="!suggestions.length" class="flex flex-col flex-grow items-center justify-center p-4 text-center text-gray-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="mb-2 w-6 h-6 text-gray-300" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z"></path>
					<path d="M13.5 6.5l4 4"></path>
					<path d="M16 18h4m-2 -2v4"></path>
				</svg>
				<p>
					<span class="font-medium">
						Start a conversation
					</span>
					<br/>
					Search for someone to message them
				</p>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
	const suggestions = ref([]);

	const username = ref(null);
</script>