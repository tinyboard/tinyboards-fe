<template>
	<NuxtLayout name="admin">
		<div class="flex pt-4 px-4">
			<!-- Page Heading & Description -->
			<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900">Invites</h3>
				<p class="mt-1 text-sm text-gray-600">Here is a list of active invites to your tinyboard. Click the trash
					button to revoke.</p>
			</div>
			<button v-if="site.site_mode === 'InviteMode'" @click="createInvite"
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
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';

const route = useRoute();

definePageMeta({
	isFooterDisabled: true,
	isScrollDisabled: true,
	requirePermission: "users",
});

const authCookie = useCookie("token").value;
const toast = useToastStore();

// Fetch site settings
const { data: site, pending, error, refresh } = await useApi("/admin/site_settings");

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 10);

// Fetch invites
const { data: invites, pendingInvites, errorInvites, refresh: refreshInvites } = await useApi("/admin/invite", {
	query: {
		limit: limit.value,
		page: page.value
	},
	method: "get",
});

const totalPages = computed(() => {
	return (invites.value.total_count / limit.value) || 1;
})

// Create invite
const isLoading = ref(false);

const createInvite = () => {
	isLoading.value = true;
	useApi('/admin/invite', {
		method: "post",
		body: {},
	})
		.then(({ data, error }) => {
			if (data.value) {
				// Refetch invites.
				refreshInvites();
				// Show success toast.
				toast.addNotification({ header: 'Invite created', message: 'A fresh invite code was created!', type: 'success' });
			} else {
				// Show error toast.
				toast.addNotification({ header: 'Failed creating invite', message: 'Please try again.', type: 'error' });
				// Log the error.
				console.error(error.value);
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
};

const deleteInvite = (invite) => {
	isLoading.value = true;
	useApi(`/admin/invite/${invite}`, {
		method: "delete",
		body: {}
	})
		.then(({ data, error }) => {
			if (!error.value) {
				// Show success toast.
				toast.addNotification({ header: 'Invite deleted', message: 'The invite code was deleted.', type: 'success' });
			} else {
				// Show error toast.
				toast.addNotification({ header: 'Failed deleting invite', message: 'Please try again.', type: 'error' });
				// Log the error.
				console.error(error.value);
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
};
</script>