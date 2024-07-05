<template>
	<div class="flex flex-col space-y-4 md:flex-row space-y-0 col-span-full p-4 md:px-8 border-b border-gray-200 sm:border sm:rounded"
		:class="[user.banner ? '' : 'bg-primary bg-opacity-20']"
		:style="{
			backgroundImage: `url(${user.banner})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		}">
		<div class="flex flex-row space-x-4 flex-grow">
			<!-- Avatar and FRAME!! :DD -->
			<div class="relative w-24 h-24 md:w-44 md:h-44">
				<img id="frame" :src="frame" class="z-10 absolute w-full h-full"/>
				<img :src="user.avatar"
					class="absolute rounded-sm w-full h-full object-cover" />
			</div>
			<div class="mt-2 flex flex-col">
				<h1 class="font-bold text-xl sm:text-3xl text-white drop-shadow-md">{{ user.display_name ?? user.name }}</h1>
				<p class="text-md text-white drop-shadow-xl">
					{{ user.name }}
					<span v-if="user.instance">@{{ user.instance }}</span>
					<span v-if="user.is_admin" class="ml-2 badge badge-large badge-red">
						Admin
					</span>
				</p>
				<!-- Bio (desktop) -->
				<div id="bio" v-if="user.bio" class="hidden sm:block relative mt-2 rounded w-full sm:w-72 bg-white p-2 pl-4">
					<h6 class="font-semibold text-xs text-gray-900">About me</h6>
					<p class="text-md text-gray-700">{{ user.bio }}</p>
				</div>
				<p v-else class="hidden sm:block mt-2 font-italic text-gray-400 text-md">This user has no bio. How boring.</p>
			</div>
		</div>
		<div class="flex flex-col space-y-2 flex-grow-0 w-full sm:w-72">
			<!-- Bio (mobile) -->
			<div id="bio" v-if="user.bio" class="mb-2 block sm:hidden relative mt:mt-2 rounded w-full sm:w-72 bg-white p-2 pl-4">
				<h6 class="font-semibold text-xs text-gray-900">About me</h6>
				<p class="text-md text-gray-700">{{ user.bio }}</p>
			</div>
			<p v-else class="block sm:hidden mt-2 font-italic text-gray-400 text-md">This user has no bio. How boring.</p>
			<!-- Counts -->
			<div class="w-full rounded bg-white bg-opacity-70 px-4 py-2 flex flex-row justify-around divide-x divide-gray-300">
				<div class="flex flex-col flex-grow text-center">
					<p class="text-xl text-gray-700 font-semibold">{{ counts.rep }}</p>
					<p class="text-md text-gray-600 font-semibold">Rep</p>
				</div>
				<div class="flex flex-col flex-grow text-center">
					<p class="text-xl text-gray-700 font-semibold">{{ counts.post_count }}</p>
					<p class="text-md text-gray-600 font-semibold">Posts</p>
				</div>
				<div class="flex flex-col flex-grow text-center">
					<p class="text-xl text-gray-700 font-semibold">{{ counts.comment_count }}</p>
					<p class="text-md text-gray-600 font-semibold">Comments</p>
				</div>
			</div>
			<!-- Actions -->
			<ul v-if="isAuthed" class="flex flex-row space-x-2 w-full text-center">
				<li class="flex-grow" v-if="isSelf">
					<NuxtLink to="/settings/profile" class="button white w-full">
						Edit my profile
					</NuxtLink>
				</li>
				<li class="flex-grow" v-if="!isSelf">
					<button class="button white w-full" disabled>
						Follow
					</button>
				</li>
				<li class="flex-grow" v-if="!isSelf">
					<button class="button white w-full" disabled>
						Send message
					</button>
				</li>
				<li v-if="!isSelf">
					<LazyMenusActionsProfile :user="user" :isAdmin="isAdmin" :isSelf="isSelf" :isLeft="true" />
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { format, parseISO } from "date-fns";
	import { requirePermission } from '@/composables/admin';
	import { useLoggedInUser } from "@/stores/StoreAuth";

	const userStore = useLoggedInUser();
	const frame = 'https://i.ibb.co/PZ4rj8Z/6e1b5f5977036a189465f5455f2c54722c12883d.png';

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
		return !!userStore.user && userStore.user.is_admin
	});*/
	const isAdmin = requirePermission("users");
</script>

<style scoped>
	#frame {
		transform: scale(1.20);
	}

	@media screen and (max-width: 640px) {
		#bio::before {
			content: "";
		    position: absolute;
		    z-index: 0;
		    top: -5px;
		    left: 40px;
		    display: block;
		    width: 12px;
		    height: 12px;
		    background-color: rgb(255, 255, 255, 1);
		    background-opacity: 0.7;
		    transform: rotate(45deg);
		}
	}

	@media screen and (min-width: 640px) {
		#bio::before {
			content: "";
		    position: absolute;
		    z-index: 0;
		    top: 10px;
		    left: -5px;
		    display: block;
		    width: 12px;
		    height: 12px;
		    background-color: rgb(255, 255, 255, 1);
		    background-opacity: 0.7;
		    transform: rotate(45deg);
		}
	}
	
</style>
