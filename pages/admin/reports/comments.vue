<template>
	<NuxtLayout name="admin">
		<!-- Page Heading & Description -->
		<div class="p-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Reported Comments</h3>
			<p class="mt-1 text-sm text-gray-600">Here are the comments that were reported to you by your users. Reported
				posts can be found <NuxtLink to="/admin/reports/posts">here</NuxtLink>.</p>
		</div>
		<!-- Comments -->
		<LazyListsComments v-if="comments?.length" :comments="comments" :hasError="error" :cards="true" />
		<!-- Empty State -->
		<div v-else
			class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
			<p>
				<span class="font-medium">
					This place is empty
				</span>
				<br />
				Looks like there is nothing to moderate. Enjoy your day off...
			</p>
		</div>
		<!-- Pagination -->
		<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
			<LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
		</div>
	</NuxtLayout>
</template>

<script setup>
// import { useCommentsStore } from '@/stores/StoreComments';
import { useGraphQLQuery } from '~/composables/useGraphQL';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Queue',
	isFooterDisabled: true,
	isScrollDisabled: true,
	requirePermission: "content",
    'isLeftNavbarDisabled': true
});

const preferCardView = useCookie('preferCardView') ?? false;

const route = useRoute();
// const commentsStore = useCommentsStore();

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

// Transform the data to match the expected format for comments
const items = computed(() => {
	if (!reportsData.value?.getCommentReports) return [];

	return reportsData.value.getCommentReports.map(report => ({
		id: report.commentId,
		body: report.originalCommentText,
		creation_date: report.creationDate,
		// Add minimal required fields for the list component
		author: { name: 'Reported User', avatar: null },
		post: { id: 0, title: 'Unknown Post', board: { name: 'Unknown Board' } },
		is_removed: false,
		votes: 0,
		reply_count: 0
	}));
});

// Since backend doesn't provide total count, we'll estimate based on results
const totalCount = computed(() => {
	const reports = reportsData.value?.getCommentReports || [];
	// If we got a full page, assume there might be more
	return reports.length === limit.value ? (page.value * limit.value) + 1 : (page.value - 1) * limit.value + reports.length;
});

//console.log(`comments are ${JSON.stringify(items.value, null, 4)}`);

if (error.value && error.value.response) {
	throw createError({
		statusCode: 404,
		statusMessage: 'We could not find the page you were looking for. Try better next time.',
		fatal: true
	})
};

// commentsStore.comments = items;
const comments = items.value;

const totalPages = computed(() => {
	return Math.ceil(totalCount.value / limit.value || 1);
});

</script>
