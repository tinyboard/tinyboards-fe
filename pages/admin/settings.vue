<template>
	<NuxtLayout name="admin">
		<!-- Loading State -->
		<div v-if="pending" class="flex justify-center items-center p-8">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 m-4">
			<p class="text-red-800">Failed to load site settings: {{ error.message }}</p>
		</div>

		<!-- Main Content -->
		<div v-else class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Site</h3>
				<p class="mt-1 text-sm text-gray-600">Set your site's name and configure how it appears in search results
					and embeds.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="submitSettings" class="sm:border sm:rounded-md">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Site Name -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Site name</label>
						</div>
						<!-- Input -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="text" name="site-name" id="site-name" v-model="settings.name"
								class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
								placeholder="tinyboard" maxlength="36" />
							<p class="mt-2 text-sm text-gray-500">
								The name of your tinyboard. Visible wherever <span class="pre">site.name</span> is present.
							</p>
						</div>
					</div>
					<!-- Site Description -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Description</label>
						</div>
						<!-- Input -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<textarea id="description" name="description" maxlength="255" rows="4"
								class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
								placeholder="A cozy little corner of the Internet where we discuss the intersection of technology and society."
								v-model="settings.description" />
							<div class="flex justify-between">
								<p class="mt-2 text-sm text-gray-500">Brief description about your tinyboard.</p>
								<p class="mt-2 text-xs"
									:class="settings.description?.length ?? 0 > 230 ? 'text-red-600' : 'text-gray-500'">{{
										settings.description?.length ?? 0 }} / 255</p>
							</div>
						</div>
					</div>
					<!-- Site Icon -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Icon</label>
						</div>
						<!-- Input -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex items-center">
							<img v-if="icon || settings.icon" :src="icon || settings.icon"
								class="w-20 h-20 object-cover p-0.5 border bg-white" />
							<div v-else class="w-20 h-20 rounded-md border border-gray-300 border-dashed"></div>
							<div class="ml-5">
								<label for="avatar-upload" class="inline-block button gray cursor-pointer">
									{{ icon || settings.icon ? 'Change icon' : 'Upload icon' }}
								</label>
								<input id="avatar-upload" type="file" class="hidden" accept="image/png"
									@change="onIconChange" />
								<small class="block mt-2 text-gray-400">
									PNG up to 1MB. Recommended sizes are 16*16, 32*32 and 48*48.
								</small>
							</div>
						</div>
					</div>
					<!-- Homepage Banner -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Homepage Banner</label>
						</div>
						<!-- Input -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex items-center">
							<img v-if="imageStore.homepageBanner || homepageBanner || settings.homepageBanner" :src="imageStore.homepageBanner || homepageBanner || settings.homepageBanner"
								class="w-40 h-20 object-cover p-0.5 border bg-white" />
							<div v-else class="w-40 h-20 rounded-md border border-gray-300 border-dashed"></div>
							<div class="ml-5">
								<label for="banner-upload" class="inline-block button gray cursor-pointer">
									{{ imageStore.homepageBanner || homepageBanner || settings.homepageBanner ? 'Change banner' : 'Upload banner' }}
								</label>
								<input id="banner-upload" type="file" class="hidden" accept="image/*"
									@change="onHomepageBannerChange" />
								<small class="block mt-2 text-gray-400">
									Image file up to 5MB. Displayed on the home feed page.
								</small>
							</div>
						</div>
					</div>
					<!-- Colors -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Colors</label>
						</div>
						<!-- Input -->
						<div
							class="mt-4 md:col-span-2 md:mt-0 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4">
							<div class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
								:style="{ 'border-color': primaryColor }">
								<div>
									<h3 class="text-gray-800 font-bold">Primary color</h3>
									<p class="text-sm text-gray-500">The primary color used almost everywhere.</p>
								</div>
								<LazyPopoversColorPicker :color="primaryColor"
									@color-changed="newValue => primaryColor = newValue" />
							</div>
							<div class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
								:style="{ 'border-color': secondaryColor }">
								<div>
									<h3 class="text-gray-800 font-bold">Secondary color</h3>
									<p class="text-sm text-gray-500">The secondary color, used where the primary color
										isn't.</p>
								</div>
								<LazyPopoversColorPicker :color="secondaryColor"
									@color-changed="newValue => secondaryColor = newValue" />
							</div>
							<div class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
								:style="{ 'border-color': hoverColor }">
								<div>
									<h3 class="text-gray-800 font-bold">Hover color</h3>
									<p class="text-sm text-gray-500">Color of things with the primary color when you hover
										over them.</p>
								</div>
								<LazyPopoversColorPicker :color="hoverColor"
									@color-changed="newValue => hoverColor = newValue" />
							</div>
						</div>
					</div>
					<!-- Welcome Message -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Welcome message</label>
						</div>
						<!-- Input -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<textarea id="welcome" name="welcome" maxlength="255" rows="4"
								class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
								:placeholder="`Welcome to ${settings.name}! Here are the top things to do here...`"
								v-model="settings.welcomeMessage" />
							<div class="flex justify-between">
								<p class="mt-1 flex justify-end items-center text-sm text-gray-400">
									<svg xmlns="http://www.w3.org/2000/svg" class="mr-1 w-4 h-4" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<rect x="3" y="5" width="18" height="14" rx="2"></rect>
										<path d="M7 15v-6l2 2l2 -2v6"></path>
										<path d="M14 13l2 2l2 -2m-2 2v-6"></path>
									</svg>
									Short message users receive after signing up. Markdown supported.
								</p>
								<p class="mt-2 text-xs"
									:class="settings.welcomeMessage?.length ?? 0 > 230 ? 'text-red-600' : 'text-gray-500'">{{
										settings.welcomeMessage?.length ?? 0 }} / 255</p>
							</div>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4">
					<button type="submit" class="button primary" :class="{ 'loading': isLoading }" :disabled="isLoading">
						Save
					</button>
				</div>
			</form>
		</div>
		<!-- End Main Content -->
	</NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
// import { baseURL } from "@/server/constants";
import { useToastStore } from '@/stores/StoreToast';
import { useImageStore } from '@/stores/StoreImages';
import { dataURLtoFile } from '@/utils/files';
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';
import { useGqlMultipart } from "@/composables/graphql_multipart";
import { onFileChange } from '@/composables/images';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Settings',
	'permissionRequired': "config",
	isFooterDisabled: true,
	isScrollDisabled: true,
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();
const imageStore = useImageStore();
const authCookie = useCookie("token").value;

// Fetch site settings using GraphQL with explicit query string
const { data: siteData, pending, error, refresh } = await useGraphQLQuery(`
  query GetSite {
    site {
      name
      description
      welcomeMessage
      icon
      homepageBanner
      enableDownvotes
      primaryColor
      secondaryColor
      hoverColor
      registrationMode
      enableNSFW
      applicationQuestion
      privateInstance
      requireEmailVerification
      defaultAvatar
    }
  }
`);
const data = computed(() => ({ value: siteData.value?.site }));

// Convert colors from rgb to hex
const toHexCode = rgb => {
	const values = rgb.replace(" ", "").split(",").map(x => Number(x));

	// add a 0 if the value in hex is only one digit
	return "#" + values.map(x => x >= 15 ? x.toString(16) : `0${x.toString(16)}`).join("");
};

// Convert colors from hex to rgb
const toRGB = hex => {
	const h = hex.slice(1);
	const values = [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];

	return values.map(x => parseInt(x, 16)).join();
}

// Settings.
const settings = ref({});

if (data.value?.value) {
	settings.value = { ...JSON.parse(JSON.stringify(data.value.value)) };
}

const primaryColor = ref(settings.value?.primaryColor ? toHexCode(settings.value.primaryColor) : '#3c6991');
const secondaryColor = ref(settings.value?.secondaryColor ? toHexCode(settings.value.secondaryColor) : '#60803f');
const hoverColor = ref(settings.value?.hoverColor ? toHexCode(settings.value.hoverColor) : '#4b7faf');

const icon = ref('');
const homepageBanner = ref('');

const onIconChange = e => {
	const file = e.target.files[0];

	if (file) {
		if (file.size > 1024 * 1024) {
			toast.addNotification({ header: 'Your files are too large!', message: `Max size for icons is 1MB.`, type: 'error' });
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.addEventListener('load', () => {
			icon.value = reader.result;
		});
	}
};

const onHomepageBannerChange = async (e) => {
	await onFileChange(e, 'homepage_banner');
};

// Removed old REST API upload function - now using GraphQL multipart upload

// Submit settings.
const isLoading = ref(false);

const submitSettings = async () => {
	isLoading.value = true;

	// Prepare files for upload
	const files = {};
	if (icon.value) {
		files["iconFile"] = dataURLtoFile(icon.value);
	}
	if (imageStore.homepageBanner) {
		files["homepageBannerFile"] = dataURLtoFile(imageStore.homepageBanner);
	} else if (homepageBanner.value) {
		files["homepageBannerFile"] = dataURLtoFile(homepageBanner.value);
	}

	try {
		const result = await useGqlMultipart({
			query: `
				mutation UpdateSiteConfig(
					$input: UpdateSiteConfigInput!,
					$iconFile: Upload,
					$homepageBannerFile: Upload
				) {
					updateSiteConfig(
						input: $input,
						iconFile: $iconFile,
						homepageBannerFile: $homepageBannerFile
					) {
						name
						description
						welcomeMessage
						icon
						homepageBanner
						enableDownvotes
						primaryColor
						secondaryColor
						hoverColor
						registrationMode
						enableNSFW
						applicationQuestion
						privateInstance
						requireEmailVerification
						defaultAvatar
					}
				}
			`,
			variables: {
				input: {
					name: settings.value.name,
					description: settings.value.description,
					welcomeMessage: settings.value.welcomeMessage,
					enableDownvotes: settings.value.enableDownvotes,
					primaryColor: toRGB(primaryColor.value),
					secondaryColor: toRGB(secondaryColor.value),
					hoverColor: toRGB(hoverColor.value),
					registrationMode: settings.value.registrationMode,
					enableNsfw: settings.value.enableNSFW,
					applicationQuestion: settings.value.applicationQuestion,
					privateInstance: settings.value.privateInstance,
					requireEmailVerification: settings.value.requireEmailVerification,
					defaultAvatar: settings.value.defaultAvatar
				},
				iconFile: null,
				homepageBannerFile: null
			},
			files
		});

		if (result.data?.updateSiteConfig) {
			// Update local settings with returned data
			const updatedData = result.data.updateSiteConfig;
			settings.value = { ...updatedData };

			// Update color pickers with new values
			if (updatedData.primaryColor) {
				primaryColor.value = toHexCode(updatedData.primaryColor);
			}
			if (updatedData.secondaryColor) {
				secondaryColor.value = toHexCode(updatedData.secondaryColor);
			}
			if (updatedData.hoverColor) {
				hoverColor.value = toHexCode(updatedData.hoverColor);
			}

			// Clear the icon and banner previews
			icon.value = '';
			homepageBanner.value = '';
			imageStore.purgeHomepageBanner();

			// Refresh the data from server
			await refresh();

			// Show success toast
			toast.addNotification({
				header: 'Settings saved',
				message: 'Site settings were updated!',
				type: 'success'
			});
		}
	} catch (error) {
		// Show error toast
		toast.addNotification({
			header: 'Saving failed',
			message: error.message || 'Site settings have failed to save.',
			type: 'error'
		});
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};
</script>