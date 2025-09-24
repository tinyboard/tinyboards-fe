<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Removed Posts</h3>
				<p class="mt-1 text-sm text-gray-600">
					Posts that have been removed by administrators or moderators.
					<NuxtLink to="/admin/removed/comments" class="text-primary hover:text-primary/80">View removed comments</NuxtLink>.
				</p>
			</div>

			<!-- View Options -->
			<div class="flex items-center mb-4 p-2.5 sm:px-4 sm:py-3 bg-gray-100 border-b sm:border sm:shadow-inner-white sm:rounded-md">
				<div class="ml-auto flex space-x-2">
					<button @click="preferCardView = true">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
							:class="preferCardView ? 'text-primary' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2"
							stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<rect x="4" y="4" width="16" height="6" rx="2"></rect>
							<rect x="4" y="14" width="16" height="6" rx="2"></rect>
						</svg>
					</button>
					<button @click="preferCardView = false">
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
			<div v-else class="px-4 py-24 text-center text-gray-500 bg-white border-y sm:border sm:rounded-md sm:shadow-inner-xs">
				<svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
				<p>
					<span class="font-medium">No removed posts</span>
					<br />
					All posts are currently active.
				</p>
			</div>

			<!-- Pagination -->
			<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
				<LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { usePostsStore } from '@/stores/StorePosts';
import { useGraphQLQuery } from '~/composables/useGraphQL';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Removed Posts',
	isFooterDisabled: true,
	isScrollDisabled: true,
	'permissionRequired': "content",
    'isLeftNavbarDisabled': true
});

const preferCardView = useCookie('preferCardView', { default: () => false });

const route = useRoute();
const postsStore = usePostsStore();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 25);

// Fetch removed posts using GraphQL
const { data: postsData, pending, error, refresh } = await useGraphQLQuery(`
	query GetRemovedPosts($limit: Int!, $page: Int!) {
		posts(limit: $limit, page: $page, listingType: all, sort: new) {
			id
			title
			body
			bodyHTML
			creator {
				id
				name
				displayName
				avatar
			}
			board {
				id
				name
				icon
			}
			creationDate
			updated
			url
			isNSFW
			isLocked
			isRemoved
			isDeleted
			isFeatured
			upvotes
			downvotes
			score
			commentCount
		}
	}
`, {
	variables: {
		limit: limit.value,
		page: page.value
	}
});

// Filter only removed posts
const removedPosts = computed(() => {
	return postsData.value?.posts?.filter(post => post.isRemoved) || [];
});

const totalCount = computed(() => removedPosts.value.length);

if (error.value && error.value.response) {
	throw createError({
		statusCode: 404,
		statusMessage: 'We could not find the page you were looking for.',
		fatal: true
	});
}

postsStore.posts = removedPosts.value;
const posts = postsStore.posts;

const totalPages = computed(() => {
	return Math.ceil(totalCount.value / limit.value || 1);
});
</script>