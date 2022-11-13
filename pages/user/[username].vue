<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation -->
		<section v-if="!error">
			<NavigationNavbarSub :links="links"/>
		</section>
		<!-- Main Content -->
		<!-- No User State -->
		<section v-if="error" class="container mx-auto my-24 px-4 flex justify-center">
			<div class="text-center">
				<h1 class="text-5xl font-bold text-gray-900">404</h1>
				<p class="mt-1 text-xl font-bold">The user you are looking for is an unperson</p>
				<p class="mt-2 text-gray-700">You are likely seeing this because you typed the username manually and made a typo. Please do better next time.</p>
			</div>
		</section>
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
			<!-- Stats -->
			<div class="col-span-full bg-gray-200/50 sm:rounded-md sm:border sm:shadow-inner-white">
				<div class="flex items-center space-x-4 px-4 sm:px-6 py-4 text-sm text-gray-500 leading-normal">
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
								<strong class="text-gray-600">Nov 5, 2022</strong>
							</span>
						</li>
						<li class="ml-4 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<circle cx="12" cy="12" r="9"></circle>
								<path d="M12 12h3.5"></path>
								<path d="M12 7v5"></path>
							</svg>
							<span>
								Last seen
								<strong class="text-gray-600">this week</strong>
							</span>
						</li>
					</ul>
					<ul class="ml-auto hidden lg:flex items-center text-sm text-gray-400">
						<li class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
								<path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
							</svg>
							<span>Followers
								<strong class="text-gray-600">91</strong>
							</span>
						</li>
						<li class="ml-4 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
							</svg>
							<span>
								Reputation <strong class="text-gray-600">400</strong>
							</span>
						</li>
						<li class="ml-4 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
								<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
								<path d="M16 5l3 3"></path>
							</svg>
							<span>Total posts
								<strong class="text-gray-600">240</strong>
							</span>
						</li>
					</ul>
				</div>
				<!-- Details -->
				<div id="details" class="relative flex flex-wrap md:flex-nowrap items-center w-full p-4 sm:p-6 bg-cover bg-center sm:rounded-b-md" :style="{ backgroundImage: `url(https://i.imgur.com/HRYqKAf.jpg)` }">
					<!-- Avatar -->
					<img
					loading="lazy"
					:src="user.avatar_url"
					alt="avatar"
					class="flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded-none p-1 border bg-white"
					/>
					<!-- Info -->
					<div class="flex flex-col md:ml-4 mt-4 md:mt-0">
						<div class="flex items-center space-x-2">
							<!-- Display Name -->
							<h1 class="text-gray-100 text-2xl leading-5 font-bold">
								{{ user.username }}
							</h1>
							<!-- Title -->
							<span class="ml-2 px-2 inline-flex text-sm leading-5 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
								developer
							</span>
						</div>
						<p class="mt-2 text-gray-100 lg:w-4/5 xl:w-3/5">
							True story I saw Andrew Tate at a McDonalds and he no kidding was dressed aa a Femboy cat girl. He recognised that I recognised him, then hurried away so I followed him. I saw him get into a pink bugatti and start crying so I went over but when he saw me he just smiled and meowed.
						</p>
						<!-- Badges -->
						<ul class="mt-3 flex items-center space-x-4 text-sm text-gray-400">
							<li>

							</li>
						</ul>
						<!-- Mobile Stats -->
						<ul class="flex lg:hidden items-center text-sm text-gray-300 border-t sm:border-0 border-white/10 pt-4 md:pt-0">
							<li class="flex items-center">
								<span>
									Followers
									<strong>91</strong>
								</span>
							</li>
							<li class="ml-4 flex items-center">
								<span>
									Reputation
									<strong>400</strong>
								</span>
							</li>
							<li class="ml-4 flex items-center">
								<span>
									Total posts
									<strong>240</strong>
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
		<!-- User State -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex flex-col gap-6">
				<!-- User Content -->
				<div class="relative w-full sm:rounded-md sm:border overflow-x-auto">
					<table class="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead class="text-base text-gray-700 leading-5 w-full px-4 py-3 lg:p-6 bg-gray-200/50 border-b shadow-inner-white">
							<tr>
								<th scope="col" class="w-4/6 px-4 py-3 font-bold">
									{{ title ?? 'Recent posts' }}
								</th>
								<th scope="col" class="hidden lg:table-cell px-4 py-3 font-normal">
									Points
								</th>
								<th scope="col" class="hidden lg:table-cell px-4 py-3 font-normal">
									Replies
								</th>
								<th scope="col" class="hidden xl:table-cell px-4 py-3 font-normal">
									Activity
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in items" :key="item.id" class="bg-white odd:bg-gray-50 border-b last:border-0 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
								<th scope="row" class="flex items-center px-4 py-3 text-gray-900 dark:text-white">
									<!-- Avatar - Desktop Only -->
									<img
									loading="lazy"
									:src="item.author.avatarUrl"
									alt="avatar"
									class="hidden sm:inline flex-shrink-0 w-12 h-12 object-cover rounded-sm rounded-none p-1 border bg-white"
									/>
									<!-- Post Details -->
									<div class="flex flex-col sm:pl-3 sm:truncate">
										<!-- Title -->
										<NuxtLink class="text-base font-bold text-gray-900 visited:text-gray-400 hover:text-primary sm:overflow-hidden sm:text-ellipsis" :to="`/post/${item.id}`">
											{{ item.title }}
										</NuxtLink>
										<!-- Author -->
										<p class="mt-2 sm:mt-1 flex items-center font-normal text-sm text-gray-400">
											<!-- Avatar - Mobile Only -->
											<img
											loading="lazy"
											:src="item.author.avatarUrl"
											alt="avatar"
											class="sm:hidden flex-shrink-0 w-6 h-6 object-cover rounded-sm"
											/>
											<!-- Display Name -->
											<NuxtLink to="/Bret" class="ml-2 sm:ml-0">
												<strong>{{ item.author.username }}</strong>
											</NuxtLink>
											<!-- Title -->
											<span class="ml-2 px-1 inline-flex leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
												developer
											</span>
											<!-- Timestamps -->
											<span class="ml-2">
												<span class="font-black text-gray-400 dark:text-gray-500">·</span>
												<span class="pl-1">12d ago</span>
											</span>
											<span class="ml-2">
												<span class="font-black text-gray-400 dark:text-gray-500">·</span>
												<span class="italic pl-1"> Edited 7d ago</span>
											</span>
										</p>
									</div>
								</th>
								<td class="hidden lg:table-cell py-4 px-4">
									<div class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 w-4 h-4">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
										</svg>
										<span class="pl-1">
											{{ item.points }}
										</span>
									</div>
								</td>
								<td class="hidden lg:table-cell py-4 px-4">
									<div class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 w-4 h-4">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
										</svg>
										<span class="pl-1">
											{{ item.replies }}
										</span>
									</div>
								</td>
								<td class="hidden xl:table-cell py-4 px-4">
									<div class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 w-4 h-4">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<circle cx="12" cy="12" r="9"></circle>
											<path d="M12 12h3.5"></path>
											<path d="M12 7v5"></path>
										</svg>
										<span class="pl-1">
											{{ item.last_active }}
										</span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
	import { computed } from 'vue'
	import { useFetchUser } from '@/composables/user'

	const route = useRoute()
	const username = computed(() => route.params.username)

	const { data: user, error, pending, refresh } = await useFetchUser(username.value);

	// Sub-navigation bar links
	const links = [
	{ name: 'Overview', href: '/user' },
	{ name: 'Posts', href: '/user/:id/posts' },
	{ name: 'Comments', href: '/user/:username/comments' }
	];

	// local state
	const items = [
	{
		id: 1,
		author: {
			username: 'bret',
			avatarUrl: 'https://i.imgur.com/nzY5zAg.jpg'
		},
		type: 'link',
		url: '',
		permalink: '1',
		domain: 'reddit.com',
		title: "iOS 16 lets you customize your Lock Screen in fun new ways. Layer a photo to make it pop. Track your Activity rings. And see live updates from your favorite apps.",
		thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg',
		points: 87,
		replies: 24,
		views: 140,
		last_active: '7 hours ago'
	},
	{
		id: 2,
		author: {
			username: 'bret',
			avatarUrl: 'https://i.imgur.com/401QojU.gif?noredirect'
		},
		type: 'link',
		url: '',
		permalink: '2',
		domain: 'reddit.com',
		title: "To be blunt, people would vote for me. They just would. Why? Maybe because I'm so good looking.",
		thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg',
		points: 4,
		replies: 2,
		views: 30,
		last_active: '3 days ago'
	},
	{
		id: 3,
		author: {
			username: 'bret',
			avatarUrl: 'https://i.imgur.com/svGJfRg.jpg'
		},
		type: 'link',
		url: '',
		permalink: '3',
		domain: 'reddit.com',
		title: 'Buying Twitter is an accelerant to creating X, the everything app',
		thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg',
		points: 34,
		replies: 45,
		views: 205,
		last_active: '2 hours ago'
	},
	{
		id: 4,
		author: {
			username: 'bret',
			avatarUrl: 'https://media.tenor.com/bfeoTmST6nMAAAAC/pumpkin-head-cemetery.gif'
		},
		type: 'link',
		url: '',
		permalink: '4',
		domain: 'reddit.com',
		title: 'GTA Online Halloween Jack o\' Lantern Locations: How to get the Horror Pumpkin Mask and Pumpkin Tee',
		thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg',
		points: 102,
		replies: 56,
		views: 184,
		last_active: '6 hours ago'
	}
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