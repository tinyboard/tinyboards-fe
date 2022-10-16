<template>
	<main class="flex pt-12 sm:pt-14">
	    <!-- Sub Navigation -->
	    <section>
	          <NavigationNavbarSub :links="links"/>
	    </section>
	    <!-- Main Content -->
	    <section class="container mx-auto max-w-8xl grid grid-cols-12 pt-10 px-4 sm:px-6">
	    	<!-- User Details -->
			<div class="col-span-full flex gap-6 py-8 my-2.5 sm:my-0">
				<!-- Stats -->
				<div class="w-full bg-gray-200/50 shadow-inner-xs sm:rounded-lg">
					<div class="flex items-center space-x-4 px-4 sm:px-6 py-4 text-sm text-gray-500 leading-normal">
						<ul class="flex flex-grow items-center text-sm text-gray-400">
							<li class="flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 -ml-0.5 mr-1">
									<path d="M6.75.98l-.884.883a1.25 1.25 0 101.768 0L6.75.98zM13.25.98l-.884.883a1.25 1.25 0 101.768 0L13.25.98zM10 .98l.884.883a1.25 1.25 0 11-1.768 0L10 .98zM7.5 5.75a.75.75 0 00-1.5 0v.464c-1.179.305-2 1.39-2 2.622v.094c.1-.02.202-.038.306-.051A42.869 42.869 0 0110 8.5c1.93 0 3.83.129 5.694.379.104.013.206.03.306.051v-.094c0-1.232-.821-2.317-2-2.622V5.75a.75.75 0 00-1.5 0v.318a45.645 45.645 0 00-1.75-.062V5.75a.75.75 0 00-1.5 0v.256c-.586.01-1.17.03-1.75.062V5.75zM4.505 10.365A41.377 41.377 0 0110 10c1.863 0 3.697.124 5.495.365C16.967 10.562 18 11.838 18 13.28v.693a3.72 3.72 0 01-1.665-.393 5.222 5.222 0 00-4.67 0 3.722 3.722 0 01-3.33 0 5.222 5.222 0 00-4.67 0A3.72 3.72 0 012 13.972v-.693c0-1.441 1.033-2.716 2.505-2.914zM15.665 14.921a5.22 5.22 0 002.335.551V16.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-1.028c.8 0 1.6-.183 2.335-.551a3.722 3.722 0 013.33 0c1.47.735 3.2.735 4.67 0a3.722 3.722 0 013.33 0z">
									</path>
								</svg>
								<span>
									Member since
									<strong class="text-gray-600">Nov 5, 2022</strong>
								</span>
							</li>
							<li class="ml-4 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd">
									</path>
								</svg>
								<span>
									Last seen
									<strong class="text-gray-600">this week</strong>
								</span>
							</li>
						</ul>
						<ul class="ml-auto hidden lg:flex items-center text-sm text-gray-400">
							<li class="flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
									<path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z">
									</path>
								</svg>
								<span>Followers
									<strong class="text-gray-600">91</strong>
								</span>
							</li>
							<li class="ml-4 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
									<path fill-rule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698 5 5 0 004.503 5.152 6 6 0 002.946 1.822A6.451 6.451 0 017.768 13H7.5A1.5 1.5 0 006 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 00-1.5-1.5h-.268a6.453 6.453 0 01-.684-2.202 6 6 0 002.946-1.822 5 5 0 004.503-5.152.75.75 0 00-.552-.698A31.804 31.804 0 0016 2.562v-.387a.75.75 0 00-.629-.74A33.227 33.227 0 0010 1zM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 01-1.855-2.68zm14.95 0a3.503 3.503 0 01-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332z" clip-rule="evenodd">
									</path>
								</svg>
								<span>
									Reputation <strong class="text-gray-600">400</strong>
								</span>
							</li>
							<li class="ml-4 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
									<path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"></path>
									<path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"></path>
								</svg>
								<span>Total posts
									<strong class="text-gray-600">240</strong>
								</span>
							</li>
						</ul>
					</div>
					<!-- Details -->
			    	<div id="details" class="relative flex flex-wrap md:flex-nowrap items-center w-full p-4 sm:p-6 bg-cover bg-center sm:rounded-b-lg" :style="{ backgroundImage: `url(https://i.imgur.com/HRYqKAf.jpg)` }">
			    		<!-- Avatar -->
				    	<img
						loading="lazy"
						src="http://placekitten.com/200/300"
						alt="avatar"
						class="flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded-none p-1 border bg-white"
						/>
						<!-- Info -->
						<div class="flex flex-col md:ml-4 mt-4 md:mt-0">
							<div class="flex items-center space-x-2">
								<!-- Display Name -->
								<h1 class="text-gray-100 text-2xl leading-5 font-medium">
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
			</div>
	    	<!-- User Content -->
			<div class="col-span-full flex gap-6 py-8 sm:px-6 lg:px-8 xl:px-0 my-2.5 sm:my-0">
             	<div class="relative w-full overflow-x-auto sm:rounded-lg">
				    <table class="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
				        <thead class="text-base text-gray-700 leading-5 w-full p-4 lg:p-6 bg-gray-200/50 shadow-inner-xs sm:rounded-lg">
				            <tr>
				                <th scope="col" class="w-4/6 py-4 px-4 font-medium">
									Recent posts
								</th>
								<th scope="col" class="hidden lg:table-cell text-center py-4 px-4 font-normal">
									Points
								</th>
								<th scope="col" class="hidden lg:table-cell text-center py-4 px-4 font-normal">
									Replies
								</th>
								<th scope="col" class="w-1/6 hidden xl:table-cell py-4 px-4 font-normal">
									Last reply
								</th>
				            </tr>
				        </thead>
				        <tbody>
							<tr v-for="item in items" :key="item.id" class="bg-white border-b last:border-0 dark:bg-gray-800 dark:border-gray-700">
								<th scope="row" class="flex items-center p-4 text-gray-900 dark:text-white">
									<!-- Avatar -->
									<img
									loading="lazy"
									:src="item.author.avatarUrl"
									alt="avatar"
									class="flex-shrink-0 w-8 h-8 sm:w-14 sm:h-14 object-cover rounded-sm sm:rounded-none sm:p-1 sm:border bg-white"
									/>
									<!-- Post Details -->
									<div class="flex flex-col pl-3 sm:truncate">
										<!-- Title -->
										<NuxtLink class="text-base font-medium text-gray-900 visited:text-gray-400 hover:text-primary sm:overflow-hidden sm:text-ellipsis" :to="`/post/${item.id}`">
											{{ item.title }}
										</NuxtLink>
										<!-- Author -->
										<p class="mt-1 flex items-center space-x-2 font-normal text-sm text-gray-400">
											<!-- Display Name -->
											<NuxtLink to="/user/Bret">
												<strong>{{ item.author.username }}</strong>
											</NuxtLink>
											<!-- Title -->
											<span class="px-1 inline-flex leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
												developer
											</span>
											<!-- Timestamps -->
											<span>
												<span class="font-black text-gray-400 dark:text-gray-500">·</span>
												<span class="pl-1">12 days ago</span>
											</span>
											<span>
												<span class="font-black text-gray-400 dark:text-gray-500">·</span>
												<span class="italic pl-1"> Edited 7 days ago</span>
											</span>
										</p>
									</div>
								</th>
								<td class="hidden lg:table-cell text-center py-4 px-4">
									{{ item.points }}
								</td>
								<td class="hidden lg:table-cell text-center py-4 px-4">
									{{ item.replies }}
								</td>
								<td class="hidden xl:table-cell py-4 px-4">
									{{ item.last_active }}
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
	import { fetchUser } from '@/composables/user'

	const route = useRoute()
	const username = computed(() => route.params.username)

	const user = await fetchUser(username)

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