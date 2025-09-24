<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Account</h3>
				<p class="mt-1 text-sm text-gray-600">These preferences are visible only to you.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Email Address -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Email address</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="email" name="email-address" id="email-address" class="mt-1 form-input gray"
								placeholder="no-email@losers.network" v-model="settings.email" />
							<p class="mt-2 text-sm text-gray-500">
								Used for account recovery purposes only.
							</p>
						</div>
					</div>
					<!-- Password -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Password</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex flex-col space-y-4">
							<!-- Current Password -->
							<div>
								<label for="password" class="block text-sm font-bold">Current password</label>
								<input :required="hasPassword" type="password" name="password" id="password"
									class="mt-1 form-input gray" v-model="password" />
							</div>
							<!-- New Password -->
							<div>
								<label for="new-password" class="block text-sm font-bold">New password</label>
								<input :required="hasPassword" type="password" name="new-password" id="new-password"
									class="mt-1 form-input gray" placeholder="Enter a new password" v-model="newPassword" />
								<small class="inline-block mt-2 text-gray-500">
									Must be at least 8 characters.
								</small>
							</div>
							<!-- Confirm New Password -->
							<div>
								<label for="confirm-password" class="block text-sm font-bold">Confirm new password</label>
								<input :required="hasPassword" type="password" name="confirm-password" id="confirm-password"
									class="mt-1 form-input gray" placeholder="Retype your new password" minlength="8"
									v-model="confirmPassword" />
							</div>
						</div>
					</div>
					<!-- Account Deactivation -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-red-800">Danger Zone</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div class="border border-red-200 rounded-lg p-4 bg-red-50">
								<h4 class="text-lg font-semibold text-red-800 mb-2">Delete Account</h4>
								<p class="text-sm text-red-700 mb-4">
									Once you delete your account, there is no going back. Please be certain.
								</p>
								<div class="flex flex-col space-y-3">
									<div>
										<label for="delete-password" class="block text-sm font-bold text-red-800">
											Enter your password to confirm deletion
										</label>
										<input
											type="password"
											id="delete-password"
											name="delete-password"
											class="mt-1 form-input gray border-red-300 focus:border-red-500 focus:ring-red-500"
											placeholder="Enter your password"
											v-model="deletePassword"
										/>
									</div>
									<button
										@click="deleteAccount"
										type="button"
										class="button red w-fit"
										:class="{ 'loading': isDeletingAccount }"
										:disabled="isDeletingAccount || !deletePassword?.trim()">
										{{ isDeletingAccount ? 'Deleting Account...' : 'Delete My Account' }}
									</button>
								</div>
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
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Account',
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
			email
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

const password = ref(null);
const newPassword = ref(null);
const confirmPassword = ref(null);
const deletePassword = ref(null);
const isDeletingAccount = ref(false);

const hasPassword = computed(() => {
	return !!password.value || !!newPassword.value || !!confirmPassword.value;
})

// GraphQL mutations
const updateSettingsMutation = `
	mutation updateUserSettings(
		$name: String,
		$displayName: String,
		$bio: String,
		$showNsfw: Boolean,
		$defaultSortType: Int,
		$defaultListingType: Int,
		$avatar: Upload,
		$banner: Upload,
		$profileBackground: Upload,
		$email: String
	) {
		updateSettings(
			name: $name,
			displayName: $displayName,
			bio: $bio,
			showNsfw: $showNsfw,
			defaultSortType: $defaultSortType,
			defaultListingType: $defaultListingType,
			avatar: $avatar,
			banner: $banner,
			profileBackground: $profileBackground,
			email: $email
		) {
			id
			name
			displayName
			bio
			bioHTML
			avatar
			banner
			profileBackground
			updated
		}
	}
`;

const updatePasswordMutation = `
	mutation updatePassword(
		$oldPassword: String!,
		$newPassword: String!
	) {
		updatePassword(
			oldPassword: $oldPassword,
			newPassword: $newPassword
		) {
			success
		}
	}
`;

const deleteAccountMutation = `
	mutation deleteAccount($password: String!) {
		deleteAccount(password: $password) {
			success
			message
		}
	}
`;

const submitSettings = async () => {
	isLoading.value = true;
	
	try {
		// Update user settings first
		const { data: settingsData } = await useGraphQLMutation(updateSettingsMutation, {
			variables: {
				email: settings.value.email,
				displayName: settings.value.displayName,
				bio: settings.value.bio
			}
		});

		if (settingsData.value?.updateSettings) {
			// Update password if provided
			if (hasPassword.value) {
				if (newPassword.value !== confirmPassword.value) {
					throw new Error('New passwords do not match');
				}
				
				if (newPassword.value.length < 8) {
					throw new Error('Password must be at least 8 characters long');
				}
				
				const { data: passwordData } = await useGraphQLMutation(updatePasswordMutation, {
					variables: {
						oldPassword: password.value,
						newPassword: newPassword.value
					}
				});

				if (passwordData.value?.updatePassword?.success) {
					// Clear password fields
					password.value = null;
					newPassword.value = null;
					confirmPassword.value = null;
					
					toast.addNotification({ 
						header: 'Settings saved', 
						message: 'Your account settings and password were updated!', 
						type: 'success' 
					});
				}
			} else {
				toast.addNotification({ 
					header: 'Settings saved', 
					message: 'Your account settings were updated!', 
					type: 'success' 
				});
			}
		}
	} catch (error) {
		// Show error toast.
		toast.addNotification({ 
			header: 'Saving failed', 
			message: error.message || 'Your settings have failed to save.', 
			type: 'error' 
		});
		// Log the error.
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};

// Delete account function
const deleteAccount = async () => {
	if (!deletePassword.value?.trim()) {
		toast.addNotification({
			header: 'Password required',
			message: 'Please enter your password to confirm account deletion.',
			type: 'error'
		});
		return;
	}

	// Show confirmation dialog
	if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
		return;
	}

	isDeletingAccount.value = true;

	try {
		const { data: deleteData } = await useGraphQLMutation(deleteAccountMutation, {
			variables: {
				password: deletePassword.value
			}
		});

		if (deleteData.value?.deleteAccount?.success) {
			toast.addNotification({
				header: 'Account deleted',
				message: deleteData.value.deleteAccount.message || 'Your account has been successfully deleted.',
				type: 'success'
			});

			// Clear authentication and redirect to home
			const authCookie = useCookie("token");
			authCookie.value = null;

			// Redirect to home page after a short delay
			setTimeout(() => {
				navigateTo('/');
			}, 2000);
		} else {
			throw new Error(deleteData.value?.deleteAccount?.message || 'Failed to delete account');
		}
	} catch (error) {
		console.error('Error deleting account:', error);
		toast.addNotification({
			header: 'Deletion failed',
			message: error.message || 'Failed to delete your account. Please try again.',
			type: 'error'
		});
	} finally {
		isDeletingAccount.value = false;
	}
};
</script>