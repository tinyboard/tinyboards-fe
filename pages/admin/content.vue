<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Content Settings</h3>
				<p class="mt-1 text-sm text-gray-600">Configure what can be posted and how.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()" class="sm:border sm:rounded-md overflow-y-auto">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- NSFW -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">NSFW</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="nsfw" :isEnabled="settings.enableNSFW" @enabled="settings.enableNSFW = !settings.enableNSFW" />
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Allow NSFW
									content</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Allow adult content marked "not safe for work" to be posted.
							</p>
						</div>
					</div>
					<!-- Default Avatar -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Default Avatar</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex items-center">
							<img v-if="imageStore.default_avatar || settings.defaultAvatar" :src="imageStore.default_avatar ?? settings.defaultAvatar" class="w-20 h-20 object-cover p-0.5 border bg-white rounded" />
							<div v-else class="w-20 h-20 rounded border border-gray-300 border-dashed flex items-center justify-center bg-blue-50">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-10 h-10 text-blue-400">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
							</div>
							<div class="ml-5">
								<label for="avatar-upload" class="inline-block button gray cursor-pointer">
									{{ settings.defaultAvatar ? 'Change default avatar' : 'Upload default avatar' }}
								</label>
								<input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="e => onFileChange(e, 'default_avatar')" />
								<small class="block mt-2 text-gray-400">
									PNG, JPG and GIF up to 1MB. This will be the default
									avatar for users without a custom avatar.
								</small>
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
	</NuxtLayout>
</template>
<script setup>
import { ref } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useImageStore } from '@/stores/StoreImages';
import { dataURLtoFile } from '@/utils/files';
import { onFileChange } from '@/composables/images';
import { useGraphQLQuery } from '~/composables/useGraphQL';
import { useGqlMultipart } from '@/composables/graphql_multipart';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Settings',
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "content",
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();
const imageStore = useImageStore();

// Fetch site settings using GraphQL with explicit query string.
const { data, pending, error, refresh } = await useGraphQLQuery(`
    query GetSite {
        site {
            enableNSFW
            enableDownvotes
            privateInstance
            requireEmailVerification
            applicationQuestion
            defaultAvatar
        }
    }
`);

// Settings
const settings = ref({});

if (data.value?.site) {
	settings.value = { ...JSON.parse(JSON.stringify(data.value.site)) };
};

// Submit settings.
const isLoading = ref(false);

const submitSettings = async () => {
	isLoading.value = true;

	try {
		const variables = {
			input: {
				enableNsfw: settings.value.enableNSFW,
				enableDownvotes: settings.value.enableDownvotes,
				privateInstance: settings.value.privateInstance,
				requireEmailVerification: settings.value.requireEmailVerification,
				applicationQuestion: settings.value.applicationQuestion,
				defaultAvatar: settings.value.defaultAvatar
			},
			defaultAvatarFile: null
		};

		const files = {};

		// Handle default avatar upload
		if (imageStore.default_avatar) {
			const default_avatar = dataURLtoFile(imageStore.default_avatar);
			imageStore.purgeDefaultAvatar();
			files.defaultAvatarFile = default_avatar;
		}

		const mutation = `
			mutation UpdateSiteConfig($input: UpdateSiteConfigInput!, $defaultAvatarFile: Upload) {
				updateSiteConfig(input: $input, defaultAvatarFile: $defaultAvatarFile) {
					enableNSFW
					enableDownvotes
					privateInstance
					requireEmailVerification
					applicationQuestion
					defaultAvatar
				}
			}
		`;

		const result = await useGqlMultipart({
			query: mutation,
			variables,
			files
		});

		if (result.data?.updateSiteConfig) {
			toast.addNotification({ header: 'Settings saved', message: 'Site settings were updated!', type: 'success' });
			window.location.reload(true);
		} else {
			throw new Error('Update failed');
		}
	} catch (error) {
		toast.addNotification({ header: 'Saving failed', message: error.message || 'Site settings have failed to save.', type: 'error' });
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};
</script>