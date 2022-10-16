<template>
	<table class="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
		<thead class="text-base text-gray-700 leading-5 w-full p-4 lg:p-6 bg-gray-200/50 shadow-inner-xs sm:rounded-lg">
			<tr>
				<th scope="col" class="w-4/6 py-4 px-4 font-medium">
					{{ title ?? 'Recent posts' }}
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
</template>

<script setup>
	defineProps({
	  title: String
	})

	// local state
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
		last_active: '7 hours ago'
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
		last_active: '3 days ago'
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
		last_active: '2 hours ago'
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
		last_active: '6 hours ago'
	}
	]
</script>