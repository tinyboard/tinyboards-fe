<template>
	<div class="flex flex-col space-y-4 md:flex-row space-y-0 col-span-full p-4 md:px-8 border-b sm:rounded border-gray-200"
		:class="[user.banner ? '' : 'bg-primary bg-opacity-20', user.profile_background ? 'sm:border-0 shadow-md' : 'sm:border']"
		:style="{
			backgroundImage: `url(${isEditing ? (imageStore.banner ?? settings.banner) : user.banner})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		}">
		<div class="flex flex-row space-x-4 flex-grow">
			<!-- Avatar and FRAME!! :DD -->
			<div class="relative w-24 h-24 md:w-44 md:h-44">
				<img v-if="user.avatar_frame" id="frame" :src="user.avatar_frame" class="z-10 absolute w-full h-full"/>
				<img :src="isEditing ? (imageStore.avatar ?? settings.avatar) : user.avatar"
					class="absolute rounded-sm w-full h-full object-cover" />
			</div>
			<div class="flex flex-col" :class="{ 'mt-2': !isEditing }">
				<input v-if="isEditing" type="text" id="display-name" name="display-name" maxlength="30" v-model="settings.displayName" placeholder="Display name" class="border border-gray-800 bg-gray-800/20 w-full rounded-md font-bold text-white drop-shadow-md" />
				<h1 v-else class="font-bold text-xl sm:text-3xl text-white drop-shadow-md">{{ user.display_name ?? user.name }}</h1>
				<p class="text-md text-white drop-shadow-xl">
					{{ user.name }}
					<span v-if="user.instance">@{{ user.instance }}</span>
					<span v-if="user.is_admin" class="ml-2 badge badge-large badge-red">
						Admin
					</span>
				</p>
				<!-- Bio (desktop) -->
				<div id="bio" v-if="isEditing || user.bio" class="hidden sm:block relative mt-2 rounded w-full sm:w-72 bg-white/70 px-4 py-2">
					<h6 class="font-semibold text-xs text-gray-900">About me</h6>
					<div v-if="isEditing">
						<textarea id="biography" name="biography" maxlength="255" rows="2" class="block w-full rounded-md border-gray-200 bg-gray-100/70 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="settings.bio" placeholder="Brief description about yourself. Max 255 characters." />
						<div class="flex justify-end">
							<p class="text-xs" :class="[settings.bio?.length > 240 ? 'text-red-600' : 'text-gray-400']">{{ settings.bio?.length || 0 }} / 255</p>
						</div>
					</div>
					<div v-else class="text-md text-gray-700 user-bio" v-html="user.bio_html" />
				</div>
				<p v-else class="hidden sm:block mt-2 font-italic text-gray-400 text-md">This user has no bio. How boring.</p>
			</div>
		</div>
		<div class="flex flex-col space-y-2 flex-grow-0 w-full sm:w-72">
			<!-- Bio (mobile) -->
			<div id="bio-mobile" v-if="user.bio" class="mb-2 block sm:hidden relative mt:mt-2 rounded w-full sm:w-72 bg-white/70 p-2 pl-4">
				<h6 class="font-semibold text-xs text-gray-900">About me</h6>
				<div v-if="isEditing">
					<textarea id="biography" name="biography" maxlength="255" rows="2" class="block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="settings.bio" placeholder="Brief description about yourself. Max 255 characters." />
					<div class="flex justify-end">
						<p class="text-xs" :class="[settings.bio?.length > 240 ? 'text-red-600' : 'text-gray-400']">{{ settings.bio?.length || 0 }} / 255</p>
					</div>
				</div>
				<div v-else class="text-md text-gray-700 user-bio" v-html="user.bio_html" />
			</div>
			<p v-else class="block sm:hidden mt-2 font-italic text-gray-400 text-md">This user has no bio. How boring.</p>
			<!-- Editing: Change avatar and banner -->
			<div v-if="isEditing" class="w-full flex flex-col space-y-2 text-center">
				<div>
					<label for="avatar-upload" class="button white w-full cursor-pointer">
						Change avatar
					</label>
					<input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="e => onFileChange(e, 'avatar')" />
				</div>
				<div>
					<label for="banner-upload" class="button white w-full cursor-pointer">
						Change banner
					</label>
					<input id="banner-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="e => onFileChange(e, 'banner')"/>
				</div>
				<div>
					<label for="bg-upload" class="button white w-full cursor-pointer">
						Change background
					</label>
					<input id="bg-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="e => onFileChange(e, 'background')"/>
				</div>		
			</div>
			<!-- Else: Counts -->
			<div v-else class="w-full rounded bg-white bg-opacity-70 px-4 py-2 flex flex-row justify-around divide-x divide-gray-300">
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
			<ul v-if="isEditing" class="flex flex-row space-x-2 w-full text-center">
				<li class="flex-grow">
					<button class="button red w-full" @click="discard" :disabled="isLoading">
						Discard
					</button>
				</li>
				<li class="flex-grow">
					<button class="button green w-full" @click="submitSettings" :disabled="isLoading">
						Save changes
					</button>
				</li>
			</ul>
			<ul v-else-if="isAuthed" class="flex flex-row space-x-2 w-full text-center">
				<li class="flex-grow" v-if="isSelf">
					<button class="button white w-full" @click="isEditing = true">
						Edit my profile
					</button>
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
	import { ref } from "vue";
	import { format, parseISO } from "date-fns";
	import { requirePermission } from '@/composables/admin';
	import { useLoggedInUser } from "@/stores/StoreAuth";
	import { useImageStore } from '@/stores/StoreImages';
	import { useModalStore } from "@/stores/StoreModal";
	import { useToastStore } from '@/stores/StoreToast';
	import { onFileChange, uploadFile } from '@/composables/images';

	const userStore = useLoggedInUser();
	const imageStore = useImageStore();
	const modalStore = useModalStore();
	const toast = useToastStore();
	//const frame = 'https://i.ibb.co/PZ4rj8Z/6e1b5f5977036a189465f5455f2c54722c12883d.png';
	const isEditing = ref(false);
	const isLoading = ref(false)

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

	const settings = ref({
		displayName: props.user.display_name ?? props.user.name,
		avatar: props.user.avatar,
		background: props.user.profile_background,
		banner: props.user.banner,
		bio: props.user.bio
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

	// Settings
	const discard = () => {
		imageStore.purge();
		isEditing.value = false;
	}
	// File inputs
	

	const submitSettings = async () => {
		isLoading.value = true;

			// upload images
		if (imageStore.avatar) {
			const avatar = dataURLtoFile(imageStore.avatar);
				// after converting to file is finished, delete the original b64 url
			imageStore.purgeAvatar();

			try {
				settings.value.avatar = await uploadFile(avatar, 'avatar');
			} catch (e) {
				console.error(e);
				isLoading.value = false;
				return;
			}
		}

		if (imageStore.banner) {
			const banner = dataURLtoFile(imageStore.banner);
				// after converting to file is finished, delete the original b64 url
			imageStore.purgeBanner();

			try {
				settings.value.banner = await uploadFile(banner, 'banner');
			} catch (e) {
				console.error(e);
				isLoading.value = false;
				return;
			}
		}

		if (imageStore.background) {
			const background = dataURLtoFile(imageStore.background);
				// after converting to file is finished, delete the original b64 url
			imageStore.purgeBackground();

			try {
				settings.value.background = await uploadFile(background, 'background');
			} catch (e) {
				console.error(e);
				isLoading.value = false;
				return;
			}
		}

		const { data, pending, error, refresh } = await useApi('/settings', {
			method: "put",
			body: {
				"avatar": settings.value.avatar,
				"banner": settings.value.banner,
				"profile_background": settings.value.background,
				"bio": settings.value.bio,
				"display_name": settings.value.displayName,
			}
		});

		isLoading.value = false;

		if (data.value) {
				// refresh page to remove old data from everywhere
			window.location.reload(true);	
		} else {
			toast.addNotification({header:'Saving failed',message:'Your settings have failed to save.',type:'error'});

				// Log the error.
			console.error(error.value);
		}
	};
</script>

<style>
	#frame {
		transform: scale(1.20);
	}

	/* restrict usable html tags for bio */
	.user-bio ul {
		margin-left: 0.5rem;
		list-style-type: disc;
	}

	.user-bio ol {
		list-style-type: decimal;
	}

	.user-bio strong {
		font-weight: bold;
	}

	.user-bio h1, .user-bio h2, .user-bio h3, .user-bio h4, .user-bio h5, .user-bio h6 {
		font-weight: bold;
	}

	/* mobile */
	@media screen and (max-width: 640px) {
		#display-name {
			font-size: 1.25rem !important;
    		line-height: 1.75rem !important;
		}

		/*#bio::before {
			content: "";
		    position: absolute;
		    z-index: 0;
		    top: -5px;
		    left: 40px;
		    display: block;
		    width: 12px;
		    height: 12px;
		    background-color: rgb(255, 255, 255, 0.6);
		    background-opacity: 0.7;
		    transform: rotate(45deg);
		}*/
	}

	/* Tailwind breakpoint: sm */
	@media screen and (min-width: 640px) {
		#display-name {
			font-size: 1.875rem !important;
			line-height: 2.25rem !important;
		}

		/*#bio::before {
			content: "";
		    position: absolute;
		    z-index: 0;
		    top: 10px;
		    left: -5px;
		    display: block;
		    width: 12px;
		    height: 12px;
		    background-color: rgb(255, 255, 255, 0.5);
		    background-opacity: 0.7;
		    transform: rotate(45deg);
		}*/
	}
	
</style>
