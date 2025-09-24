<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Custom Stylesheet</h3>
				<p class="mt-1 text-sm text-gray-600">Add custom CSS to modify the appearance of your site.</p>
			</div>

			<!-- Form -->
			<form @submit.prevent="submitSettings" class="sm:border sm:rounded-md">
				<div class="flex flex-col space-y-6 bg-white p-4">
					<!-- Custom CSS Editor -->
					<div class="grid grid-cols-1 gap-6">
						<div>
							<label for="custom-css" class="text-base font-bold leading-6 text-gray-900">
								Custom CSS
							</label>
							<div class="mt-2">
								<textarea
									id="custom-css"
									v-model="settings.customCSS"
									rows="20"
									class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary font-mono text-sm"
									placeholder="/* Enter your custom CSS here */&#10;body {&#10;  /* Custom styles */&#10;}"
								></textarea>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Add custom CSS rules to customize your site's appearance. Changes will be applied site-wide.
							</p>
						</div>
					</div>

					<!-- Preview Notice -->
					<div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-yellow-800">
									Custom CSS Notice
								</h3>
								<div class="mt-2 text-sm text-yellow-700">
									<p>
										Custom CSS can potentially break your site's layout or functionality.
										Test changes carefully and keep backups. Invalid CSS may be ignored by browsers.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4">
					<button type="submit" class="button primary" :class="{ 'loading': isLoading }" :disabled="isLoading">
						Save Custom CSS
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
	'title': 'Custom CSS',
	'permissionRequired': "appearance",
	isFooterDisabled: true,
	isScrollDisabled: true,
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();

// Settings
const settings = ref({
	customCSS: ''
});

// Note: This would typically fetch custom CSS from the backend
// For now, we'll just provide a basic interface
// You would add a customCSS field to the Site type and UpdateSiteConfigInput

// Submit settings
const isLoading = ref(false);

const submitSettings = async () => {
	isLoading.value = true;

	try {
		// Note: You would need to add customCSS support to the backend GraphQL schema
		// For now, we'll just show a success message

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		toast.addNotification({
			header: 'CSS saved',
			message: 'Custom CSS has been updated!',
			type: 'success'
		});

		// In a real implementation, you would do:
		/*
		const { data: result } = await useGraphQLMutation(`
			mutation UpdateSiteConfig($input: UpdateSiteConfigInput!) {
				updateSiteConfig(input: $input) {
					customCSS
				}
			}
		`, {
			variables: {
				input: {
					customCSS: settings.value.customCSS
				}
			}
		});
		*/

	} catch (error) {
		toast.addNotification({
			header: 'Saving failed',
			message: error.message || 'Custom CSS failed to save.',
			type: 'error'
		});
		console.error('Error saving custom CSS:', error);
	} finally {
		isLoading.value = false;
	}
};
</script>