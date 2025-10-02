<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Board Settings</h3>
				<p class="mt-1 text-sm text-gray-600">This is where you can find all the settings related to boards.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="submitSettings" class="sm:border sm:rounded-md overflow-y-auto">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Boards -->
					<div id="boards" class="md:grid md:grid-cols-3 md:gap-6 target:bg-blue-300 target:bg-opacity-20">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Enable Boards</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="boards" :isEnabled="settings.boards_enabled" @enabled="settings.boards_enabled = !settings.boards_enabled" />
								<label for="boards" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Enable
									boards</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Boards are user-created communities on your site where content is moderated by your users.
								The default board will always belong to the admins.
							</p>
						</div>
					</div>
					<!-- Board Creation Mode -->
					<div v-if="settings.boards_enabled" class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Board Creation Mode</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<select
								v-model="settings.boardCreationMode"
								class="form-input w-full sm:w-auto"
							>
								<option value="Open">Open - Anyone can create boards</option>
								<option value="TrustedUsers">Trusted Users - Only approved users</option>
								<option value="AdminOnly">Admin Only - Only administrators</option>
								<option value="Disabled">Disabled - No new boards</option>
							</select>
							<p class="mt-2 text-sm text-gray-500">
								Control who can create new boards on your site.
							</p>
						</div>
					</div>

					<!-- Trusted Users Settings -->
					<div v-if="settings.boards_enabled && settings.boardCreationMode === 'TrustedUsers'" class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Trusted User Requirements</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 space-y-4">
							<div>
								<label for="min-reputation" class="block text-sm font-medium text-gray-900 mb-1">
									Minimum Reputation
								</label>
								<input
									id="min-reputation"
									type="number"
									v-model.number="settings.trustedUserMinReputation"
									class="form-input w-full sm:w-48"
									min="0"
								/>
								<p class="mt-1 text-xs text-gray-500">
									Total karma (post score + comment score) required
								</p>
							</div>

							<div>
								<label for="min-account-age" class="block text-sm font-medium text-gray-900 mb-1">
									Minimum Account Age (days)
								</label>
								<input
									id="min-account-age"
									type="number"
									v-model.number="settings.trustedUserMinAccountAgeDays"
									class="form-input w-full sm:w-48"
									min="0"
								/>
								<p class="mt-1 text-xs text-gray-500">
									How many days old the account must be
								</p>
							</div>

							<div>
								<label for="min-posts" class="block text-sm font-medium text-gray-900 mb-1">
									Minimum Posts
								</label>
								<input
									id="min-posts"
									type="number"
									v-model.number="settings.trustedUserMinPosts"
									class="form-input w-full sm:w-48"
									min="0"
								/>
								<p class="mt-1 text-xs text-gray-500">
									Number of posts the user must have made
								</p>
							</div>

							<div class="flex items-center text-sm">
								<InputsSwitch
									id="manual-approval"
									:isEnabled="settings.trustedUserManualApproval"
									@enabled="settings.trustedUserManualApproval = !settings.trustedUserManualApproval"
								/>
								<label for="manual-approval" class="ml-2 font-medium text-gray-900">
									Require Manual Approval
								</label>
							</div>
							<p class="text-xs text-gray-500">
								If enabled, users must also be manually approved by an admin even if they meet the automatic requirements.
							</p>
						</div>
					</div>

					<!-- Trusted Users List -->
					<div v-if="settings.boards_enabled && settings.boardCreationMode === 'TrustedUsers'" class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Manage Trusted Users</p>
							<p class="mt-1 text-sm text-gray-500">
								Search and manage users with board creation approval.
							</p>
						</div>
						<!-- Content -->
						<div class="mt-4 md:col-span-2 md:mt-0 space-y-4">
							<!-- Search -->
							<div class="flex gap-2">
								<input
									type="text"
									v-model="searchTerm"
									@keyup.enter="searchTrustedUsers"
									placeholder="Search users..."
									class="form-input flex-1"
								/>
								<button
									type="button"
									@click="searchTrustedUsers"
									class="button primary"
									:disabled="trustedUsersLoading"
								>
									Search
								</button>
							</div>

							<!-- Users List -->
							<div v-if="trustedUsersLoading" class="text-center py-4 text-gray-500">
								Loading users...
							</div>
							<div v-else-if="trustedUsers.length === 0" class="text-center py-4 text-gray-500">
								No users found. Search for users to manage their board creation approval.
							</div>
							<div v-else class="space-y-2">
								<div
									v-for="user in trustedUsers"
									:key="user.id"
									class="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
								>
									<img
										v-if="user.avatar"
										:src="user.avatar"
										:alt="user.name"
										class="w-10 h-10 rounded-full"
									/>
									<div
										v-else
										class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
									>
										{{ user.name[0].toUpperCase() }}
									</div>
									<div class="flex-1">
										<NuxtLink :to="`/@${user.name}`" class="font-medium text-gray-900 hover:text-primary">
											@{{ user.name }}
										</NuxtLink>
										<div class="text-xs text-gray-500">
											Rep: {{ user.rep }} | Posts: {{ user.postCount }}
											<span v-if="user.boardCreationApproved" class="text-green-600 font-semibold ml-2">✓ Trusted</span>
										</div>
									</div>
									<button
										v-if="user.boardCreationApproved"
										type="button"
										@click="toggleTrust(user.id, false)"
										class="button red text-sm"
										:disabled="toggleTrustLoading"
									>
										Revoke Trust
									</button>
									<button
										v-else
										type="button"
										@click="toggleTrust(user.id, true)"
										class="button green text-sm"
										:disabled="toggleTrustLoading"
									>
										Trust User
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4">
					<button type="submit" class="button primary" :class="{ 'loading': isLoading }" :disabled="isLoading">
						Save
					</button>
				</div>
			</form>
		</div>
	</NuxtLayout>
</template>
<script setup>
import { ref } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Settings',
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "boards",
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();

// Fetch site settings using GraphQL with explicit query string
const { data, pending, error, refresh } = await useGraphQLQuery(`
    query GetSite {
        site {
            boardsEnabled
            boardCreationAdminOnly
            boardCreationMode
            trustedUserMinReputation
            trustedUserMinAccountAgeDays
            trustedUserManualApproval
            trustedUserMinPosts
        }
    }
`);

// Settings.
const settings = ref({});

if (data.value) {
	settings.value = {
		boards_enabled: data.value.site.boardsEnabled,
		boardCreationAdminOnly: data.value.site.boardCreationAdminOnly,
		boardCreationMode: data.value.site.boardCreationMode || 'Open',
		trustedUserMinReputation: data.value.site.trustedUserMinReputation || 0,
		trustedUserMinAccountAgeDays: data.value.site.trustedUserMinAccountAgeDays || 0,
		trustedUserManualApproval: data.value.site.trustedUserManualApproval || false,
		trustedUserMinPosts: data.value.site.trustedUserMinPosts || 0
	};
};

// Trusted users management
const searchTerm = ref('');
const trustedUsers = ref([]);
const trustedUsersLoading = ref(false);
const toggleTrustLoading = ref(false);
const trustedUsersPage = ref(1);
const trustedUsersLimit = ref(20);

// Fetch trusted users
const fetchTrustedUsers = async () => {
	trustedUsersLoading.value = true;
	try {
		const { data: usersData } = await useGraphQLQuery(`
			query ListUsers($limit: Int, $page: Int, $searchTerm: String) {
				listUsers(limit: $limit, page: $page, searchTerm: $searchTerm) {
					id
					name
					avatar
					creationDate
					rep
					postCount
					boardCreationApproved
				}
			}
		`, {
			variables: {
				limit: trustedUsersLimit.value,
				page: trustedUsersPage.value,
				searchTerm: searchTerm.value || null
			}
		});

		if (usersData.value) {
			trustedUsers.value = usersData.value.listUsers;
		}
	} catch (err) {
		console.error('Failed to fetch trusted users:', err);
		toast.addNotification({
			header: 'Failed to load users',
			message: 'Could not load user list.',
			type: 'error'
		});
	} finally {
		trustedUsersLoading.value = false;
	}
};

// Search trusted users
const searchTrustedUsers = async () => {
	trustedUsersPage.value = 1;
	await fetchTrustedUsers();
};

// Toggle trust mutation - can both grant and revoke trust
const toggleTrust = async (userId, approved) => {
	toggleTrustLoading.value = true;
	try {
		const { data: result } = await useGraphQLMutation(`
			mutation UpdateUserBoardCreationApproval($userId: Int!, $approved: Bool!) {
				updateUserBoardCreationApproval(userId: $userId, approved: $approved) {
					id
					boardCreationApproved
				}
			}
		`, {
			variables: { userId, approved }
		});

		if (result.value) {
			toast.addNotification({
				header: approved ? 'Trust granted' : 'Trust revoked',
				message: approved
					? 'User can now create boards.'
					: 'User board creation approval has been revoked.',
				type: 'success'
			});
			await fetchTrustedUsers();
		}
	} catch (err) {
		toast.addNotification({
			header: 'Failed to update trust',
			message: 'Could not update board creation approval for this user.',
			type: 'error'
		});
		console.error('Failed to update trust:', err);
	} finally {
		toggleTrustLoading.value = false;
	}
};

// Submit settings using GraphQL.
const isLoading = ref(false);

const submitSettings = async () => {
	isLoading.value = true;

	try {
		const { data: result } = await useGraphQLMutation(`
			mutation UpdateSiteConfig($input: UpdateSiteConfigInput!) {
				updateSiteConfig(input: $input) {
					boardsEnabled
					boardCreationAdminOnly
					boardCreationMode
					trustedUserMinReputation
					trustedUserMinAccountAgeDays
					trustedUserManualApproval
					trustedUserMinPosts
				}
			}
		`, {
			variables: {
				input: {
					boardsEnabled: settings.value.boards_enabled,
					boardCreationAdminOnly: settings.value.boardCreationAdminOnly,
					boardCreationMode: settings.value.boardCreationMode,
					trustedUserMinReputation: settings.value.trustedUserMinReputation,
					trustedUserMinAccountAgeDays: settings.value.trustedUserMinAccountAgeDays,
					trustedUserManualApproval: settings.value.trustedUserManualApproval,
					trustedUserMinPosts: settings.value.trustedUserMinPosts
				}
			}
		});

		if (result.value) {
			// Show success toast.
			toast.addNotification({ 
				header: 'Settings saved', 
				message: 'Site settings were updated!', 
				type: 'success' 
			});

			// Update local data without full reload
			settings.value = { ...settings.value, ...result.value.updateSiteConfig };
		}
	} catch (error) {
		// Show error toast.
		toast.addNotification({ 
			header: 'Saving failed', 
			message: 'Site settings have failed to save.', 
			type: 'error' 
		});
		// Log the error.
		console.error('Failed to update site config:', error);
	} finally {
		isLoading.value = false;
	}
};
</script>