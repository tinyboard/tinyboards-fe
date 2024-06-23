<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Security</h3>
				<p class="mt-1 text-sm text-gray-600">Adjust the level of gatekeeping. For configuring what can or cannot be
					posted, go to <NuxtLink to="/admin/content">Content Settings</NuxtLink>.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()" class="sm:border sm:rounded-md overflow-y-auto">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Registration -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Registration</label>
						</div>
						<!-- Radio Group -->
						<ul class="mt-4 md:col-span-2 md:mt-0 flex flex-col space-y-4">
							<li class="flex">
								<div class="flex items-center h-5">
									<input id="open-radio" aria-describedby="open-radio-text" type="radio"
										name="invite-mode"
										class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:ring-secondary dark:focus:ring-secondary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										value="OpenMode" v-model="settings.site_mode">
								</div>
								<div class="ml-2 text-sm">
									<label for="open-radio"
										class="font-medium text-gray-900 dark:text-gray-300">Open</label>
									<p id="open-radio-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">
										Anyone with Internet access can join your tinyboard.
									</p>
								</div>
							</li>
							<li class="flex">
								<div class="flex items-center h-5">
									<input id="app-radio" aria-describedby="app-radio-text" type="radio" name="invite-mode"
										class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:ring-secondary dark:focus:ring-secondary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										value="ApplicationMode" v-model="settings.site_mode">
								</div>
								<div class="ml-2 text-sm">
									<label for="app-radio"
										class="font-medium text-gray-900 dark:text-gray-300">Application-only</label>
									<p id="app-radio-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">
										Accounts must be manually approved by mods before they can engage the community.
									</p>
								</div>
							</li>
							<li class="flex">
								<div class="flex items-center h-5">
									<input id="invite-radio" aria-describedby="invite-radio-text" type="radio"
										name="invite-mode"
										class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:ring-secondary dark:focus:ring-secondary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										value="InviteMode" v-model="settings.site_mode">
								</div>
								<div class="ml-2 text-sm">
									<label for="invite-radio"
										class="font-medium text-gray-900 dark:text-gray-300">Invite-only</label>
									<p id="invite-radio-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">
										A one-time invite link is required to register.
									</p>
								</div>
							</li>
						</ul>
					</div>
					<!-- Invite settings -->
					<!--<div v-if="settings.site_mode === 'InviteMode'" class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Who may create invite links?</label>
						</div>
						<ul class="mt-4 md:col-span-2 md:mt-0 flex flex-col space-y-4">
							<li class="flex">
							    <div class="flex items-center h-5">
							        <input id="open-radio" aria-describedby="open-radio-text" type="radio" name="invite-settings" class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:ring-secondary dark:focus:ring-secondary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" value="OpenInvites" v-model="settings.invites">
							    </div>
							    <div class="ml-2 text-sm">
							        <label for="open-invites-radio" class="font-medium text-gray-900 dark:text-gray-300">Everyone</label>
							        <p id="open-radio-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">
								        Anyone who is not banned can invite others.
								    </p>
							    </div>
							</li>
							<li class="flex">
							    <div class="flex items-center h-5">
							        <input id="invite-radio" aria-describedby="invite-radio-text" type="radio" name="invite-settings" class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:ring-secondary dark:focus:ring-secondary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" value="RestrictInvites" v-model="settings.invites">
							    </div>
							    <div class="ml-2 text-sm">
							        <label for="closed-invites-radio" class="font-medium text-gray-900 dark:text-gray-300">Only admins</label>
							        <p id="invite-radio-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">
								        Only site admins can create invites.
								    </p>
							    </div>
							</li>
						</ul>
					</div>-->
					<!-- Email Verificaiton -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Verification</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="nsfw" :isEnabled="settings.email_verification_required"
									@enabled="settings.email_verification_required = !settings.email_verification_required" />
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Require email
									verification</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Require members to have a verified email address before engaging the community.
							</p>
						</div>
					</div>
					<!-- Private Mode -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Private mode</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="nsfw" :isEnabled="settings.private_instance"
									@enabled="settings.private_instance = !settings.private_instance" />
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Enable private
									mode</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Require having an account to read your site.
							</p>
						</div>
					</div>
					<!-- Disable registrations -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-red-700">Danger Zone</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="flex items-center text-sm">
								<InputsSwitch id="no-registrations" :isEnabled="settings.disable_registrations"
									@enabled="settings.disable_registrations = !settings.disable_registrations" />
								<label for="no-registrations"
									class="ml-2 font-medium text-gray-900 dark:text-gray-300">Disable new account
									registration</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								When enabled, registrations are closed to EVERYONE.
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
import { useToastStore } from '@/stores/StoreToast';
import { useApi } from "@/composables/api";

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Settings',
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "config",
    'isLeftNavbarDisabled': true
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
			"email_verification_required": settings.value.email_verification_required,
			"icon": settings.value.icon,
			"primary_color": settings.value.primary_color,
			"secondary_color": settings.value.secondary_color,
			"hover_color": settings.value.hover_color
		}
	})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({ header: 'Settings saved', message: 'Site settings were updated!', type: 'success' });
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