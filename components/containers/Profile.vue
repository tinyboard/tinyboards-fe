<template>
	<div class="col-span-full bg-gray-200/50 sm:rounded-md sm:border sm:shadow-inner-white">
		<div class="flex items-center space-x-4 p-4 text-sm text-gray-500 leading-normal">
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
					<span>Total posts
						<span class="font-medium text-gray-600">{{ user.posts_count }}</span>
					</span>
				</li>
				<li class="ml-6 flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
					</svg>
					<span>Total comments
						<span class="font-medium text-gray-600">{{ user.comments_count }}</span>
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
			class="flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded-none p-0.5 border bg-white"
			/>
			<!-- Info -->
			<div class="flex flex-col md:ml-4 mt-4 md:mt-0">
				<div class="flex items-center">
					<!-- Display Name -->
					<h1 class="text-gray-100 text-2xl leading-5 font-bold">
						{{ user.username }}
					</h1>
					<!-- Title -->
					<span v-if="item.creator.admin" class="ml-1 badge badge-large badge-blue">Admin</span>
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
</template>

<script setup>
	import { computed } from 'vue';
	import { format, parseISO } from "date-fns";

	const props = defineProps({
		user: {
			type: Object,
			required: true
		}
	})

	const reputation = computed(() => {
		const u = props.user;
		const score = u.posts_score + u.comments_score;
		const count = u.posts_count + u.comments_count;
		const num = score / count * 100
		if (!isFinite(num)) return 0;
		return num.toFixed(0);
	});
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