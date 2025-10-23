<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Removed Comments</h3>
				<p class="mt-1 text-sm text-gray-600">
					Comments that have been removed by administrators or moderators.
					<NuxtLink to="/admin/removed/posts" class="text-primary hover:text-primary/80">View removed posts</NuxtLink>.
				</p>
			</div>

			<!-- Loading state -->
			<div v-if="pending" class="flex justify-center items-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
				<p class="text-red-800">Failed to load removed comments: {{ error.message }}</p>
			</div>

			<!-- Comments List -->
			<div v-else class="bg-white shadow-inner-xs sm:border sm:rounded-md">
				<!-- Empty State -->
				<div v-if="!removedComments || removedComments.length === 0" class="text-center py-12">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No removed comments</h3>
					<p class="mt-1 text-sm text-gray-500">
						All comments are currently active.
					</p>
				</div>

				<!-- Comments Table -->
				<div v-else class="overflow-hidden">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Comment
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Author
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Post
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Removed Date
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="comment in removedComments" :key="comment.id">
								<td class="px-6 py-4">
									<div class="text-sm">
										<div class="text-gray-900 max-w-xs truncate">
											{{ comment.body || 'Comment content' }}
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm">
									<div class="flex items-center">
										<img v-if="comment.creator?.avatar" :src="comment.creator.avatar" class="h-6 w-6 rounded-full mr-2" />
										<div class="text-gray-900">
											{{ comment.creator?.name || 'Unknown' }}
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm">
									<NuxtLink v-if="comment.post" :to="comment.post.urlPath || `/b/${comment.post.board?.name || 'unknown'}/p/${comment.post.id}/${comment.post.slug || comment.post.titleChunk || 'post'}`" class="text-primary hover:text-primary/80">
										{{ comment.post.title || 'Unknown Post' }}
									</NuxtLink>
									<span v-else class="text-gray-500">Deleted Post</span>
								</td>
								<td class="px-6 py-4 text-sm text-gray-500">
									{{ formatDate(comment.updated || comment.creationDate) }}
								</td>
								<td class="px-6 py-4 text-sm">
									<button
										@click="restoreComment(comment.id)"
										class="text-green-600 hover:text-green-900 font-medium"
									>
										Restore
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Pagination -->
			<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
				<LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Removed Comments',
	isFooterDisabled: true,
	isScrollDisabled: true,
	'permissionRequired': "content",
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();
const route = useRoute();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 25);

// Fetch removed comments using GraphQL
const { data: commentsData, pending, error, refresh } = await useGraphQLQuery(`
	query GetRemovedComments($limit: Int!, $page: Int!, $removedOnly: Boolean!) {
		comments(limit: $limit, page: $page, removedOnly: $removedOnly) {
			id
			body
			bodyHTML
			creator {
				id
				name
				displayName
				avatar
			}
			post {
				id
				title
				titleChunk
				slug
				urlPath
				board {
					name
				}
			}
			creationDate
			updated
			isRemoved
			isDeleted
			upvotes
			downvotes
			score
			myVote
			creatorVote
		}
	}
`, {
	variables: {
		limit: limit.value,
		page: page.value,
		removedOnly: true
	},
	ssr: false  // Force client-side execution for authentication
});

// Backend already filters for removed comments
const removedComments = computed(() => {
	return commentsData.value?.comments || [];
});

const totalCount = computed(() => removedComments.value.length);
const totalPages = computed(() => Math.ceil(totalCount.value / limit.value || 1));

// Format date helper
const formatDate = (dateString) => {
	if (!dateString) return 'Unknown';
	try {
		return format(parseISO(dateString), 'MMM dd, yyyy');
	} catch {
		return 'Invalid date';
	}
};

// Restore comment function
const restoreComment = async (commentId) => {
	try {
		const { data: result } = await useGraphQLMutation(`
			mutation RestoreComment($commentId: Int!) {
				approveComment(commentId: $commentId) {
					success
				}
			}
		`, {
			variables: { commentId }
		});

		if (result.value?.approveComment?.success) {
			toast.addNotification({
				header: 'Comment restored',
				message: 'Comment has been restored successfully.',
				type: 'success'
			});
			await refresh();
		}
	} catch (error) {
		toast.addNotification({
			header: 'Restore failed',
			message: error.message || 'Failed to restore comment.',
			type: 'error'
		});
		console.error('Error restoring comment:', error);
	}
};
</script>