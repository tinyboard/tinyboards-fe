<template>
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
				<tr v-for="item in posts" :key="item.post.id" class="bg-white odd:bg-gray-50 border-b last:border-0 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
					<th scope="row" class="flex items-center px-4 py-3 text-gray-900 dark:text-white">
						<!-- Avatar - Desktop Only -->
						<img
						loading="lazy"
						:src="item.creator.avatar || 'http://placekitten.com/200/300'"
						alt="avatar"
						class="hidden sm:inline flex-shrink-0 w-12 h-12 object-cover rounded-sm rounded-none p-0.5 border bg-white"
						/>
						<!-- Post Details -->
						<div class="flex flex-col sm:pl-3 sm:truncate">
							<!-- Title -->
							<NuxtLink class="text-base font-bold text-gray-900 visited:text-gray-400 hover:text-primary sm:overflow-hidden sm:text-ellipsis" :to="`/post/${item.post.id}`">
								{{ item.post.title }}
							</NuxtLink>
							<!-- Author -->
							<p class="mt-2 sm:mt-1 flex items-center font-normal text-sm text-gray-400">
								<!-- Avatar - Mobile Only -->
								<img
								loading="lazy"
								:src="item.creator.avatar || 'http://placekitten.com/200/300'"
								alt="avatar"
								class="sm:hidden flex-shrink-0 w-6 h-6 object-cover rounded-sm"
								/>
								<!-- Display Name -->
								<NuxtLink :to="`/user/${item.creator.name}`" class="ml-2 sm:ml-0">
									<strong>{{ item.creator.name }}</strong>
								</NuxtLink>
								<!-- Title -->
								<span v-if="item.creator && item.creator.title" class="ml-2 px-1 inline-flex leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
									{{ item.creator.title }}
								</span>
								<!-- Timestamps -->
								<span class="ml-2">
									<span class="font-black text-gray-400 dark:text-gray-500">·</span>
									<span class="pl-1">{{ formatDate(new Date(item.post.published)) }}</span>
								</span>
								<span class="ml-2" v-if="item.post.updated">
									<span class="font-black text-gray-400 dark:text-gray-500">·</span>
									<span class="italic pl-1"> Edited {{ formatDate(new Date(item.post.updated)) }}</span>
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
								{{ item.counts.score }}
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
								{{ item.counts.comments }}
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
								{{ formatDate(item.counts.newest_comment_time) }}
							</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
	import { formatDate } from '@/utils/formatDate';
	
	const props = defineProps({
		posts: Array,
		title: String
	})
</script>