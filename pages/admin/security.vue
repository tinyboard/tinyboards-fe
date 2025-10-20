<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Security</h3>
				<p class="mt-1 text-sm text-gray-600">Adjust the level of gatekeeping. For configuring what can or cannot be
					posted, go to <NuxtLink to="/admin/content">Content Settings</NuxtLink>.</p>
			</div>
			<!-- Loading state for initial data fetch -->
			<div v-if="pending" class="flex justify-center items-center p-8">
				<div class="loading-spinner">Loading security settings...</div>
			</div>

			<!-- Error state for initial data fetch -->
			<div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
				<p class="text-red-800">Failed to load security settings: {{ error.message }}</p>
			</div>

			<!-- Form -->
			<form v-else @submit.prevent="submitSettings" class="sm:border sm:rounded-md overflow-y-auto">
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
										value="OpenMode" v-model="settings.registrationMode">
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
										value="RequireApplication" v-model="settings.registrationMode">
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
										value="InviteMode" v-model="settings.registrationMode">
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
					<!--<div v-if="settings.registration_mode === 'InviteMode'" class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
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
								<InputsSwitch id="nsfw" :isEnabled="settings.requireEmailVerification"
									@enabled="settings.requireEmailVerification = !settings.requireEmailVerification" />
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
								<InputsSwitch id="nsfw" :isEnabled="settings.privateInstance"
									@enabled="settings.privateInstance = !settings.privateInstance" />
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
					<button type="submit" class="button primary" :class="{ 'loading': isLoading }" :disabled="isLoading || pending">
						Save
					</button>
				</div>
			</form>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Settings',
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "config",
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();

// Fetch site settings using GraphQL with explicit query string
const { data: siteData, pending, error, refresh } = await useGraphQLQuery(`
    query GetSite {
        site {
            name
            description
            icon
            primaryColor
            secondaryColor
            hoverColor
            registrationMode
            requireEmailVerification
            privateInstance
            openRegistration
            enableDownvotes
            enableNSFW
            boardCreationAdminOnly
            defaultTheme
            defaultPostListingType
            defaultAvatar
            legalInformation
            hideModlogModNames
            applicationEmailAdmins
            captchaEnabled
            captchaDifficulty
            reportsEmailAdmins
            welcomeMessage
            boardsEnabled
            boardCreationMode
            trustedUserMinReputation
            trustedUserMinAccountAgeDays
            trustedUserManualApproval
            trustedUserMinPosts
            allowedPostTypes
            enableNSFWTagging
            wordFilterEnabled
            filteredWords
            wordFilterAppliesToPosts
            wordFilterAppliesToComments
            wordFilterAppliesToUsernames
            linkFilterEnabled
            bannedDomains
            approvedImageHosts
            imageEmbedHostsOnly
            applicationQuestion
        }
    }
`);
const data = computed(() => ({ value: siteData.value?.site }));

// Settings.
const settings = ref({});

if (data.value.value) {
	const siteData = { ...JSON.parse(JSON.stringify(data.value.value)) };

	// Map GraphQL fields to form fields and add computed properties
	settings.value = {
		...siteData,
		// Add a computed disable_registrations field based on openRegistration
		disable_registrations: !siteData.openRegistration && siteData.registrationMode !== 'RequireApplication' && siteData.registrationMode !== 'InviteMode'
	};
};

// Submit settings.
const isLoading = ref(false);

const submitSettings = async () => {
	isLoading.value = true;

	try {
		// Map the field names to GraphQL field names
		const input = {
			// Security-related settings
			registrationMode: settings.value.registrationMode,
			requireEmailVerification: settings.value.requireEmailVerification,
			privateInstance: settings.value.privateInstance,

			// Handle disable registrations by setting appropriate registration mode
			openRegistration: !settings.value.disable_registrations && settings.value.registrationMode === 'OpenMode',
			inviteOnly: settings.value.registrationMode === 'InviteMode',
			requireApplication: settings.value.registrationMode === 'RequireApplication',
			applicationQuestion: settings.value.applicationQuestion
		};

		const { data: result } = await useGraphQLMutation(`
			mutation UpdateSiteConfig($input: UpdateSiteConfigInput!) {
				updateSiteConfig(input: $input) {
					name
					description
					registrationMode
					requireEmailVerification
					privateInstance
				}
			}
		`, {
			variables: { input }
		});

		if (result.value?.updateSiteConfig) {
			// Show success toast.
			toast.addNotification({
				header: 'Settings saved',
				message: 'Site security settings were updated!',
				type: 'success'
			});
			// Refresh the data to show updated values
			await refresh();
		} else {
			throw new Error('Update failed');
		}
	} catch (error) {
		// Show error toast with more specific error message
		let errorMessage = 'Site security settings have failed to save.';

		if (error?.graphqlErrors && error.graphqlErrors.length > 0) {
			errorMessage = error.graphqlErrors[0].message;
		} else if (error?.message) {
			errorMessage = error.message;
		}

		toast.addNotification({
			header: 'Saving failed',
			message: errorMessage,
			type: 'error'
		});
		// Log the error for debugging
		console.error('Error saving security settings:', error);
	} finally {
		isLoading.value = false;
	}
};
</script>