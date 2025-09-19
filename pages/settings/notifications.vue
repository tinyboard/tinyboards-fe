<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
				<p class="mt-1 text-sm text-gray-600">Manage how you receive notifications and what content you see.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Email Notifications -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Email notifications</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch :isEnabled="settings.emailNotificationsEnabled" @enabled="settings.emailNotificationsEnabled = !settings.emailNotificationsEnabled"/>
								<label class="ml-2 font-medium text-gray-900">Send email notifications</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Receive email notifications for important activity like replies and mentions.
							</p>
						</div>
					</div>
					<!-- Show Bot Content -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Bot content</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch :isEnabled="settings.showBots" @enabled="settings.showBots = !settings.showBots"/>
								<label class="ml-2 font-medium text-gray-900">Show bot accounts</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Show content and notifications from automated bot accounts.
							</p>
						</div>
					</div>
					<!-- Show NSFW Content -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">NSFW content</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch :isEnabled="settings.showNsfw" @enabled="settings.showNsfw = !settings.showNsfw"/>
								<label class="ml-2 font-medium text-gray-900">Show NSFW content</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Show adult content marked as "not safe for work" in feeds and notifications.
							</p>
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

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Notifications',
	'isLeftNavbarDisabled': true
});

const toast = useToastStore();
const authCookie = useCookie("token").value;

// Fetch user data to get current notification settings
const { data: userData, pending, error } = await useAsyncGql({
  operation: 'getMe'
});

// Initialize settings with default values
let settings = ref({
	emailNotificationsEnabled: false,
	showBots: true,
	showNsfw: false
});

// Since getMe doesn't include notification settings, we'll use defaults
// In a real implementation, you'd want to have a separate query for notification settings
// or include them in the user data
if (userData.value) {
	// For now, we'll use reasonable defaults
	// These would ideally come from the backend user settings
	settings.value = {
		emailNotificationsEnabled: userData.value.emailNotificationsEnabled ?? false,
		showBots: userData.value.showBots ?? true,
		showNsfw: userData.value.showNsfw ?? false
	};
}

const isLoading = ref(false);

// Submit notification settings
const { mutate: updateNotificationSettings } = useMutation('updateNotificationSettings');

const submitSettings = async () => {
	isLoading.value = true;

	try {
		const result = await updateNotificationSettings({
			emailNotificationsEnabled: settings.value.emailNotificationsEnabled,
			showBots: settings.value.showBots,
			showNsfw: settings.value.showNsfw
		});

		if (result.data?.updateNotificationSettings) {
			// Show success toast.
			toast.addNotification({
				header: 'Settings saved',
				message: 'Your notification settings were updated!',
				type: 'success'
			});
		} else {
			throw new Error('Failed to update notification settings');
		}
	} catch (error) {
		// Show error toast.
		toast.addNotification({
			header: 'Saving failed',
			message: error.message || 'Your notification settings failed to save.',
			type: 'error'
		});
		// Log the error.
		console.error('Error updating notification settings:', error);
	} finally {
		isLoading.value = false;
	}
};
</script>