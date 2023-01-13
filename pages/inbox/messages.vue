<template>
	<NuxtLayout name="inbox">
		<div class="grid grid-cols-12 h-full bg-white sm:shadow-inner-white sm:rounded-md border-b sm:border sm:overflow-hidden">
			<!-- Page Heading & Description -->
			<div class="col-span-full flex items-center p-4 border-b">
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
			<ul class="col-span-full md:col-span-4 h-full divide-y divide-gray-100 md:border-r sm:overflow-y-auto">
					<li v-for="i in 20" class="p-4 leading-6">
						test
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
	</NuxtLayout>
</template>

<script setup>
	definePageMeta({
		'hasAuthRequired': true
	});

	const route = useRoute();
</script>