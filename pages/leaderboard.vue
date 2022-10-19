<template>
	<main class="flex pt-12 sm:pt-14">
		<!-- Sub Navigation -->
		<section>
			<NavigationNavbarSub :links="links"/>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 pt-10 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6 py-8 my-2.5 sm:my-0">
				<!-- Main Content -->
				<div class="relative w-full sm:rounded-md overflow-x-auto">
					<!-- Banner -->
					<MediaBanner
					title="Leaderboard"
					sub-title="The Foruhm community's most terminally online members."
					image-url="https://i.imgur.com/4MvaMAI.jpg"
					/>
					<table class="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead class="text-base text-gray-700 leading-5 w-full px-4 py-3 lg:p-6 bg-gray-200/50 shadow-inner-xs">
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
							<tr v-for="item in items" :key="item.id" class="bg-white border-b last:border-0 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
								<th scope="row" class="flex items-center px-4 py-3 text-gray-900 dark:text-white">
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
										<NuxtLink class="text-base font-bold text-gray-900 visited:text-gray-400 hover:text-primary sm:overflow-hidden sm:text-ellipsis" :to="`/post/${item.id}`">
											{{ item.title }}
										</NuxtLink>
										<!-- Author -->
										<p class="mt-1 flex items-center space-x-2 font-normal text-sm text-gray-400">
											<!-- Display Name -->
											<NuxtLink to="/Bret">
												<strong>{{ item.author.username }}</strong>
											</NuxtLink>
											<!-- Title -->
											<span class="px-1 inline-flex leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
												{{ item.author.title }}
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
								<td class="hidden lg:table-cell py-4 px-4">
									<div class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-40 w-4 h-4">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0V8.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L6.2 9.74a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clip-rule="evenodd" />
										</svg>
										<span class="pl-1">
											{{ item.points }}
										</span>
									</div>
								</td>
								<td class="hidden lg:table-cell py-4 px-4">
									<div class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-40 w-4 h-4">
											<path fill-rule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 01-5.183.501.78.78 0 00-.528.224l-3.579 3.58A.75.75 0 016 17.25v-3.443a41.033 41.033 0 01-2.57-.33C1.993 13.244 1 11.986 1 10.573V5.426c0-1.413.993-2.67 2.43-2.902z" clip-rule="evenodd" />
										</svg>
										<span class="pl-1">
											{{ item.replies }}
										</span>
									</div>
								</td>
								<td class="hidden xl:table-cell py-4 px-4">
									<div class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-40 w-4 h-4">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
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
				<!-- Sidebar -->
				<NavigationSidebar />
			</div>
		</section>
	</main>
</template>

<script setup>
	defineProps({
		title: String
	})

	// local state
	const links = [
	{ name: 'Hot', href: '/feed' },
	{ name: 'Latest', href: '/feed?sort=new' },
	{ name: 'Top All', href: '/feed?sort=top&time=all' },
	{ name: 'Top Month', href: '/feed?sort=top&time=month' },
	{ name: 'Top Week', href: '/feed?sort=top&time=week' },
	{ name: 'Top Day', href: '/feed?sort=top&time=day' },
	{ name: 'Most Comments', href: '/feed?sort=top&time=all&type=comments' },
	{ name: 'Latest Comments', href: '/feed?sort=new&type=comments' }
	];

	const items = [
	{
		id: 1,
		author: {
			username: 'bret',
			avatarUrl: 'https://i.imgur.com/nzY5zAg.jpg',
			title: 'developer'
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
		last_active: '7hrs ago'
	},
	{
		id: 2,
		author: {
			username: 'timapple',
			avatarUrl: 'https://i.imgur.com/401QojU.gif?noredirect',
			title: 'ceo of iphone'
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
		last_active: '3d ago'
	},
	{
		id: 3,
		author: {
			username: 'elon',
			avatarUrl: 'https://i.imgur.com/svGJfRg.jpg',
			title: 'rocket daddy'
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
		last_active: '2hrs ago'
	},
	{
		id: 4,
		author: {
			username: 'pumpkinhead',
			avatarUrl: 'https://media.tenor.com/bfeoTmST6nMAAAAC/pumpkin-head-cemetery.gif',
			title: 'pump/kin'
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
		last_active: '6hrs ago'
	}
	]
</script>