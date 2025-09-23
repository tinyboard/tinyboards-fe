<template>
	<div class="flex flex-col">
		<div class="flex flex-col bg-white mt-4 px-4">
			<!-- Form -->
			<div class="relative">
				<input autocomplete="off" type="text" class="form-input gray" placeholder="Enter a username to search" v-model="username"/>
				<div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
					<svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				</div>
			</div>
		</div>
		<!-- Suggestions -->
		<ul v-if="users?.length" class="flex flex-col h-full sm:p-4 sm:overflow-y-auto">
			<li v-for="user in users" :key="user.id">
				<NuxtLink :to="`/inbox/messages/${user.id}`" class="flex items-center p-2 hover:bg-gray-100 rounded-md">
					<!-- Avatar -->
					<img :src="user.avatar || '/media/file_not_found.png'" alt="avatar" class="flex-shrink-0 object-cover w-9 h-9 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
					<div class="ml-2">
						<strong class="text-sm text-secondary">
							{{ user.displayName || user.name }}
						</strong>
						<p class="text-xs text-gray-500">@{{ user.name }}</p>
					</div>
				</NuxtLink>
			</li>
		</ul>
		<!-- Empty State -->
		<div v-if="!users?.length && !isSearching" class="flex flex-col flex-grow items-center justify-center p-4 text-center text-gray-500">
			<svg xmlns="http://www.w3.org/2000/svg" class="mb-2 w-6 h-6 text-gray-300" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				<path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z"></path>
				<path d="M13.5 6.5l4 4"></path>
				<path d="M16 18h4m-2 -2v4"></path>
			</svg>
			<p>
				<span class="font-medium">
					{{ username.trim() ? 'No users found' : 'Start a conversation' }}
				</span>
				<br/>
				{{ username.trim() ? 'Try a different search term' : 'Search for someone to message them' }}
			</p>
		</div>
	</div>
</template>

<script setup>
	import { useToastStore } from "@/stores/StoreToast";

	// Simple debounce implementation
	const debounce = (func, wait) => {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	definePageMeta({
		'hasAuthRequired': true
	});

	const users = ref([]);
	const username = ref('');
	const isSearching = ref(false);
	const toast = useToastStore();

	// Debounced search function to avoid too many API calls
	const fetchMembers = debounce(async () => {
		if (!username.value.trim()) {
			users.value = [];
			return;
		}

		isSearching.value = true;
		try {
			const { data: result } = await useAsyncGql({
				operation: 'listMembers',
				variables: {
					searchTerm: username.value.trim(),
					limit: 20,
					page: 1,
					sort: 'new',
					listingType: 'all'
				}
			});

			if (result.value?.listUsers) {
				users.value = result.value.listUsers;
			} else {
				users.value = [];
			}
		} catch (error) {
			console.error('Error searching users:', error);
			toast.addNotification({
				header: 'Search failed',
				message: 'Unable to search for users. Please try again.',
				type: 'error'
			});
			users.value = [];
		} finally {
			isSearching.value = false;
		}
	}, 300); // 300ms debounce

	watch(() => username.value, fetchMembers);
</script>