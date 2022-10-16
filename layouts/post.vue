<template>
	<div v-if="post" class="w-full p-4 lg:p-6 bg-gray-200/50 shadow-inner-xs rounded-lg">
		<!-- Banner -->
		<div class="col-span-full mb-5 -mt-1">
		    <h1 class="text-base text-gray-500 dark:text-gray-100">
		          <strong>Want to join the discussion? </strong>
		          <NuxtLink to="/sign-up">Sign up to comment</NuxtLink>
		    </h1>
		</div>
		<!-- Pinned Banner -->
		<div v-if="post.isStickied" class="flex items-center mb-4 bg-white border-t border-b sm:border sm:rounded overflow-hidden">
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
				<NuxtLink :to="'/'+post.author.username" class="sm:p-1 sm:border sm:bg-white mr-2 hover:bg-gray-200 hover:border-transparent">
					<img
					loading="lazy"
					:src="post.author.avatarUrl"
					alt="avatar"
					class="w-9 h-9 md:w-12 md:h-12 object-cover rounded-sm sm:rounded-none"
					/>
				</NuxtLink>
				<div class="flex flex-col leading-4">
					<NuxtLink :to="'/'+post.author.username" class="flex items-center font-medium text-base">
						<span>{{ post.author.username }}</span>
						<span v-if="post.author.title" class="ml-2 px-2 inline-flex text-sm font-normal leading-5 rounded-sm text-white shadow-inner-white" :style="{ 'background-color': post.author.titleColor }">
							{{ post.author.title }}
						</span>
					</NuxtLink>
					<p class="flex items-center space-x-2 text-sm mt-1 text-gray-400">
						<span>{{ getFormat(post.createdUtc) }}</span>
						<span v-if="post.editedUtc != 0">
							<span class="font-black text-gray-400 dark:text-gray-500">·</span>
							<span class="italic pl-1">
								Edited {{ getFormat(post.editedUtc) }}
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
			<h1 class="text-lg md:text-xl leading-normal font-medium dark:text-gray-100 mb-2">
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
		<div class="flex justify-between items-center px-2.5 py-4 sm:px-0 sm:py-0 mt-4">

			<!-- Desktop actions -->
			<div class="hidden md:flex flex-grow items-center space-x-6">
				<div class="flex items-center space-x-2 leading-none">
					<button @click="vote(1)" :class="voteType === 1 ? 'text-primary' : 'text-gray-500'">
						<span class="text-[18px]">&#9650;</span>
					</button>
					<span class="font-medium" :class="{ 'text-primary': voteType === 1, 'text-orange-600': voteType === -1, 'text-gray-900 dark:text-gray-300': voteType === 0 }">
						{{ 1 + voteType }}
					</span>
					<button @click="vote(-1)" :class="voteType === -1 ? 'text-orange-600' : 'text-gray-500'">
						<span class="text-[18px]">&#9660;</span>
					</button>
				</div>
				<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-70 group-hover: opacity-100 w-4 h-4 mr-1">
					  <path fill-rule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 01-5.183.501.78.78 0 00-.528.224l-3.579 3.58A.75.75 0 016 17.25v-3.443a41.033 41.033 0 01-2.57-.33C1.993 13.244 1 11.986 1 10.573V5.426c0-1.413.993-2.67 2.43-2.902z" clip-rule="evenodd" />
					</svg>
					<span class="text-sm font-medium">9 Comments</span>
				</button>
				<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-70 group-hover: opacity-100 w-4 h-4 mr-1">
					  <path fill-rule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z" clip-rule="evenodd" />
					  <path fill-rule="evenodd" d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
					</svg>
					<span class="text-sm font-medium">Copy Link</span>
				</button>
				<button @click="save(post.isSaved)" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
					<!-- Bookmark Icon -->
					<svg v-show="!isSaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-70 group-hover: opacity-100 w-4 h-4 mr-1">
					  <path fill-rule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clip-rule="evenodd" />
					</svg>
					<!-- Bookmark Slash Icon -->
					<svg v-show="isSaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-70 group-hover: opacity-100 w-4 h-4 mr-1">
					  <path d="M17 4.517v9.301L5.433 2.252a41.44 41.44 0 019.637.058C16.194 2.45 17 3.414 17 4.517zM3 17.25V6.182l10.654 10.654L10 15.082l-5.925 2.844A.75.75 0 013 17.25zM3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z" />
					</svg>
					<span class="text-sm font-medium">{{ isSaved ? 'Unsave' : 'Save' }}</span>
				</button>
				<button @click="subscribe(post.isSubscribed)" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
					<!-- Bell Icon -->
					<svg v-show="!isSubscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-70 group-hover: opacity-100 w-4 h-4 mr-1">
					  <path fill-rule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clip-rule="evenodd" />
					</svg>
					<!-- Bell Slash Icon -->
					<svg v-show="isSubscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-70 group-hover: opacity-100 w-4 h-4 mr-1">
					  <path d="M4 8c0-.26.017-.517.049-.77l7.722 7.723a33.56 33.56 0 01-3.722-.01 2 2 0 003.862.15l1.134 1.134a3.5 3.5 0 01-6.53-1.409 32.91 32.91 0 01-3.257-.508.75.75 0 01-.515-1.076A11.448 11.448 0 004 8zM17.266 13.9a.756.756 0 01-.068.116L6.389 3.207A6 6 0 0116 8c.001 1.887.455 3.665 1.258 5.234a.75.75 0 01.01.666zM3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z" />
					</svg>
					<span class="text-sm font-medium">{{ isSubscribed ? 'Unsubscribe' : 'Subscribe' }}</span>
				</button>
				<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="opacity-70 group-hover: opacity-100 w-4 h-4 mr-1">
					  <path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z" />
					</svg>
					<span class="text-sm font-medium">Report</span>
				</button>
				<button v-if="author" class="flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600">
					<i class="far fa-trash-alt fa-fw mr-1"></i>
					<span class="text-sm font-medium">Delete</span>
				</button>
				<button v-if="author" class="flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600">
					<i class="far fa-pen fa-fw mr-1"></i>
					<span class="text-sm font-medium">Edit</span>
				</button>
				<Options/>
			</div>
		</div>
		<!-- Comments -->
	</div>
</template>

<script setup>
	// Import date-fns
	import { isValid, formatDistanceToNowStrict } from '@/node_modules/date-fns';

	import { useVote } from '@/composables/vote';
	import { useSave } from '@/composables/save';
	import { useSubscribe } from '@/composables/subscribe';

	const { voteType, vote } = useVote();
	let { isSaved, save } = useSave();
	let { isSubscribed, subscribe } = useSubscribe();

	const post = {
		id: 1,
		author: {
			username: 'tim_apple',
			usernameColor: '#FF0000',
			title: 'developer',
			titleColor: '#1E1E1E',
			avatarUrl: 'https://i.imgur.com/nzY5zAg.jpg',
		},
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

	const getFormat = (date) => {
		const timestamp = date * 1000
		if (isValid(timestamp)) {
			return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true })
		}
	}

	if (post.isSaved) {
		isSaved.value = post.isSaved;
	};
	if (post.isSubscribed) {
		isSubscribed.value = post.isSubscribed;
	};
</script>