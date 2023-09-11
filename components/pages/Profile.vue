<template>
	<main class="flex flex-col pt-12 sm:pt-14">
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
							${unbanDays} days` : "permanently banned" }}</strong>
						<br />
						<p class="text-sm text-red-800">
							This profile cannot be viewed by the community.
						</p>
					</div>
				</div>
				<!-- Profile Details -->
				<div class="col-span-full bg-gray-200/50 sm:rounded-md sm:border sm:shadow-inner-white">
					<div class="hidden sm:flex items-center space-x-4 p-2.5 sm:p-4 text-sm text-gray-500 leading-normal">
						<ul class="hidden sm:flex flex-grow items-center text-sm text-gray-400">
							<li class="flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24"
									stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
									stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z"></path>
									<path
										d="M2.996 14.803c.312 .135 .654 .204 1.004 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1.004 -.197">
									</path>
									<path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z"></path>
								</svg>
								<span>
									Member since
									<span :title="user.creation_date" class="font-medium text-gray-600">
										{{ format(parseISO(user.creation_date), 'yyyy MMM. dd') }}
									</span>
								</span>
							</li>
							<!--<li class="ml-6 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<circle cx="12" cy="12" r="9"></circle>
									<path d="M12 12h3.5"></path>
									<path d="M12 7v5"></path>
								</svg>
								<span>
									Last seen
									<span class="font-medium text-gray-600">this week</span>
								</span>
							</li>-->
						</ul>
						<ul class="ml-auto hidden lg:flex items-center text-sm text-gray-400">
							<li class="ml-6 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24"
									stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
									stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path
										d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z">
									</path>
								</svg>
								<span>
									Reputation
									<span class="font-medium text-gray-600">
										{{ counts.rep }}
									</span>
								</span>
							</li>
							<li class="ml-6 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24"
									stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
									stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
									<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
									<path d="M16 5l3 3"></path>
								</svg>
								<span>Posts
									<span class="font-medium text-gray-600">{{ counts.post_count }}</span>
								</span>
							</li>
							<li class="ml-6 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24"
									stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
									stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
								</svg>
								<span>Comments
									<span class="font-medium text-gray-600">{{ counts.comment_count }}</span>
								</span>
							</li>
						</ul>
					</div>
					<!-- Details -->
					<div id="details"
						class="z-30 relative flex flex-col sm:flex-row sm:items-center w-full p-2.5 sm:p-6 bg-cover bg-center sm:rounded-b-md"
						:style="{ backgroundImage: `url(${user.banner})` }">
						<!-- Avatar -->
						<img loading="lazy" :src="user.avatar" alt="avatar"
							class="relative flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded" />
						<!-- Info & Actions -->
						<div class="relative flex flex-col w-full sm:ml-4 mt-4 sm:mt-0">
							<!-- Name & Role -->
							<div v-if="user.display_name !== user.name || user.instance">
								<h1 class="text-gray-100 text-lg sm:text-3xl leading-5 font-bold">
									{{ user.display_name }}
								</h1>
								<div class="flex items-center text-gray-200">
									{{ user.name }}
									<span v-if="user.instance">@{{ user.instance }}</span>
									<span v-if="user.is_admin" class="ml-2 badge badge-large badge-red">
										Admin
									</span>
								</div>
							</div>
							<div v-else class="flex items-center">
								<h1 class="text-gray-100 text-lg sm:text-2xl leading-5 font-bold">
									{{ user.name }}
								</h1>
								<span v-if="user.is_admin" class="ml-2 badge badge-large badge-red">Admin</span>
							</div>
							<!-- Bio -->
							<p class="mt-2.5 lg:w-4/5 xl:w-3/5"
								:class="!user.bio ? 'text-gray-400 italic' : 'text-gray-100'">
								{{ user.bio || 'No bio...' }}
							</p>
							<!-- Stats -->
							<small class="sm:hidden mt-2 text-gray-300">
								Joined {{ format(parseISO(user.creation_date), 'MMM dd, yyyy') }}
							</small>
							<!-- Actions -->
							<ul v-if="isAuthed" class="mt-2 flex items-center space-x-2">
								<li v-if="isSelf">
									<NuxtLink to="/settings/profile" class="button button-sm white">
										Edit profile
									</NuxtLink>
								</li>
								<li v-else>
									<button class="button button-sm white" disabled>
										Message
									</button>
								</li>
								<li v-if="!isSelf">
									<LazyMenusActionsProfile :user="user" :isAdmin="isAdmin" :isSelf="isSelf" />
								</li>
							</ul>
							<!-- Mobile Stats -->
							<ul
								class="flex lg:hidden items-center text-sm text-gray-300 border-t sm:border-0 border-white/10 mt-4 pt-2.5 md:pt-0">
								<li>
									<span>
										<strong>{{ counts.rep }}</strong>
										Reputation
									</span>
								</li>
								<li class="ml-4">
									<span>
										<strong>{{ counts.posts_count }}</strong>
										{{ counts.posts_count === 1 ? 'Post' : 'Posts' }}
									</span>
								</li>
								<li class="ml-4">
									<span>
										<strong>{{ counts.comments_count }}</strong>
										{{ counts.comments_count === 1 ? 'Comment' : 'Comments' }}
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6">
				<div class="w-full">
					<!-- Sorts & View Options -->
					<div
						class="flex items-center mb-4 p-2.5 sm:p-4 bg-gray-100 border-y sm:border sm:shadow-inner-white sm:rounded-md">
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
								{{ user.username }} has made no {{ posts ? 'posts' : 'comments' }}
							</span>
							<br />
							They must not be that interesting
						</p>
					</div>
					<!-- Pagination -->
					<div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
						<NavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import { useLoggedInUser } from '@/stores/StoreAuth';
import { format, parseISO } from "date-fns";

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
const isAdmin = computed(() => {
	return !!userStore.user && userStore.user.is_admin
});

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
	{ name: 'Posts', href: `/@${route.params.username}` },
	{ name: 'Comments', href: `/@${route.params.username}/comments` }
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