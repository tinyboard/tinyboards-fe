<template>
	<NuxtLayout name="admin">
		<!-- Page Heading & Description -->
		<div class="p-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Reported Comments</h3>
			<p class="mt-1 text-sm text-gray-600">Here are the comments that were reported to you by your users. Reported posts can be found <NuxtLink to="/admin/reports/posts">here</NuxtLink>.</p>
		</div>
		<!-- Comments -->
		<div class="border border-gray-200 rounded bg-white p-4">
			<LazyListsComments v-if="comments?.length" :comments="comments" :hasError="error"/>
			<!-- Empty State -->
			<div v-else class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
			      <p>
			            <span class="font-medium">
			                  This place is empty
			            </span>
			            <br/>
			            Looks like there is nothing to moderate. Enjoy your day off...
			      </p>
			</div>
		</div>
		<!-- Pagination -->
		<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
		      <LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page"/>
		</div>
	</NuxtLayout>
</template>

<script setup>
	// import { useCommentsStore } from '@/stores/StoreComments';
    import { getModQueue } from '@/composables/posts';

    definePageMeta({
    	'hasAuthRequired': true,
    	'title': 'Queue',
    	isFooterDisabled: true,
    	isScrollDisabled: true
    });

	const preferCardView = useCookie('preferCardView') ?? false;

	const route = useRoute();
	// const commentsStore = useCommentsStore();

	// Pagination
	const page = computed(() => Number.parseInt(route.query.page) || 1);
	const limit = computed(() => Number.parseInt(route.query.limit) || 25);

	const { items, totalCount, paginate, pending, error, refresh } = await getModQueue({
	      limit: limit.value,
	      page: page.value
	}, 'comments');

	//console.log(`comments are ${JSON.stringify(items.value, null, 4)}`);

	if (error.value && error.value.response) {
	      throw createError({
	            statusCode: 404,
	            statusMessage: 'We could not find the page you were looking for. Try better next time.',
	            fatal: true
	      })
	};

	// commentsStore.comments = items;
	const comments = items;

	const totalPages = computed(() => {
	      return Math.ceil(totalCount.value / limit.value || 1);
	});
</script>
