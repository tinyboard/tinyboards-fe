<template>
	<NuxtLayout name="admin">
		<!-- Page Heading & Description -->
		<div class="p-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Reported Comments</h3>
			<p class="mt-1 text-sm text-gray-600">Here are the comments that were reported to you by your users. Reported
				posts can be found <NuxtLink to="/admin/reports/posts">here</NuxtLink>.</p>
		</div>
		<!-- Reports List -->
		<div v-if="reports?.length" class="space-y-2">
			<div v-for="report in reports" :key="report.id" class="bg-white dark:bg-gray-950 border-b sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800 p-4">
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-2">
							<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
								Report #{{ report.id }}
							</span>
							<span class="text-sm text-gray-500">{{ formatDate(report.creationDate) }}</span>
						</div>
						<p class="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">{{ report.originalCommentText }}</p>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Reason:</strong> {{ report.reason }}</p>
					</div>
					<button
						@click="openResolveModal(report)"
						class="button green button-sm flex-shrink-0"
					>
						Resolve
					</button>
				</div>
			</div>
		</div>
		<!-- Empty State -->
		<div v-else
			class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
			<p>
				<span class="font-medium">
					No unresolved reports
				</span>
				<br />
				All reports have been handled.
			</p>
		</div>
		<!-- Pagination -->
		<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
			<LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
		</div>

		<!-- Resolve Modal -->
		<LazyDialogsModalResolveReport
			:is-open="modalStore.modal === 'resolveReport'"
			type="comment"
			:options="resolveOptions"
		/>
	</NuxtLayout>
</template>

<script setup>
import { useModalStore } from '@/stores/StoreModal';
import { useGraphQLQuery } from '~/composables/useGraphQL';
import { format } from 'date-fns';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Comment Reports',
	isFooterDisabled: true,
	isScrollDisabled: true,
	requirePermission: "content",
    'isLeftNavbarDisabled': true
});

const route = useRoute();
const modalStore = useModalStore();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 25);

// Fetch reported comments using GraphQL with explicit query string (client-side only)
const { data: reportsData, pending, error, refresh } = await useGraphQLQuery(`
	query GetCommentReports($limit: Int!, $offset: Int!) {
		getCommentReports(limit: $limit, offset: $offset) {
			id
			creatorId
			commentId
			originalCommentText
			reason
			resolved
			resolverId
			creationDate
			updated
		}
	}
`, {
	variables: {
		limit: limit.value,
		offset: (page.value - 1) * limit.value
	},
	ssr: false  // Force client-side execution for authentication
});

// Filter only unresolved reports
const reports = computed(() => {
	if (!reportsData.value?.getCommentReports) return [];
	return reportsData.value.getCommentReports.filter(report => !report.resolved);
});

// Since backend doesn't provide total count, we'll estimate based on results
const totalCount = computed(() => {
	// If we got a full page, assume there might be more
	return reports.value.length === limit.value ? (page.value * limit.value) + 1 : (page.value - 1) * limit.value + reports.value.length;
});

if (error.value && error.value.response) {
	throw createError({
		statusCode: 404,
		statusMessage: 'We could not find the page you were looking for. Try better next time.',
		fatal: true
	})
};

const totalPages = computed(() => {
	return Math.ceil(totalCount.value / limit.value || 1);
});

// Resolve modal
const resolveOptions = ref({});

const openResolveModal = (report) => {
	resolveOptions.value = {
		reportId: report.id,
		reason: report.reason,
		commentText: report.originalCommentText,
		onResolved: () => {
			refresh();
		}
	};
	modalStore.openModal('resolveReport');
};

const formatDate = (dateString) => {
	try {
		return format(new Date(dateString), 'MMM d, yyyy h:mm a');
	} catch (e) {
		return dateString;
	}
};

</script>
