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
					<div v-if="type === 'posts' || type === 'comments'" class="flex items-center mb-4 p-2.5 sm:p-4 bg-gray-100 border-y sm:border shadow-inner-white sm:rounded-md">
						<MenusSort :sorts="type === 'posts' ? postSorts : commentSorts"/>
						<div v-if="type === 'posts'" class="ml-auto flex space-x-2">
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
               <LazyListsPosts v-if="type === 'posts' && posts?.length" :posts="posts" :isCompact="!preferCardView" :isLoading="pending" :hasError="error"/>
					<!-- Comments -->
					<LazyListsComments v-else-if="type === 'comments' && comments?.length" :comments="comments" class="p-4 bg-white dark:bg-gray-950 md:border dark:border-gray-800 md:rounded-md md:shadow-inner-white"/>
					<!-- Users -->
					<div v-else-if="type === 'users' && users?.length" class="flex flex-col space-y-2 bg-white dark:bg-gray-950 border-y sm:border dark:border-gray-800 sm:rounded-md sm:shadow-inner-xs p-4">
						<NuxtLink v-for="user in users" :key="user.id" :to="`/@${user.name}`" class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">
							<img :src="user.avatar || 'https://placekitten.com/48/48'" class="w-12 h-12 rounded-full object-cover" />
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<strong class="text-gray-900 dark:text-gray-100">{{ user.displayName || user.name }}</strong>
									<span v-if="user.isAdmin" class="badge badge-red">Admin</span>
								</div>
								<p class="text-sm text-gray-500 dark:text-gray-400">@{{ user.name }}</p>
								<p v-if="user.bio" class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{{ user.bio }}</p>
								<div class="flex gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
									<span>{{ user.postCount }} posts</span>
									<span>{{ user.commentCount }} comments</span>
									<span>{{ user.rep }} rep</span>
								</div>
							</div>
						</NuxtLink>
					</div>
					<!-- Boards -->
					<div v-else-if="type === 'boards' && boards?.length" class="flex flex-col space-y-2 bg-white dark:bg-gray-950 border-y sm:border dark:border-gray-800 sm:rounded-md sm:shadow-inner-xs p-4">
						<NuxtLink v-for="board in boards" :key="board.id" :to="`/+${board.name}`" class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">
							<img v-if="board.icon" :src="board.icon" class="w-12 h-12 rounded-md object-cover" />
							<div v-else class="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
								<span class="text-xl font-bold text-gray-500 dark:text-gray-400">{{ board.name[0].toUpperCase() }}</span>
							</div>
							<div class="flex-1">
								<strong class="text-gray-900 dark:text-gray-100">+{{ board.name }}</strong>
								<p class="text-sm text-gray-600 dark:text-gray-400">{{ board.title }}</p>
								<p v-if="board.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ board.description }}</p>
								<div class="flex gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
									<span>{{ board.subscriberCount }} subscribers</span>
									<span>{{ board.postCount }} posts</span>
								</div>
							</div>
						</NuxtLink>
					</div>
					<!-- Empty State -->
					<div v-else-if="!error && !pending" class="px-4 py-24 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 border-y sm:border dark:border-gray-800 sm:rounded-md sm:shadow-inner-xs">
						<p>
							<span class="font-medium">
								We could not find any {{ type }} matching "{{ route.query?.query }}"
							</span>
							<br/>
							Try searching something else
						</p>
					</div>
					<!-- Error State -->
					<div v-else-if="error" class="px-4 py-24 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 border-y sm:border dark:border-gray-800 sm:rounded-md sm:shadow-inner-xs">
						<p>
							<span class="font-medium">
								There was an error fetching results for "{{ route.query?.query }}".
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
	import { usePostsStore } from '@/stores/StorePosts';
	import { useCommentsStore } from '@/stores/StoreComments';
	import { useSiteStore } from '@/stores/StoreSite';
	import { useGraphQLQuery } from '@/composables/useGraphQL';

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
	const page = computed(() => route.query?.page || 1);

	const onPageChange = (page) => {
		router.push(`${route.path}?page=${page}`)
	};

	// Search params.
	const type = computed(() => route.query?.type || 'posts');
	const text = ref(route.query?.query);
	const sort = ref(route.query?.sort) || 'new';
	const hasNsfw = ref(false);
	const limit = computed(() => route.query?.limit || 20);

	// Posts & comments store.
	const postStore = usePostsStore();

	// Fetch search results.
	const { data: results, pending, error, refresh } = await useGraphQLQuery(`
		query searchContent($q: String!, $searchType: SearchType, $page: Int, $limit: Int) {
			searchContent(q: $q, searchType: $searchType, page: $page, limit: $limit) {
				posts {
					id
					title
					titleChunk
					body
					bodyHTML
					url
					score
					upvotes
					downvotes
					creatorVote
					isNSFW
					isRemoved
					isDeleted
					isLocked
					creationDate
					updated
					isSaved
					myVote
					featuredLocal
					featuredBoard
					commentCount
					altText
					embedTitle
					embedDescription
					embedVideoUrl
					sourceUrl
					lastCrawlDate
					creator {
						id
						name
						displayName
						avatar
						isAdmin
						instance
						creationDate
						rep
						postCount
						commentCount
					}
					board {
						id
						name
						icon
					}
				}
				comments {
					id
					body
					bodyHTML
					score
					upvotes
					downvotes
					creatorVote
					creationDate
					updated
					isSaved
					myVote
					isRemoved
					isDeleted
					creator {
						id
						name
						displayName
						avatar
						isAdmin
						instance
						creationDate
						rep
						postCount
						commentCount
					}
					post {
						id
						title
						titleChunk
					}
				}
				users {
					id
					name
					displayName
					avatar
					bio
					isAdmin
					creationDate
					rep
					postCount
					commentCount
				}
				boards {
					id
					name
					title
					description
					icon
					banner
					subscriberCount
					postCount
					commentCount
					creationDate
				}
			}
		}
	`, {
		variables: {
			q: route.query?.query || '',
			searchType: type.value,
			page: page.value,
			limit: limit.value
		}
	});

	const posts = computed(() => results.value?.searchContent?.posts || []);
	const comments = computed(() => results.value?.searchContent?.comments || []);
	const users = computed(() => results.value?.searchContent?.users || []);
	const boards = computed(() => results.value?.searchContent?.boards || []);

	postStore.posts = posts.value;

	// Handle search input.
	const submitSearch = (text) => router.push({
		path: '/search',
		query: {
			type: type.value ?? 'posts',
			query: text,
			sort: sort.value
		}
	});

	// Links for sub navbar.
	const links = [
		{ name: 'Posts', href: { query: { query: text.value || '', type: 'posts' } } },
		{ name: 'Comments', href: { query: { query: text.value || '', type: 'comments' } } },
		{ name: 'Users', href: { query: { query: text.value || '', type: 'users' } } },
		{ name: 'Boards', href: { query: { query: text.value || '', type: 'boards' } } },
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