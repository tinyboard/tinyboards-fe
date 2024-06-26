<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Board Settings</h3>
				<p class="mt-1 text-sm text-gray-600">This is where you can find all the settings related to boards.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()" class="sm:border sm:rounded-md overflow-y-auto">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Boards -->
					<div id="boards" class="md:grid md:grid-cols-3 md:gap-6 target:bg-blue-300 target:bg-opacity-20">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Enable Boards</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="boards" :isEnabled="settings.boards_enabled" @enabled="settings.boards_enabled = !settings.boards_enabled" />
								<label for="boards" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Enable
									boards</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Boards are user-created communities on your site where content is moderated by your users.
								The default board will always belong to the admins.
							</p>
						</div>
					</div>
					<!-- Admin only -->
					<div v-if="settings.boards_enabled" class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Restrict Board Creation</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="admin-only" :isEnabled="settings.board_creation_admin_only" @enabled="settings.board_creation_admin_only = !settings.board_creation_admin_only" />
								<label for="admin-only" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Restrict creation to admins</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								If enabled, only admins with the "Manage Boards" permission can create new boards.
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
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Settings',
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "boards",
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();

// Fetch site settings.
const { data, pending, error, refresh } = await useApi("/admin/site");

// Settings.
const settings = ref({});

if (data.value) {
	settings.value = { ...JSON.parse(JSON.stringify(data.value)) };
};

// Submit settings.
const isLoading = ref(false);

const submitSettings = async () => {
	isLoading.value = true;

	useApi('/admin/site', {
			method: "put",
			body: {
				//"name": settings.value.name,
				//"description": settings.value.description,
				"boards_enabled": settings.value.boards_enabled,
				"board_creation_admin_only": settings.value.board_creation_admin_only
			}
		})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({ header: 'Settings saved', message: 'Site settings were updated!', type: 'success' });

				window.location.reload(true);
			} else {
				// Show error toast.
				toast.addNotification({ header: 'Saving failed', message: 'Site settings have failed to save.', type: 'error' });
				// Log the error.
				console.error(error.value);
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
};
</script>