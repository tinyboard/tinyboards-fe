<template>
	<NuxtLayout name="admin">
		<div class="flex pt-4 justify-between">
			<!-- Page Heading & Description -->
			<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900">Registration Applications</h3>
				<p class="mt-1 text-sm text-gray-600">
					Review and approve registration applications for {{ site.name }}.
				</p>
			</div>
			<!-- Search Form -->
			<form>
				<input
					type="text"
					name="search_term"
					v-model="searchTerm"
					class="border-gray-300 rounded px-4 py-2"
					placeholder="Search applications..."
				/>
			</form>
		</div>

		<!-- Statistics Summary -->
		<div v-if="applicationCount !== null" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
			<div class="bg-white border rounded-lg p-4">
				<div class="text-2xl font-bold text-blue-600">{{ applicationCount }}</div>
				<div class="text-sm text-gray-600">Total Applications</div>
			</div>
			<div class="bg-white border rounded-lg p-4">
				<div class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</div>
				<div class="text-sm text-gray-600">Pending Review</div>
			</div>
			<div class="bg-white border rounded-lg p-4">
				<div class="text-2xl font-bold text-green-600">{{ approvedCount }}</div>
				<div class="text-sm text-gray-600">Approved Today</div>
			</div>
		</div>

		<!-- Bulk Actions Bar -->
		<div v-if="selectedApplications.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
			<div class="flex items-center justify-between">
				<span class="text-sm text-blue-800">
					{{ selectedApplications.length }} application{{ selectedApplications.length !== 1 ? 's' : '' }} selected
				</span>
				<div class="flex space-x-2">
					<button
						@click="bulkApprove"
						class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
						:disabled="bulkActionLoading"
					>
						{{ bulkActionLoading ? 'Processing...' : 'Approve Selected' }}
					</button>
					<button
						@click="bulkDeny"
						class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
						:disabled="bulkActionLoading"
					>
						{{ bulkActionLoading ? 'Processing...' : 'Deny Selected' }}
					</button>
					<button
						@click="clearSelection"
						class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
					>
						Clear Selection
					</button>
				</div>
			</div>
		</div>

		<!-- Applications Table -->
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Header - Desktop -->
			<div class="hidden md:grid grid-cols-12 p-4 border-b bg-gray-50">
				<div class="col-span-1 flex items-center">
					<input
						type="checkbox"
						:checked="allSelected"
						@change="toggleSelectAll"
						class="rounded border-gray-300 text-primary focus:ring-primary"
					/>
				</div>
				<span class="col-span-3 text-gray-500 text-sm font-medium uppercase">
					Applicant
				</span>
				<span class="col-span-4 text-gray-500 text-sm font-medium uppercase">
					Application
				</span>
				<span class="col-span-2 text-gray-500 text-sm font-medium uppercase">
					Submitted
				</span>
				<span class="col-span-2 text-gray-500 text-sm font-medium uppercase text-right">
					Actions
				</span>
			</div>

			<!-- Header - Mobile -->
			<div class="md:hidden p-4 border-b bg-gray-50 flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<input
						type="checkbox"
						:checked="allSelected"
						@change="toggleSelectAll"
						class="rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<span class="text-gray-500 text-sm font-medium uppercase">Select All Applications</span>
				</div>
			</div>

			<!-- Rows -->
			<ul v-if="applications?.listRegistrationApplications?.length" class="flex flex-col">
				<li
					v-for="application in applications.listRegistrationApplications"
					:key="application.id"
					class="relative group px-4 py-3 border-b last:border-0 hover:bg-gray-50"
				>
					<!-- Desktop Layout -->
					<div class="hidden md:grid grid-cols-12 items-center">
						<!-- Checkbox -->
						<div class="col-span-1 flex items-center">
							<input
								type="checkbox"
								:value="application.id"
								v-model="selectedApplications"
								class="rounded border-gray-300 text-primary focus:ring-primary"
							/>
						</div>

						<!-- Applicant Info -->
						<div class="col-span-3 flex items-center">
							<div class="flex flex-col">
								<p class="text-primary font-semibold">{{ application.username }}</p>
								<p class="text-xs text-gray-500" v-if="application.userId">User ID: {{ application.userId }}</p>
							</div>
						</div>

						<!-- Application Text -->
						<div class="col-span-4 flex items-center">
							<div class="w-full">
								<p class="text-sm text-gray-900 truncate" :title="application.answer">
									{{ application.answer || 'No application text provided' }}
								</p>
								<button
									v-if="application.answer && application.answer.length > 100"
									@click="viewApplication(application)"
									class="text-xs text-blue-600 hover:text-blue-800"
								>
									View full application
								</button>
							</div>
						</div>

						<!-- Creation Date -->
						<div class="col-span-2 flex items-center">
							<div class="text-sm text-gray-600">
								{{ formatApplicationDate(application.creationDate) }}
							</div>
						</div>

						<!-- Actions -->
						<div class="col-span-2 flex justify-end items-center space-x-2">
							<button
								@click="approveApplication(application.id)"
								class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
								:disabled="actionLoading"
								title="Approve application"
							>
								Approve
							</button>
							<button
								@click="denyApplication(application)"
								class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
								:disabled="actionLoading"
								title="Deny application"
							>
								Deny
							</button>
						</div>
					</div>

					<!-- Mobile Layout -->
					<div class="md:hidden space-y-3">
						<!-- Header with checkbox and actions -->
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<input
									type="checkbox"
									:value="application.id"
									v-model="selectedApplications"
									class="rounded border-gray-300 text-primary focus:ring-primary"
								/>
								<div class="flex flex-col">
									<p class="text-primary font-semibold">{{ application.username }}</p>
									<p class="text-xs text-gray-500">{{ formatApplicationDate(application.creationDate) }}</p>
								</div>
							</div>
							<div class="flex space-x-1">
								<button
									@click="approveApplication(application.id)"
									class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
									:disabled="actionLoading"
									title="Approve application"
								>
									Approve
								</button>
								<button
									@click="denyApplication(application)"
									class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
									:disabled="actionLoading"
									title="Deny application"
								>
									Deny
								</button>
							</div>
						</div>

						<!-- Application content -->
						<div class="pl-8">
							<p class="text-sm text-gray-900 line-clamp-2" :title="application.answer">
								{{ application.answer || 'No application text provided' }}
							</p>
							<button
								v-if="application.answer"
								@click="viewApplication(application)"
								class="mt-1 text-xs text-blue-600 hover:text-blue-800"
							>
								View full application
							</button>
						</div>
					</div>
				</li>
			</ul>

			<!-- Empty State -->
			<div v-else-if="!loading" class="bg-gray-50 text-center flex flex-col items-center p-16">
				<svg xmlns="http://www.w3.org/2000/svg" class="text-gray-500 w-20 h-20" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
					<path d="M6 21v-2a4 4 0 0 1 4 -4h3.5"></path>
					<path d="M19 22v.01"></path>
					<path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
				</svg>
				<h3 class="text-md font-semibold uppercase text-gray-500">No applications found</h3>
				<p class="text-sm text-gray-400">There are no registration applications to review at this time.</p>
			</div>

			<!-- Loading State -->
			<div v-else class="bg-gray-50 text-center flex flex-col items-center p-16">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				<p class="text-sm text-gray-400 mt-4">Loading applications...</p>
			</div>
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
import { useSiteStore } from '@/stores/StoreSite';
import { useModalStore } from '@/stores/StoreModal';
import { format, parseISO } from "date-fns";
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';

const route = useRoute();
const router = useRouter();

definePageMeta({
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "users",
	title: 'Registration Queue',
	isLeftNavbarDisabled: true
});

const authCookie = useCookie("token").value;
const toast = useToastStore();
const modalStore = useModalStore();
const site = useSiteStore();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 10);

// Search
const searchTerm = ref(route.query.search_term || "");

// Loading states
const loading = ref(false);
const actionLoading = ref(false);
const bulkActionLoading = ref(false);

// Selection state
const selectedApplications = ref([]);

// Fetch applications using GraphQL with explicit query string
const { data: applications, pending, error, refresh } = await useGraphQLQuery(`
	query ListRegistrationApplications($limit: Int!, $offset: Int!) {
		listRegistrationApplications(limit: $limit, offset: $offset) {
			id
			username
			userId
			answer
			creationDate
			status
		}
	}
`, {
	variables: {
		limit: limit.value,
		offset: (page.value - 1) * limit.value
	}
});

// Fetch application count using GraphQL with explicit query string
const { data: countData } = await useGraphQLQuery(`
	query RegistrationApplicationsCount {
		registrationApplicationsCount
	}
`);
const applicationCount = computed(() => countData.value?.registrationApplicationsCount || 0);

// Mock data for now - these would come from API
const pendingCount = computed(() => applications.value?.listRegistrationApplications?.length || 0);
const approvedCount = computed(() => 0); // This would be from an API call for today's approvals

const totalPages = computed(() => {
	return Math.ceil((applicationCount.value || 0) / limit.value) || 1;
});

// Selection helpers
const allSelected = computed(() => {
	const currentApplications = applications.value?.listRegistrationApplications || [];
	return currentApplications.length > 0 && selectedApplications.value.length === currentApplications.length;
});

// Watch for route changes
watch(
	() => route.query.page,
	async newPage => {
		await refresh();
	}
);

watch(
	() => searchTerm.value,
	async newSearch => {
		const query = JSON.parse(JSON.stringify(route.query));
		query.search_term = newSearch;
		router.replace({ query });
		await refresh();
	}
);

// Helper functions
const formatApplicationDate = (dateString) => {
	return format(parseISO(dateString), 'MMM dd, yyyy');
};

const toggleSelectAll = () => {
	const currentApplications = applications.value?.listRegistrationApplications || [];
	if (allSelected.value) {
		selectedApplications.value = [];
	} else {
		selectedApplications.value = currentApplications.map(app => app.id);
	}
};

const clearSelection = () => {
	selectedApplications.value = [];
};

const viewApplication = (application) => {
	modalStore.setModal({
		modal: 'ModalApplicationView',
		id: application.id,
		isOpen: true,
		options: {
			application: application
		}
	});
};

// Individual actions
const approveApplication = async (applicationId) => {
	actionLoading.value = true;
	try {
		const { data: result } = await useGraphQLMutation(`
			mutation ApproveRegistrationApplication($applicationId: Int!) {
				approveRegistrationApplication(applicationId: $applicationId)
			}
		`, {
			variables: { applicationId }
		});

		toast.addNotification({
			header: 'Application Approved',
			message: 'The registration application has been approved successfully.',
			type: 'success'
		});

		await refresh();
	} catch (error) {
		toast.addNotification({
			header: 'Approval Failed',
			message: 'Failed to approve the application. Please try again.',
			type: 'error'
		});
	} finally {
		actionLoading.value = false;
	}
};

const denyApplication = (application) => {
	modalStore.setModal({
		modal: 'ModalApplicationDeny',
		id: application.id,
		isOpen: true,
		options: {
			application: application,
			onSuccess: () => refresh()
		}
	});
};

// Bulk actions
const bulkApprove = async () => {
	if (selectedApplications.value.length === 0) return;

	bulkActionLoading.value = true;
	try {
		const { data: result } = await useGraphQLMutation(`
			mutation BulkApproveRegistrationApplications($applicationIds: [Int!]!) {
				bulkApproveRegistrationApplications(applicationIds: $applicationIds)
			}
		`, {
			variables: { applicationIds: selectedApplications.value }
		});

		toast.addNotification({
			header: 'Applications Approved',
			message: `Successfully approved ${selectedApplications.value.length} application(s).`,
			type: 'success'
		});

		selectedApplications.value = [];
		await refresh();
	} catch (error) {
		toast.addNotification({
			header: 'Bulk Approval Failed',
			message: 'Failed to approve the selected applications. Please try again.',
			type: 'error'
		});
	} finally {
		bulkActionLoading.value = false;
	}
};

const bulkDeny = async () => {
	if (selectedApplications.value.length === 0) return;

	bulkActionLoading.value = true;
	try {
		const { data: result } = await useGraphQLMutation(`
			mutation BulkDenyRegistrationApplications($applicationIds: [Int!]!) {
				bulkDenyRegistrationApplications(applicationIds: $applicationIds)
			}
		`, {
			variables: { applicationIds: selectedApplications.value }
		});

		toast.addNotification({
			header: 'Applications Denied',
			message: `Successfully denied ${selectedApplications.value.length} application(s).`,
			type: 'success'
		});

		selectedApplications.value = [];
		await refresh();
	} catch (error) {
		toast.addNotification({
			header: 'Bulk Denial Failed',
			message: 'Failed to deny the selected applications. Please try again.',
			type: 'error'
		});
	} finally {
		bulkActionLoading.value = false;
	}
};
</script>