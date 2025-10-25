<template>
	<NuxtLayout name="admin">
		<!-- Page Heading & Description -->
		<div class="p-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Reported Posts</h3>
			<p class="mt-1 text-sm text-gray-600">Here are the posts that were reported to you by your users. Reported
				comments can be found <NuxtLink to="/admin/reports/comments">here</NuxtLink>.</p>
		</div>
		<!-- View Options -->
		<div
			class="flex items-center mb-4 p-2.5 sm:px-4 sm:py-3 bg-gray-100 dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md dark:border-gray-800 dark:shadow-none">
			<div class="ml-auto flex space-x-2">
				<button class="ml-auto" @click="preferCardView = true">
					<!-- Rows Icon -->
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
						:class="preferCardView ? 'text-primary' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<rect x="4" y="4" width="16" height="6" rx="2"></rect>
						<rect x="4" y="14" width="16" height="6" rx="2"></rect>
					</svg>
				</button>
				<button class="ml-auto" @click="preferCardView = false">
					<!-- Cards Icon -->
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
						:class="preferCardView ? 'text-gray-500' : 'text-primary'" viewBox="0 0 24 24" stroke-width="2"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<rect x="4" y="4" width="16" height="16" rx="2"></rect>
						<line x1="4" y1="12" x2="20" y2="12"></line>
					</svg>
				</button>
			</div>
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
						<h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">{{ report.originalPostTitle }}</h4>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Reason:</strong> {{ report.reason }}</p>
						<NuxtLink :to="getPostUrl(report.post)" class="text-sm text-primary hover:underline">View post →</NuxtLink>
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
			type="post"
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
	'title': 'Post Reports',
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

// Fetch reported posts using GraphQL with explicit query string (client-side only)
const { data: reportsData, pending, error, refresh } = await useGraphQLQuery(`
	query GetPostReports($limit: Int!, $offset: Int!) {
		getPostReports(limit: $limit, offset: $offset) {
			id
			creatorId
			postId
			originalPostTitle
			originalPostUrl
			originalPostBody
			reason
			resolved
			resolverId
			creationDate
			updated
			post {
				id
				title
				titleChunk
				slug
				postType
				urlPath
				board {
					name
				}
			}
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
	if (!reportsData.value?.getPostReports) return [];
	return reportsData.value.getPostReports.filter(report => !report.resolved);
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
		postTitle: report.originalPostTitle,
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

// Helper function to construct post URLs based on postType
const getPostUrl = (post) => {
	// Use urlPath if available
	if (post?.urlPath) return post.urlPath;
	if (!post) return '#';

	const slug = post.slug || post.titleChunk || 'post';
	// Map backend postType to route segment (thread -> threads)
	const typeSegment = post.postType === 'thread' ? 'threads' : 'feed';

	if (site.enableBoards && post.board) {
		return `/b/${post.board.name}/${typeSegment}/${post.id}/${slug}`;
	}

	return `/${typeSegment}/${post.id}/${slug}`;
};

</script>
