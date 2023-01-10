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
				<ul v-if="users?.length" class="mt-4 flex flex-col mb-2">
					<li v-for="(user,i) in users" :key="i">
						<NuxtLink :to="`/inbox/messages/${user.name}`" class="flex items-center -mx-2 p-2 hover:bg-gray-100 rounded-md">
							<!-- Avatar -->
							<img :src="user.avatar || 'https://placekitten.com/36/36'" alt="avatar" class="flex-shrink-0 object-cover w-9 h-9 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
							<strong class="text-sm text-secondary ml-2">
								{{ user.name }}
							</strong>
						</NuxtLink>
					</li>
				</ul>
			</div>
			<!-- Empty State -->
			<div v-if="!users?.length" class="flex flex-col flex-grow items-center justify-center p-4 text-center text-gray-500">
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
	import { baseURL } from '@/server/constants';

	definePageMeta({
		'hasAuthRequired': true
	});

	const users = ref([]);

	const username = ref(null);

	const authCookie = useCookie("token").value;

	const fetchMembers = () => {
		useFetch(`/names`, {
			query: {
				q: username.value
			},
			baseURL,
			headers: {
				Authorization: authCookie ? `Bearer ${authCookie}` : '',
			}
		})
		.then(({ data, error }) => {
			if (data.value) {
				users.value = data.value.users;
			}
		});
	};

	watch(() => username.value, () => fetchMembers());
</script>