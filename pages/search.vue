<template>
	<main id="page-search" class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<CardsBanner
				title="Search"
				:sub-title="`Showing 25 of 500 results`"
				image-url="https://i.imgur.com/kGhynxn.png"
				class="col-span-full"/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6">
				<div class="w-full">
					<!-- Filters -->
					<div class="flex flex-col md:grid grid-cols-4 gap-3 justify-between mb-4 p-4 border-b sm:border sm:rounded-md bg-white sm:shadow-inner-xs">
						<!-- Search Input -->
						<div class="md:col-span-full">
							<form class="group relative w-full" @submit.prevent="onSubmit" @submit="submitSearch(text)">
								<div class="absolute left-2.5 sm:left-3 top-[9px] sm:top-2.5">
									<button class="text-gray-300 hover:text-gray-400" type="submit">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 sm:w-5 sm:h-5">
											<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
										</svg>
									</button>
								</div>
								<input required type="text" class="pl-8 sm:pl-10 form-input gray" v-model="text" placeholder="Search and hit enter"/>
							</form>
						</div>
						<!-- NSFW Checkbox -->
						<div class="md:col-span-4 flex">
							<div class="flex h-5 items-center">
								<input id="is_nsfw" name="is_nsfw" type="checkbox" v-model="hasNsfw" class="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary">
							</div>
							<div class="ml-3 text-sm">
								<label for="is_nsfw" class="font-bold text-gray-700 select-none">Include NSFW results</label>
								<p class="text-gray-500">Show results marked "not safe for work"</p>
							</div>
						</div>
					</div>
					<!-- Sorts -->
					<div class="flex items-center mb-4 p-2.5 sm:p-4 bg-gray-100 border-y sm:border shadow-inner-white sm:rounded-md">
						<MenusSort :sorts="type === 'post' ? postSorts : commentSorts"/>
						<div v-if="type !== 'comment'" class="ml-auto flex space-x-2">
                        <button class="ml-auto" @click="preferCardView = true">
                              <!-- Rows Icon -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-red-500' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                 <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                                 <rect x="4" y="14" width="16" height="6" rx="2"></rect>
                              </svg>
                        </button>
                        <button class="ml-auto" @click="preferCardView = false">
                              <!-- Cards Icon -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-gray-500' : 'text-red-500'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                 <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                                 <line x1="4" y1="12" x2="20" y2="12"></line>
                              </svg>
                        </button>
                  </div>
					</div>
					<!-- Posts -->
               <LazyListsPosts v-if="type !== 'comment' && posts?.length" :posts="posts" :isCompact="!preferCardView" :isLoading="pending" :hasError="error"/>
					<!-- Comments -->
					<LazyListsComments v-else-if="results.comments?.length" :comments="results.comments" class="p-4 bg-white md:border md:rounded-md md:shadow-inner-white"/>
					<!-- Empty State -->
					<div v-else-if="!error" class="px-4 py-24 text-center text-gray-500 bg-white border-y sm:border sm:rounded-md sm:shadow-inner-xs">
						<p>
							<span class="font-medium">
								We could not find any {{ `${type}s` }} matching "{{ route.query.query }}"
							</span>
							<br/>
							Try searching something else
						</p>
					</div>
					<!-- Error State -->
					<div v-else class="px-4 py-24 text-center text-gray-500 bg-white border-y sm:border sm:rounded-md sm:shadow-inner-xs">
						<p>
							<span class="font-medium">
								There was an error fetching results for "{{ route.query.query }}".
							</span>
							<br/>
							Please try again
						</p>
					</div>
					<!-- Pagination -->
					<!-- <div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
						<NavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page"/>
            			</div> -->
				</div>
				<!-- Sidebar -->
				<ContainersSidebar />
			</div>
		</section>
	</main>
</template>

<script setup>
	// import { baseURL } from '@/server/constants';
	import { useAPI } from "@/composables/api";
	import { usePostsStore } from '@/stores/StorePosts';
	import { useCommentsStore } from '@/stores/StoreComments';
	import { useSiteStore } from '@/stores/StoreSite';

	// Define route & router.
	const route = useRoute();
	const router = useRouter();

	const site = useSiteStore();

	definePageMeta({
		key: (route) => route.fullPath,
		'hasRepliesDisabled': true
	});

	// useHead({
	// 	title: `${site.name} | ${route.query.query}`,
	// 	meta: [
	// 	{
	// 		property: 'og:title',
	// 		content: `${site.name} | search`
	// 	}
	// 	]
	// });

	const preferCardView = useCookie('preferCardView') ?? false;

	// Pagination
	const page = computed(() => route.query.page || 1);

	const onPageChange = (page) => {
		router.push(`${route.path}?page=${page}`)
	};

	// Search params.
	const type = computed(() => route.query.type || 'post');
	const text = ref(route.query.query);
	const sort = ref(route.query.sort) || 'new';
	const hasNsfw = ref(false);
	const limit = computed(() => route.query.limit || 5);

	// Posts & comments store.
	const postStore = usePostsStore();

	// Fetch search results.
	const { data: results, pending, error, refresh } = await useAPI("/search", {
		query: {
			type: type.value,
			query: route.query.query,
			sort: route.query.sort,
			is_nsfw: false,
			limit: limit.value
		}
	});

	postStore.posts = results.value.posts;
	const posts = postStore.posts;

	const totalPages = computed(() => {
		if (type.value === 'post') {
			return Math.ceil(posts.length / results.value.total_count) || 1;
		} else {
			return Math.ceil(results.value.comments.length / results.value.total_count) || 1;
		}
	});

	// Handle search input.
	const submitSearch = (text) => router.push({ 
		path: '/search',
		query: {
			type: type.value ?? 'post',
			query: text,
			sort: sort.value
		}
	});

	// Links for sub navbar.
	const links = [
		{ name: 'Posts', href: { query: { query: text.value, type: 'post' } } },
		{ name: 'Comments', href: { query: { query: text.value, type: 'comment' } } },
		];

	// Post sort options.
	const postSorts = [
	{
		name: 'Hot',
		key: 'hot',
		href: { query: { ...route.query, sort: 'hot' } }
	},
	{
		name: 'Latest',
		key: 'new',
		href: { query: { ...route.query, sort: 'new' } }
	},
	{
		name: 'Top All',
		key: 'topall',
		href: { query: { ...route.query, sort: 'topall' } }
	},
	{
		name: 'Top Month',
		key: 'topmonth',
		href: { query: { ...route.query, sort: 'topmonth' } }
	},
	{
		name: 'Top Week',
		key: 'topweek',
		href: { query: { ...route.query, sort: 'topweek' } }
	},
	{
		name: 'Most Comments',
		key: 'mostcomments',
		href: { query: { ...route.query, sort: 'mostcomments' } }
	},
	{
		name: 'Latest Comments',
		key: 'newcomments',
		href: { query: { ...route.query, sort: 'newcomments' } }
	}
	]

	// Comment sort options.
	const commentSorts = [
	{
		name: 'Hot',
		key: 'hot',
		href: { query: { ...route.query, sort: 'hot' } }
	},
	{
		name: 'Latest',
		key: 'new',
		href: { query: { ...route.query, sort: 'new' } }
	},
	{
		name: 'Oldest',
		key: 'old',
		href: { query: { ...route.query, sort: 'old' } }
	},
	{
		name: 'Top All',
		key: 'top',
		href: { query: { ...route.query, sort: 'top' } }
	}
	]
</script>