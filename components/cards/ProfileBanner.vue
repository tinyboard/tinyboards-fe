<template>
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
						<span :title="user.creationDate" class="font-medium text-gray-600">
							{{ format(parseISO(user.creationDate), 'yyyy MMM. dd') }}
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
						<span class="font-medium text-gray-600">{{ counts.postCount }}</span>
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
						<span class="font-medium text-gray-600">{{ counts.commentCount }}</span>
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
					<h1 class="text-gray-100 text-lg sm:text-3xl leading-5 font-bold drop-shadow-lg">
						{{ user.display_name }}
					</h1>
					<div class="flex items-center text-gray-200">
						{{ user.name }}
						<span v-if="user.instance">@{{ user.instance }}</span>
						<span v-if="user.isAdmin" class="ml-2 badge badge-large badge-red">
							Admin
						</span>
					</div>
				</div>
				<div v-else class="flex items-center">
					<h1 class="text-gray-100 text-lg sm:text-2xl leading-5 font-bold">
						{{ user.name }}
					</h1>
					<span v-if="user.isAdmin" class="ml-2 badge badge-large badge-red">Admin</span>
				</div>
				<!-- Bio -->
				<p class="mt-2.5 lg:w-4/5 xl:w-3/5"
					:class="!user.bio ? 'text-gray-400 italic' : 'text-gray-100'">
					{{ user.bio || 'No bio...' }}
				</p>
				<!-- Stats -->
				<small class="sm:hidden mt-2 text-gray-300">
					Joined {{ format(parseISO(user.creationDate), 'MMM dd, yyyy') }}
				</small>
				<!-- Actions -->
				<ul v-if="isAuthed" class="mt-2 flex items-center space-x-2">
					<li v-if="isSelf">
						<NuxtLink to="/settings/" class="button button-sm white">
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
</template>

<script setup>
	import { format, parseISO } from "date-fns";
	import { requirePermission } from '@/composables/admin';
	import { useLoggedInUser } from "@/stores/StoreAuth";

	const userStore = useLoggedInUser();

	const props = defineProps({
		user: {
			type: Object,
			required: true
		},
		counts: {
			type: Object,
			required: true
		}
	});

	// Is Authed
	const isAuthed = userStore.isAuthed;

	// Is Self
	const isSelf = computed(() => {
		return !!userStore.user && userStore.user.name === props.user.name
	});

	// Admin
	/*const isAdmin = computed(() => {
		return !!userStore.user && userStore.user.isAdmin
	});*/
	const isAdmin = requirePermission("users");
</script>