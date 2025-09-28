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
		<!-- Posts -->
		<LazyListsPosts v-if="posts?.length" :posts="posts" :isCompact="!preferCardView" :isLoading="pending"
			:hasError="error" />
		<!-- Empty State -->
		<div v-else
			class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
			<p>
				<span class="font-medium">
					There are no posts
				</span>
				<br />
				but you can be the first...
			</p>
		</div>
		<!-- Pagination -->
		<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
			<LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
		</div>
	</NuxtLayout>
</template>

<script setup>
import { usePostsStore } from '@/stores/StorePosts';
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
const postsStore = usePostsStore();

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
		}
	}
`, {
	variables: {
		limit: limit.value,
		offset: (page.value - 1) * limit.value
	},
	ssr: false  // Force client-side execution for authentication
});

// Transform the data to match the expected format for posts
const items = computed(() => {
	if (!reportsData.value?.getPostReports) return [];

	return reportsData.value.getPostReports.map(report => ({
		id: report.postId,
		title: report.originalPostTitle,
		body: report.originalPostBody,
		url: report.originalPostUrl,
		creation_date: report.creationDate,
		// Add minimal required fields for the list component
		author: { name: 'Reported User' },
		board: { name: 'Unknown Board' },
		is_nsfw: false,
		is_locked: false,
		is_removed: false,
		is_featured: false,
		votes: 0,
		comment_count: 0
	}));
});

// Since backend doesn't provide total count, we'll estimate based on results
const totalCount = computed(() => {
	const reports = reportsData.value?.getPostReports || [];
	// If we got a full page, assume there might be more
	return reports.length === limit.value ? (page.value * limit.value) + 1 : (page.value - 1) * limit.value + reports.length;
});

if (error.value && error.value.response) {
	throw createError({
		statusCode: 404,
		statusMessage: 'We could not find the page you were looking for. Try better next time.',
		fatal: true
	})
};

postsStore.posts = items.value;
const posts = postsStore.posts;

const totalPages = computed(() => {
	return Math.ceil(totalCount.value / limit.value || 1);
});

</script>
