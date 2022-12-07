<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation -->
		<section>
			<NavigationNavbarSub :links="links"/>
		</section>
		<!-- No User State -->
		<!-- TODO: handle this with middleware -->
		<!-- <section v-if="error" class="container mx-auto my-24 px-4 flex justify-center">
			<div class="text-center">
				<h1 class="text-5xl font-bold text-gray-900">404</h1>
				<p class="mt-1 text-xl font-bold">The user you are looking for is an unperson</p>
				<p class="mt-2 text-gray-700">You are likely seeing this because you typed the username manually and made a typo. Please do better next time.</p>
			</div>
		</section> -->
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
			<!-- Profile Details -->
			<div class="col-span-full bg-gray-200/50 sm:rounded-md sm:border sm:shadow-inner-white">
				<div class="flex items-center space-x-4 p-2.5 sm:p-4 text-sm text-gray-500 leading-normal">
					<ul class="flex flex-grow items-center text-sm text-gray-400">
						<li class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z"></path>
								<path d="M2.996 14.803c.312 .135 .654 .204 1.004 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1.004 -.197"></path>
								<path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z"></path>
							</svg>
							<span>
								Member since
								<span class="font-medium text-gray-600">
									{{ format(parseISO(user.created_at), 'MMM dd, yyyy') }}
								</span>
							</span>
						</li>
						<li class="ml-6 flex items-center">
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
						</li>
					</ul>
					<ul class="ml-auto hidden lg:flex items-center text-sm text-gray-400">
						<li class="ml-6 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
							</svg>
							<span>
								Reputation
								<span class="font-medium text-gray-600">
									{{ reputation }}
								</span>
							</span>
						</li>
						<li class="ml-6 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
								<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
								<path d="M16 5l3 3"></path>
							</svg>
							<span>Posts
								<span class="font-medium text-gray-600">{{ user.posts_count }}</span>
							</span>
						</li>
						<li class="ml-6 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
							</svg>
							<span>Comments
								<span class="font-medium text-gray-600">{{ user.comments_count }}</span>
							</span>
						</li>
					</ul>
				</div>
				<!-- Details -->
				<div id="details" class="relative flex flex-col sm:flex-row sm:items-center w-full p-2.5 sm:p-6 bg-cover bg-center sm:rounded-b-md" :style="{ backgroundImage: `url(https://i.imgur.com/HRYqKAf.jpg)` }">
					<!-- Avatar -->
					<img
					loading="lazy"
					:src="user.avatar_url"
					alt="avatar"
					class="flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded-none p-0.5 border bg-white"
					/>
					<!-- Info -->
					<div class="flex flex-col sm:ml-4 mt-4 sm:mt-0">
						<div class="flex items-center">
							<!-- Display Name -->
							<h1 class="text-gray-100 text-lg sm:text-2xl leading-5 font-bold">
								{{ user.username }}
							</h1>
							<!-- Role -->
							<span v-if="user.is_admin" class="ml-2 badge badge-large badge-blue">Admin</span>
						</div>
						<p class="mt-2.5 lg:w-4/5 xl:w-3/5" :class="!user.bio ? 'text-gray-400 italic' : 'text-gray-100'">
							{{ user.bio || 'No bio...' }}
						</p>
						<!-- Mobile Stats -->
						<ul class="flex lg:hidden items-center text-sm text-gray-300 border-t sm:border-0 border-white/10 mt-2.5 pt-2.5 md:pt-0">
							<li>
								<span>
									Reputation
									<strong>{{ reputation }}</strong>
								</span>
							</li>
							<li class="ml-4">
								<span>
									Posts
									<strong>{{ user.posts_count }}</strong>
								</span>
							</li>
							<li class="ml-4">
								<span>
									Comments
									<strong>{{ user.comments_count }}</strong>
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
		<!-- User Content -->
		<section v-if="!user.is_deleted && !user.is_banned" class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6">
				<div class="w-full">
					<!-- Posts -->
					<TablesPosts v-if="type !== 'comment' && posts.length" :posts="posts" :title="sort" :isLoading="pending"/>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
	import { format, parseISO } from "date-fns";

	const props = defineProps({
		user: {
			type: Object,
			required: true
		},
		posts: {
			type: Array,
			required: true
		}
	});

	const route = useRoute();

	const reputation = computed(() => {
		const u = props.user;
		const score = u.posts_score + u.comments_score;
		const count = u.posts_count + u.comments_count;
		const num = score / count * 100
		if (!isFinite(num)) return 0;
		return num.toFixed(0);
	});

	// Sub navbar links
	const links = [
		{ name: 'Overview', href: `/user/${route.params.username}`},
		{ name: 'Posts', href: `/user/${route.params.username}/posts` },
		{ name: 'Comments', href: `/user/${route.params.username}/comments` }
	]
</script>

<style scoped>
	#details > * {
		z-index: 10;
	}
	#details::before {
		content: '';
		background: rgba(0,0,0,0.9);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0,0,0,0.9) 60%);
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