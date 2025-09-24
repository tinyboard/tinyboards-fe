<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Appearance</h3>
				<p class="mt-1 text-sm text-gray-600">Customize the visual appearance and theme of your site.</p>
			</div>

			<!-- Loading state -->
			<div v-if="pending" class="flex justify-center items-center p-8">
				<div class="loading-spinner">Loading appearance settings...</div>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
				<p class="text-red-800">Failed to load appearance settings: {{ error.message }}</p>
			</div>

			<!-- Form -->
			<form v-else @submit.prevent="submitSettings" class="sm:border sm:rounded-md">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Default Theme -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Default Theme</label>
						</div>
						<div class="mt-4 md:col-span-2 md:mt-0">
							<select v-model="settings.defaultTheme"
								class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base">
								<option value="default">Default</option>
								<option value="dark">Dark</option>
								<option value="light">Light</option>
							</select>
							<p class="mt-2 text-sm text-gray-500">
								The default theme for new users and guests.
							</p>
						</div>
					</div>

					<!-- Custom CSS Toggle -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Custom Styling</p>
						</div>
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="custom-css" :isEnabled="settings.allowCustomCSS"
									@enabled="settings.allowCustomCSS = !settings.allowCustomCSS" />
								<label for="custom-css" class="ml-2 font-medium text-gray-900">
									Allow custom CSS
								</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Enable custom CSS styling for advanced customization.
							</p>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4">
					<button type="submit" class="button primary" :class="{ 'loading': isLoading }" :disabled="isLoading">
						Save Appearance Settings
					</button>
				</div>
			</form>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Appearance',
	'permissionRequired': "appearance",
	isFooterDisabled: true,
	isScrollDisabled: true,
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();

// Fetch site settings using GraphQL
const { data: siteData, pending, error, refresh } = await useGraphQLQuery(`
	query GetSite {
		site {
			defaultTheme
		}
	}
`);

// Settings
const settings = ref({
	defaultTheme: 'default',
	allowCustomCSS: false
});

if (siteData.value) {
	settings.value = {
		defaultTheme: siteData.value.site.defaultTheme || 'default',
		allowCustomCSS: false // This would come from backend if supported
	};
}

// Submit settings
const isLoading = ref(false);

const submitSettings = async () => {
	isLoading.value = true;

	try {
		const { data: result } = await useGraphQLMutation(`
			mutation UpdateSiteConfig($input: UpdateSiteConfigInput!) {
				updateSiteConfig(input: $input) {
					defaultTheme
				}
			}
		`, {
			variables: {
				input: {
					defaultTheme: settings.value.defaultTheme
				}
			}
		});

		if (result.value?.updateSiteConfig) {
			toast.addNotification({
				header: 'Settings saved',
				message: 'Appearance settings were updated!',
				type: 'success'
			});
			await refresh();
		}
	} catch (error) {
		toast.addNotification({
			header: 'Saving failed',
			message: error.message || 'Appearance settings failed to save.',
			type: 'error'
		});
		console.error('Error saving appearance settings:', error);
	} finally {
		isLoading.value = false;
	}
};
</script>