<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Site</h3>
				<p class="mt-1 text-sm text-gray-600">Manage global settings here. Be sure you know what you are doing.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Site Name -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Site name</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="text" name="site-name" id="site-name" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="tinyboard" />
							<p class="mt-2 text-sm text-gray-500">
								The name of your tinyboard. Visible wherever <span class="pre">site.name</span> is present.
							</p>
						</div>
					</div>
					<!-- Registration -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<p class="text-base font-bold leading-6 text-gray-900">Registration</p>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<div>
								<div class="flex items-center">
									<InputsSwitch :isEnabled="settings.isRegistrationEnabled" @enabled="settings.isRegistrationEnabled = !settings.isRegistrationEnabled"/>
									<label class="ml-2 font-medium text-gray-900">Allow registration</label>
								</div>
								<p class="mt-2 text-sm text-gray-500">
									Allow new accounts to be created.
								</p>
							</div>
							<div class="mt-4" :class="{'opacity-50':!settings.isRegistrationEnabled}">
								<div class="flex items-center">
									<InputsSwitch :isDisabled="!settings.isRegistrationEnabled" :isEnabled="settings.isInviteRequired" @enabled="settings.isInviteRequired = !settings.isInviteRequired"/>
									<label class="ml-2 font-medium text-gray-900">Require invite to join</label>
								</div>
								<p class="mt-2 text-sm text-gray-500">
									Require an invitation to create an account.
								</p>
							</div>
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
	import { baseURL } from "@/server/constants";
	import { useToastStore } from '@/stores/StoreToast';

	definePageMeta({
		'hasAuthRequired': true,
		'title': 'Settings'
	});

	const toast = useToastStore();
	const authCookie = useCookie("token").value;

	// File inputs.
	const onFileChange = (e,type) => {
		console.log(type)
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			if (type === 'avatar') {
				settings.value.avatar = reader.result;
			} else {
				settings.value.banner = reader.result;
			}
		};
		reader.readAsDataURL(file);
	};

	// Fetch site settings.
	const { data, pending, error, refresh } = await useFetch("/admin", {
		baseURL,
		method: "get",
		headers: {
			Authorization: authCookie ? `Bearer ${authCookie}` : '',
		}
	});

	// Settings.
	let settings = ref({});

	if (data.value) {
		settings.value = { ...JSON.parse(JSON.stringify(data.value.settings.settings)) };
	};

	// Submit settings.
	const isLoading = ref(false);

	const isRegistrationEnabled = ref(false);
	const isInviteRequired = ref(false);

	const submitSettings = () => {
		isLoading.value = true;
		useFetch('/admin', {
			baseURL,
			method: "put",
			body: {
				"bio": settings.value.bio
			},
			headers: {
				Authorization: authCookie ? `Bearer ${authCookie}` : '',
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