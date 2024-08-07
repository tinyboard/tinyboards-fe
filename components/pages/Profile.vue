<template>
	<main class="flex flex-col pt-12 sm:pt-14"
		:style="{
			backgroundImage: `url(${imageStore.background || user.profile_background})`,
		}">
		<!-- Sub Navigation & Profile Details -->
		<section class="flex flex-col mb-4 sm:mb-0">
			<NavigationNavbarSub :links="links" class="sm:order-first" />
			<div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<div v-if="user.is_banned"
					class="col-span-full mb-4 order-2 sm:order-first flex items-center justify-center sm:justify-start p-2.5 text-center sm:text-left text-red-900 bg-red-200 border-y sm:border-x border-red-300 sm:rounded-md sm:shadow-inner-white">
					<svg xmlns="http://www.w3.org/2000/svg" class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4"
						viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
						stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385">
						</path>
						<path d="M6 9l4 4"></path>
						<path d="M13 10l-4 -4"></path>
						<path d="M3 21h7"></path>
						<path
							d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z">
						</path>
					</svg>
					<div>
						<strong>{{ isSelf ? "Your account" : "This account" }} has been {{ user.unban_date ? `suspended for
							${unbanDays} day(s)` : "terminated" }}</strong>
						<br />
						<p class="text-sm text-red-800">
							This profile cannot be viewed by the community.
						</p>
					</div>
				</div>
				<!-- Profile Details -->
				<CardsProfileBannerV2 :user="user" :counts="counts" />
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6">
				<div class="w-full">
					<!-- Content slot -->
					<slot name="content">
						<!-- Sorts & View Options -->
						<div
							class="flex items-center mb-4 p-2.5 sm:p-4 bg-white border-y sm:border sm:shadow-inner-white sm:rounded-md">
							<MenusSort :sorts="type === 'post' ? postSorts : commentSorts" />
							<div v-if="type === 'post'" class="ml-auto flex space-x-2">
								<button class="ml-auto" @click="preferCardView = true">
									<!-- Rows Icon -->
									<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
										:class="preferCardView ? 'text-red-500' : 'text-gray-500'" viewBox="0 0 24 24"
										stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
										stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<rect x="4" y="4" width="16" height="6" rx="2"></rect>
										<rect x="4" y="14" width="16" height="6" rx="2"></rect>
									</svg>
								</button>
								<button class="ml-auto" @click="preferCardView = false">
									<!-- Cards Icon -->
									<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
										:class="preferCardView ? 'text-gray-500' : 'text-red-500'" viewBox="0 0 24 24"
										stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
										stroke-linejoin="round">
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
						<!-- Comments -->
						<LazyListsComments v-else-if="comments?.length" :comments="comments"
							class="p-4 bg-white border-y sm:border md:rounded-md md:shadow-inner-white" />
						<div v-else
							class="px-4 py-24 text-center text-gray-500 bg-white border-y sm:border sm:rounded-md sm:shadow-inner-xs">
							<p>
								<span class="font-medium">
									{{ user.name }} has made no {{ posts ? 'posts' : 'comments' }}
								</span>
								<br />
								They must not be that interesting
							</p>
						</div>
						<!-- Pagination -->
						<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
							<NavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
						</div>
					</slot>
				</div>
				<LazyContainersSidebarProfile :u="user" :moderates="moderates" />
			</div>
		</section>
	</main>
</template>

<script setup>
import { useLoggedInUser } from '@/stores/StoreAuth';
//import { format, parseISO } from "date-fns";
import { requirePermission } from '@/composables/admin';
import { useImageStore } from '@/stores/StoreImages';

const imageStore = useImageStore();

const props = defineProps({
	personView: {
		type: Object,
		required: true
	},
	posts: {
		type: Array,
	},
	comments: {
		type: Array,
	},
	moderates: {
		type: Array,
		default: [],
	},
	type: {
		type: String,
		default: 'post'
	},
	totalPages: {
		type: Number,
		default: 1
	},
	page: {
		type: Number,
		default: 1
	}
});

const route = useRoute();
const userStore = useLoggedInUser();

const user = props.personView.person;
const counts = props.personView.counts;

// Is Authed
const isAuthed = userStore.isAuthed;

// Is Self
const isSelf = computed(() => {
	return !!userStore.user && userStore.user.name === user.name
});

// Admin
/*const isAdmin = computed(() => {
	return !!userStore.user && userStore.user.is_admin
});*/
const isAdmin = requirePermission("users");

// Number of days until unban
const unbanDays = computed(() => {
	if (user.unban_date) {
		const date = new Date(user.unban_date);

		return Math.ceil((Math.floor(date.getTime() / 1000) - Math.floor(Date.now() / 1000)) / (60 * 60 * 24));
	} else {
		return null;
	}
});

// Display preferences
const preferCardView = useCookie('preferCardView');
// true by default
preferCardView.value = preferCardView.value === undefined ? true : preferCardView.value;

// Post sorts options
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

// Sub navbar links
const links = [
	{ name: 'Overview', href: `/@${route.params.username}` },
	{ name: `Posts (${counts.post_count})`, href: `/@${route.params.username}/posts` },
	{ name: `Comments (${counts.comment_count})`, href: `/@${route.params.username}/comments` }
]
</script>

<style scoped>
#details::before {
	content: '';
	background: rgba(0, 0, 0, 0.9);
	background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.8) 70%);
	position: absolute;
	height: 100%;
	width: 100%;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 0;
	@apply sm:rounded-b-lg;
}
</style>