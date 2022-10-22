<template>
	<div class="relative w-full flex flex-col space-y-6">
		<div v-if="post" class="w-full sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded-md">
			<!-- Pinned Banner -->
			<div v-if="post.isStickied" class="flex items-center mb-4 bg-white border-t border-b sm:border sm:rounded-md overflow-hidden">
				<div class="flex items-center justify-center w-10 h-10 bg-white border-r">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="text-primary w-4 h-4">
					  <path fill-rule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="text-base text-primary pl-3">This post has been pinned by the moderators.</div>
			</div>
			<!-- Post Body -->
			<!-- Post Meta Information & Content -->
			<div class="flex flex-shrink-0 items-center justify-between p-2.5 sm:p-0 border-b sm:border-0 dark:border-gray-700 dark:border-opacity-70">
				<div class="flex items-center w-full overflow-x-auto">
					<NuxtLink :to="'/'+post.author.username" class="mr-2">
						<!-- Avatar -->
						<img
						loading="lazy"
						:src="post.author.avatarUrl"
						alt="avatar"
						class="flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 object-cover rounded-sm sm:rounded-none sm:p-1 sm:border bg-white hover:bg-gray-200 hover:border-transparent"
						/>
					</NuxtLink>
					<div class="flex flex-col leading-4">
						<NuxtLink :to="'/'+post.author.username" class="flex items-center font-bold text-sm">
							<span>{{ post.author.username }}</span>
							<span v-if="post.author.title" class="ml-1 px-1 inline-flex text-sm font-normal leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
								{{ post.author.title }}
							</span>
						</NuxtLink>
						<p class="flex items-center space-x-2 text-sm mt-1 text-gray-400">
							<!-- Timestamp -->
							<span>{{ formatDate(post.createdUtc) }}</span>
							<span v-if="post.editedUtc != 0">
								<span class="font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="pl-1 italic">
									Edited {{ formatDate(post.editedUtc) }}
								</span>
							</span>
							<!-- Ratio -->
							<span>
								<span class="hidden md:inline-block font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="pl-1">
									{{ percentUpvoted }}% upvoted
								</span>
							</span>
						</p>
					</div>
				</div>
				<div class="hidden md:block">
					<!-- External Link Icon -->
					<a v-if="post.url && post.type === 'link'" :href="post.url" target="_blank" class="block">
						<i class="far fa-external-link text-gray-400"></i>
					</a>
					<!-- Thumbtack, Image, or Text Icon -->
					<!-- <div v-else>
						<i :class="post.isStickied ? 'fas fa-thumbtack text-green-500' : postIcon[post.type]"></i>
					</div> -->
				</div>
				<button class="flex items-center justify-center md:hidden -mr-1 p-1 text-gray-600 dark:text-gray-400">
					<i class="far fa-ellipsis-h fa-fw fa-lg"></i>
				</button>
			</div>
			<!-- Post Content -->
			<div class="px-2.5 sm:px-0 mt-3 sm:mt-4">
				<!-- Title -->
				<h1 class="text-lg md:text-xl leading-normal font-bold dark:text-gray-100 mb-2">
					{{ post.title }}
				</h1>
			</div>
			<!-- Post Embed -->
			<div class="px-2.5 sm:px-0 mt-3 sm:mt-4" v-if="post.url && post.type !== 'image'">
				<LinkPreview
				:domain="post.domain"
				:title="post.metaTitle"
				:thumbnail="post.thumbUrl"
				:url="post.url"
				:preview="post.metaDescription"
				/>
			</div>
			<!-- Post Image -->
			<div v-if="post.type === 'image'" class="flex justify-center mt-3 md:mt-4">
				<img
				:src="post.url"
				alt="Post image"
				class="w-full h-full object-cover"
				/>
			</div>
			<!-- Post Text Body -->
			<div v-if="post.htmlBody" class="px-2.5 sm:px-0 mt-3 sm:mt-4 relative overflow-hidden">
				<div class="dark:text-gray-200 break-words" v-html="post.htmlBody"></div>
			</div>
			<!-- Footer -->
			<div class="flex justify-between items-center px-2.5 py-4 sm:px-0 sm:py-0 mt-3 sm:mt-6">
				<!-- Desktop actions -->
				<div class="hidden md:flex flex-grow items-center space-x-6">
					<div class="group flex items-center space-x-2 leading-none">
						<button @click="vote(1)" :class="voteType === 1 ? 'text-primary' : 'text-gray-500'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
							</svg>
						</button>
						<span class="font-bold" :class="{ 'text-primary': voteType === 1, 'text-orange-600': voteType === -1, 'text-gray-900 dark:text-gray-300': voteType === 0 }">
							{{ post.score + voteType }}
						</span>
						<button @click="vote(-1)" :class="voteType === -1 ? 'text-orange-600' : 'text-gray-500'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"></path>
							</svg>
						</button>
					</div>
					<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5 mr-1">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
						</svg>
						<span class="text-sm font-bold">9 Comments</span>
					</button>
					<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5 mr-1">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
						   <rect x="9" y="3" width="6" height="4" rx="2"></rect>
						</svg>
						<span class="text-sm font-bold">Copy Link</span>
					</button>
					<button @click="save(post.isSaved)" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
						<!-- Bookmark Icon -->
						<svg v-show="!isSaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5 mr-1">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
						</svg>
						<!-- Bookmark Slash Icon -->
						<svg v-show="isSaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5 mr-1">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <line x1="3" y1="3" x2="21" y2="21"></line>
						   <path d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7"></path>
						</svg>
						<span class="text-sm font-bold">{{ isSaved ? 'Unsave' : 'Save' }}</span>
					</button>
					<button @click="subscribe(post.isSubscribed)" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
						<!-- Bell Icon -->
						<svg v-show="!isSubscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5 mr-1">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
						   <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
						</svg>
						<!-- Bell Slash Icon -->
						<svg v-show="isSubscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5 mr-1">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <line x1="3" y1="3" x2="21" y2="21"></line>
						   <path d="M17 17h-13a4 4 0 0 0 2 -3v-3a7 7 0 0 1 1.279 -3.716m2.072 -1.934c.209 -.127 .425 -.244 .649 -.35a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3"></path>
						   <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
						</svg>
						<span class="text-sm font-bold">{{ isSubscribed ? 'Unsubscribe' : 'Subscribe' }}</span>
					</button>
					<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-5 h-5 mr-1">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
						</svg>
						<span class="text-sm font-bold">Report</span>
					</button>
					<button v-if="author" class="flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600">
						<i class="far fa-trash-alt fa-fw mr-1"></i>
						<span class="text-sm font-bold">Delete</span>
					</button>
					<button v-if="author" class="flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600">
						<i class="far fa-pen fa-fw mr-1"></i>
						<span class="text-sm font-bold">Edit</span>
					</button>
				</div>
			</div>
		</div>
		<!-- Banner -->
		<div id="comments" class="w-full border rounded-md p-4 shadow-inner-white">
		    <h1 class="text-base text-gray-500 dark:text-gray-100 text-center">
		          <strong>Want to join the discussion? </strong>
		          <NuxtLink to="/sign-up">Sign up to comment</NuxtLink>
		    </h1>
		</div>
		<!-- Comments -->
		<ContentCommentList :comments="comments" :offset="offset" class="bg-gradient-to-b from-gray-200/50 p-2.5 sm:p-4 shadow-inner-xs sm:rounded-md sm:border sm:border-b-0 sm:border-transparent"/>
	</div>
</template>

<script setup>
	import { reactive, computed } from 'vue'

	import { formatDate } from '@/utils/formatDate';
	import { toPercent } from '@/utils/percent'

	import { useVote } from '@/composables/vote';
	import { useSave } from '@/composables/save';
	import { useSubscribe } from '@/composables/subscribe';

	const { voteType, vote } = useVote();
	const { isSaved, save } = useSave();
	const { isSubscribed, subscribe } = useSubscribe();

	const percentUpvoted = computed(() => {
		const num = 1 - post.downvotes / post.upvotes;
		return toPercent(num);
	})

	const offset = computed(() => {
		if (comments && comments.length) {
			return comments[0].level - 1
		} else {
			return 0
		}
	});

	const comments = [
	{
		id: 1,
		author: {
			username: 'elon',
			avatar_url: 'https://i.imgur.com/svGJfRg.jpg',
			title: 'developer',
			titleColor: '#1E1E1E',
		},
		parent_comment_id: null,
		created_utc: 1666434191,
		edited_utc: 1666434291,
		score: 42,
		upvotes: 48,
		downvotes: 4,
		replies: [
		{
			id: 1,
			author: {
				username: 'tim_apple',
				title: 'developer',
				titleColor: '#1E1E1E',
				avatar_url: 'https://i.imgur.com/nzY5zAg.jpg',
			},
			parent_comment_id: 1,
			parent_permalink: '/post/1#comment-1',
			created_utc: 1666434191,
			edited_utc: 1666434291,
			score: 23,
			upvotes: 24,
			downvotes: 1,
			replies: [],
			level: 0,
			body_html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea <strong>commodo consequat</strong>. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
			parent_author: {
				username: 'elon'
			}
		}
		],
		level: 0,
		body_html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea <strong>commodo consequat</strong>. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
	}
	];

	const post = {
		id: 1,
		author: {
			username: 'tim_apple',
			usernameColor: '#FF0000',
			title: 'developer',
			titleColor: '#1E1E1E',
			avatarUrl: 'https://i.imgur.com/nzY5zAg.jpg',
		},
		score: 20,
		upvotes: 28,
		downvotes: 8,
		type: 'link',
		url: '',
		permalink: '1',
		domain: 'reddit.com',
		title: "iOS 16 lets you customize your Lock Screen in fun new ways. Layer a photo to make it pop. Track your Activity rings. And see live updates from your favorite apps.",
		thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg',
		htmlBody: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea <strong>commodo consequat</strong>. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
		isStickied: false,
		isSaved: true,
		isSubscribed: true,
		createdUtc: 1664856789,
		editedUtc: 1665295944
	}

	if (post.isSaved) {
		isSaved.value = post.isSaved;
	};
	if (post.isSubscribed) {
		isSubscribed.value = post.isSubscribed;
	};
</script>