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
					<!-- Federation -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Federation</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="nsfw" :isEnabled="settings.enable_federation" @enabled="settings.enable_federation = !settings.enable_federation"/>
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Enable federation</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Opt the site into the Fediverse.
							</p>
						</div>
					</div>
					<!-- Boards -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Boards</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="nsfw" :isEnabled="settings.enable_boards" @enabled="settings.enable_boards = !settings.enable_boards"/>
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Enable boards</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Boards are user-created communities on your site where content is posted and moderated by your users. The default board will always belong to the admins.
							</p>
						</div>
					</div>
					<!-- NSFW -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">NSFW</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="nsfw" :isEnabled="settings.enable_nsfw" @enabled="settings.enable_nsfw = !settings.enable_nsfw"/>
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Allow NSFW content</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Allow adult content marked "not safe for work" to be posted.
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
	import { useApi } from "@/composables/api";
	import { useToastStore } from '@/stores/StoreToast';

	definePageMeta({
		'hasAuthRequired': true,
		'title': 'Settings',
		isFooterDisabled: true,
		isScrollDisabled: true
	});

	const toast = useToastStore();
	const authCookie = useCookie("token").value;

	// Fetch site settings.
	const { data, pending, error, refresh } = await useApi("/admin/site_settings");

	// Settings.
	const settings = ref({});

	if (data.value) {
		settings.value = { ...JSON.parse(JSON.stringify(data.value)) };
	};

	// Submit settings.
	const isLoading = ref(false);

	const submitSettings = () => {
		isLoading.value = true;
		useApi('/admin/site_settings', {
			method: "put",
			body: {
			  "name": settings.value.name,
			  "description": settings.value.description,
			  "enable_downvotes": settings.value.enable_downvotes,
			  "site_mode": settings.value.site_mode,
			  "enable_nsfw": settings.value.enable_nsfw,
			  "application_question": settings.value.application_question,
			  "private_instance": settings.value.private_instance,
			  "email_verification_required": settings.value.email_verification_required
			}
		})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({header:'Settings saved',message:'Site settings were updated!',type:'success'});
			} else {
				// Show error toast.
				toast.addNotification({header:'Saving failed',message:'Site settings have failed to save.',type:'error'});
				// Log the error.
				console.error(error.value);
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
	};
</script>