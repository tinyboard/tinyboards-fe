<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h2 class="text-lg font-medium leading-6 text-gray-900">Profile</h2>
				<p class="mt-1 text-sm text-gray-600">This information will be displayed on the World Wide Web just so
					you know.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Photo -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Avatar</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex items-center">
							<img v-if="imageStore.avatar || settings.avatar" :src="imageStore.avatar ?? settings.avatar"
								class="w-20 h-20 object-cover p-0.5 border bg-white" />
							<div v-else class="w-20 h-20 rounded-md border border-gray-300 border-dashed"></div>
							<div class="ml-5">
								<div class="flex space-x-2">
									<label for="avatar-upload" class="inline-block button gray cursor-pointer">
										{{ settings.avatar ? 'Change avatar' : 'Upload avatar' }}
									</label>
									<button
										v-if="settings.avatar"
										@click="removeAvatar"
										type="button"
										class="button red"
										:disabled="isRemoving.avatar">
										{{ isRemoving.avatar ? 'Removing...' : 'Remove' }}
									</button>
								</div>
								<input id="avatar-upload" type="file" class="hidden"
									accept="image/png, image/jpeg, image/gif"
									@change="e => onFileChange(e, 'avatar')" />
								<small class="block mt-2 text-gray-400">
									PNG, JPG and GIF up to 2MB.
								</small>
							</div>
						</div>
					</div>
					<!-- Banner -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Banner</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex flex-col">
							<img v-if="imageStore.banner || settings.banner" :src="imageStore.banner ?? settings.banner"
								class="w-full h-24 object-cover p-0.5 border bg-white" />
							<div v-else class="w-full h-32 rounded-md border border-gray-300 border-dashed"></div>
							<div class="mt-5">
								<div class="flex space-x-2">
									<label for="banner-upload" class="inline-block button gray cursor-pointer">
										{{ settings.banner ? 'Change banner' : 'Upload banner' }}
									</label>
									<button
										v-if="settings.banner"
										@click="removeBanner"
										type="button"
										class="button red"
										:disabled="isRemoving.banner">
										{{ isRemoving.banner ? 'Removing...' : 'Remove' }}
									</button>
								</div>
								<input id="banner-upload" type="file" class="hidden"
									accept="image/png, image/jpeg, image/gif"
									@change="e => onFileChange(e, 'banner')" />
								<small class="block mt-2 text-gray-400">
									PNG, JPG and GIF up to 5MB. Recommended approximate ratio: 5:1.
								</small>
							</div>
						</div>
					</div>
					<!-- Background -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Profile background</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex flex-col">
							<img v-if="imageStore.background || settings.profile_background"
								:src="imageStore.background ?? settings.profile_background"
								class="w-full h-56 object-cover p-0.5 border bg-white" />
							<div v-else class="w-full h-24 rounded-md border border-gray-300 border-dashed"></div>
							<div class="mt-5">
								<label for="background-upload" class="inline-block button gray cursor-pointer">
									{{ settings.profileBackground ? 'Change background' : 'Upload background' }}
								</label>
								<input id="background-upload" type="file" class="hidden"
									accept="image/png, image/jpeg, image/gif"
									@change="e => onFileChange(e, 'background')" />
								<small class="block mt-2 text-gray-400">
									PNG, JPG and GIF up to 5MB.
								</small>
							</div>
						</div>
					</div>
					<!-- Display Name -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Display name</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="text" v-model="settings.displayName" name="displayname" id="displayname"
								class="mt-1 form-input gray" placeholder="My profile looks horrible" />
							<p class="mt-2 text-sm text-gray-500">
								How you primarily appear as on your profile and on posts and comments that you make.
								Your @username can't and won't be changed.
							</p>
						</div>
					</div>
					<!-- Biography -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Biography</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<textarea id="biography" name="biography" rows="4"
								class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
								placeholder="A stranger surfing this World Wide Web." v-model="settings.bio" />
							<div class="flex justify-between items-center mt-2">
								<p class="text-sm text-gray-500">Brief description about yourself. Markdown supported.</p>
								<button
									v-if="settings.bio && settings.bio.trim()"
									@click="clearBio"
									type="button"
									class="text-sm text-red-600 hover:text-red-800"
									:disabled="isRemoving.bio">
									{{ isRemoving.bio ? 'Clearing...' : 'Clear bio' }}
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4">
					<button type="submit" class="button primary" :class="{ 'loading': isLoading }"
						:disabled="isLoading">
						Save
					</button>
				</div>
			</form>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
// import { baseURL } from "@/server/constants";
// import { useAPI } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
//import { useLoggedInUser } from '@/stores/StoreAuth';
//import { useModalStore } from "@/stores/StoreModal";
import { useImageStore } from '@/stores/StoreImages';
import { dataURLtoFile } from '@/utils/files';
import { onFileChange } from '@/composables/images';
import { useGqlMultipart } from "@/composables/graphql_multipart";

definePageMeta({
	'hasAuthRequired': true,
	'alias': '/settings/profile',
	'title': 'Profile',
	'isLeftNavbarDisabled': true
});

const toast = useToastStore();
// const authCookie = useCookie("token").value;
//const userStore = useLoggedInUser();
// const modalStore = useModalStore();
const imageStore = useImageStore();

//const v = userStore.user;

const SAVE_SETTINGS_QUERY = `
    mutation saveSettings(
    $displayName: String,
    $bio: String,
    $avatar: Upload,
    $banner: Upload,
    $profileBackground: Upload
    ) {
    updateSettings(
    displayName: $displayName,
    bio: $bio,
    avatar: $avatar,
    banner: $banner,
    profileBackground: $profileBackground
    ) { id }
    }
 `;

const settings = ref({});
const { data } = await useAsyncGql({ operation: 'getSettings' });
if (data.value.me) {
	const s = data.value.me;
	settings.value = {
		/*...data.value.me.settings,
		   ...data.value.me*/
		bio: s.bio,
		displayName: s.displayName,
		avatar: s.avatar,
		banner: s.banner,
		background: s.background

	};
} else {
	throw createError({
		statusCode: 500,
		statusMessage: "Internal server error while loading your settings.",
		fatal: true
	});
}



// Submit settings
const isLoading = ref(false);

/*const change = ({ coordinates, canvas }) => {
   console.log(coordinates, canvas);
   }*/

const files = {};

// Track which items are being removed
const isRemoving = ref({
	avatar: false,
	banner: false,
	bio: false
});

// Remove Avatar
const removeAvatar = async () => {
	isRemoving.value.avatar = true;
	try {
		const { $gql } = useNuxtApp();
		const result = await $gql.mutation({
			removeAvatar: {
				id: true,
				avatar: true
			}
		});

		if (result.removeAvatar) {
			settings.value.avatar = null;
			imageStore.purgeAvatar();
			toast.addNotification({
				header: "Avatar removed",
				message: "Your avatar has been successfully removed.",
				type: "success"
			});
		}
	} catch (error) {
		console.error('Error removing avatar:', error);
		toast.addNotification({
			header: "Failed to remove avatar",
			message: error.message || "An error occurred while removing your avatar.",
			type: "error"
		});
	} finally {
		isRemoving.value.avatar = false;
	}
};

// Remove Banner
const removeBanner = async () => {
	isRemoving.value.banner = true;
	try {
		const { $gql } = useNuxtApp();
		const result = await $gql.mutation({
			removeBanner: {
				id: true,
				banner: true
			}
		});

		if (result.removeBanner) {
			settings.value.banner = null;
			imageStore.purgeBanner();
			toast.addNotification({
				header: "Banner removed",
				message: "Your banner has been successfully removed.",
				type: "success"
			});
		}
	} catch (error) {
		console.error('Error removing banner:', error);
		toast.addNotification({
			header: "Failed to remove banner",
			message: error.message || "An error occurred while removing your banner.",
			type: "error"
		});
	} finally {
		isRemoving.value.banner = false;
	}
};

// Clear Bio
const clearBio = async () => {
	isRemoving.value.bio = true;
	try {
		const { $gql } = useNuxtApp();
		const result = await $gql.mutation({
			clearBio: {
				id: true,
				bio: true
			}
		});

		if (result.clearBio) {
			settings.value.bio = '';
			toast.addNotification({
				header: "Bio cleared",
				message: "Your bio has been successfully cleared.",
				type: "success"
			});
		}
	} catch (error) {
		console.error('Error clearing bio:', error);
		toast.addNotification({
			header: "Failed to clear bio",
			message: error.message || "An error occurred while clearing your bio.",
			type: "error"
		});
	} finally {
		isRemoving.value.bio = false;
	}
};

const submitSettings = async () => {
	isLoading.value = true;

	// upload images
	if (imageStore.avatar) {
		files["avatar"] = dataURLtoFile(imageStore.avatar);
		// after converting to file is finished, delete the original b64 url
		imageStore.purgeAvatar();
	}

	if (imageStore.banner) {
		files["banner"] = dataURLtoFile(imageStore.banner);
		imageStore.purgeBanner();
	}

	if (imageStore.background) {
		files["profileBackground"] = dataURLtoFile(imageStore.background);
		imageStore.purgeBackground();
	}

	useGqlMultipart({
		query: SAVE_SETTINGS_QUERY,
		variables: {
			displayName: settings.value.displayName,
			bio: settings.value.bio,
			avatar: null,
			banner: null,
			profileBackground: null
		},
		files
	}).then(({ data }) => {
		isLoading.value = false;
		if (!!data.value.data) {
			window.location.reload(true);
		} else {
			console.error("Error: " + data.value.errors[0].message);
			toast.addNotification({
				header: "Failed to save settings",
				message: data.value.errors[0].message,
				type: "error",
				isVisibleOnRouteChange: true
			});
		}
	});
};

</script>
