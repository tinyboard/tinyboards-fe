<template>
	<NuxtLayout name="admin">
		<div class="flex pt-4 px-4">
			<!-- Page Heading & Description -->
			<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900">Invites</h3>
				<p class="mt-1 text-sm text-gray-600">
					Manage invite codes for your tinyboard. 
					<span v-if="site.registration_mode === 'InviteOnlyAdmin'">Only admins can create invites.</span>
					<span v-else-if="site.registration_mode === 'InviteOnlyUser'">Admins and users can create invites.</span>
					<span v-else>Invites are not currently required for registration.</span>
				</p>
			</div>
			<button v-if="site.registration_mode === 'InviteOnlyAdmin' || site.registration_mode === 'InviteOnlyUser'" @click="createInvite"
				class="ml-auto flex items-center button green">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Create invite
			</button>
		</div>

		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Header -->
			<div class="grid grid-cols-6 p-4">
				<span class="col-span-3 sm:col-span-2 text-gray-500 text-sm font-medium uppercase">
					Invite Code
				</span>
				<span class="col-span-1 sm:col-span-2 text-gray-500 text-sm font-medium uppercase">
					Uses
				</span>
				<span class="col-span-1 text-gray-500 text-sm font-medium uppercase">
					Expires
				</span>
				<span class="col-span-1 text-gray-500 text-sm font-medium uppercase text-right">
					Options
				</span>
			</div>
			<!-- Rows -->
			<ul v-if="invites?.invites.length" class="flex flex-col">
				<li v-for="invite in invites.invites" :key="invite.id"
					class="relative group grid grid-cols-6 p-4 odd:bg-gray-50 hover:bg-gray-100 border-b last:border-0 shadow-inner-white">
					<div class="col-span-3 sm:col-span-2 truncate mr-4">
						<NuxtLink external :to="`/register?invite=${invite.invite.verification_code}`" target="_blank">
							<span class="font-mono">{{ invite.invite.verification_code.substring(0, 12) }}</span>...
						</NuxtLink>
					</div>
					<div class="col-span-1 sm:col-span-2">
						0
					</div>
					<div class="col-span-1">
						1 use
					</div>
					<div class="col-span-1 flex justify-end">
						<button @click="deleteInvite(invite.invite.id)" class="px-1 text-gray-500 hover:text-red-700">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
								stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M4 7h16"></path>
								<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
								<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
								<path d="M10 12l4 4m0 -4l-4 4"></path>
							</svg>
						</button>
					</div>
				</li>
			</ul>
		</div>
		<!-- Pagination -->
		<div v-if="totalPages > 1" class="col-span-full mb-4 px-2.5 sm:px-4">
			<NavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
		</div>
	</NuxtLayout>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';

const route = useRoute();

definePageMeta({
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "users",
    'isLeftNavbarDisabled': true
});

const authCookie = useCookie("token").value;
const toast = useToastStore();

// Fetch site settings using GraphQL with explicit query string
const { data: siteData, pending: sitePending, error: siteError } = await useGraphQLQuery(`
	query GetSite {
		site {
			name
			site_mode
			registration_mode
		}
	}
`);
const site = computed(() => siteData.value?.site || {});

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 10);

// Fetch invites using GraphQL with explicit query string
const { data: invitesData, pending: pendingInvites, error: errorInvites, refresh: refreshInvites } = await useGraphQLQuery(`
	query ListInvites($limit: Int!, $page: Int!) {
		listInvites(limit: $limit, page: $page) {
			invites {
				id
				invite {
					id
					verification_code
					created_at
					expires_at
					used
					usage_count
					max_uses
				}
				creator {
					name
				}
			}
			total_count
		}
	}
`, {
	variables: {
		limit: limit.value,
		page: page.value
	}
});
const invites = computed(() => invitesData.value?.listInvites || { invites: [], total_count: 0 });

const totalPages = computed(() => {
	return (invites.value.total_count / limit.value) || 1;
})

// Create invite
const isLoading = ref(false);

const createInvite = async () => {
	isLoading.value = true;
	
	try {
		const { data: result } = await useGraphQLMutation(`
			mutation CreateInvite {
				createInvite {
					inviteCode
					success
				}
			}
		`);

		if (result.value?.createInvite?.inviteCode) {
			// Refetch invites.
			refreshInvites();
			// Show success toast with invite code
			toast.addNotification({ 
				header: 'Invite created', 
				message: `Invite code: ${result.value.createInvite.inviteCode}`, 
				type: 'success' 
			});
		}
	} catch (error) {
		// Show error toast.
		toast.addNotification({ 
			header: 'Failed creating invite', 
			message: error.message || 'Please try again.', 
			type: 'error' 
		});
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};

const deleteInvite = async (invite) => {
	isLoading.value = true;
	
	try {
		const { data: result } = await useGraphQLMutation(`
			mutation DeleteInvite($inviteId: ID!) {
				deleteInvite(inviteId: $inviteId) {
					success
				}
			}
		`, {
			variables: { inviteId: invite }
		});

		if (result.value?.deleteInvite?.success) {
			// Refetch invites
			refreshInvites();
			// Show success toast
			toast.addNotification({ 
				header: 'Invite deleted', 
				message: 'The invite code was deleted.', 
				type: 'success' 
			});
		}
	} catch (error) {
		// Show error toast
		toast.addNotification({ 
			header: 'Failed deleting invite', 
			message: error.message || 'Please try again.', 
			type: 'error' 
		});
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};
</script>