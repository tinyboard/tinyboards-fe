<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Content</h3>
				<p class="mt-1 text-sm text-gray-600">Manage what content is presented to you.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Placeholder for future content settings -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Content preferences</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<p class="text-sm text-gray-500">
								Content-related settings have been moved to the
								<NuxtLink to="/settings/notifications" class="text-primary hover:underline">Notifications</NuxtLink> page.
							</p>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4">
					<button type="submit" class="button primary" :class="{ 'loading':isLoading }" :disabled="isLoading">
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
	import { useToastStore } from '@/stores/StoreToast';
	import { useGraphQLQuery } from '@/composables/useGraphQL';

	definePageMeta({
		'hasAuthRequired': true,
		'title': 'Content',
		'isLeftNavbarDisabled': true
	});

	const toast = useToastStore();
	const authCookie = useCookie("token").value;

	// Fetch user settings using GraphQL
	const getSettingsQuery = `
		query getSettings {
			me {
				bio
				displayName
				avatar
				banner
				profileBackground
			}
		}
	`;

	const { data, pending, error, refresh } = await useGraphQLQuery(getSettingsQuery);

	// Settings.
	let settings = ref({});

	if (data.value?.me) {
		settings.value = { ...JSON.parse(JSON.stringify(data.value.me)) };
	}

	const isLoading = ref(false);

	// Submit settings.
	const submitSettings = async () => {
		isLoading.value = true;

		try {
			// Since content settings have been moved to notifications page,
			// this just shows a success message for now
			toast.addNotification({
				header: 'Settings saved',
				message: 'Your content settings have been processed.',
				type: 'success'
			});
		} catch (error) {
			// Show error toast.
			toast.addNotification({
				header: 'Saving failed',
				message: 'Your settings have failed to save.',
				type: 'error'
			});
			// Log the error.
			console.error(error);
		} finally {
			isLoading.value = false;
		}
	};
</script>