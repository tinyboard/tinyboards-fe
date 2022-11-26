<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="px-4 py-5 sm:p-6 border-b">
				<h2 class="text-lg font-medium leading-6 text-gray-900">Profile</h2>
				<p class="mt-1 text-sm text-gray-600">This information will be displayed on the World Wide Web just so you know.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white px-4 py-5 sm:p-6">
					<!-- Photo -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Avatar</label>
						</div>
						<!-- Inputs -->
						<div class="mt-5 md:col-span-2 md:mt-0">
							<div class="mt-1 flex items-center">
								<img v-if="settings.avatar" :src="settings.avatar" class="w-20 h-20 object-cover p-0.5 border bg-white"/>
								<div v-else class="w-20 h-20 rounded-sm border border-gray-300 border-dashed"></div>
								<div class="ml-5">
									<label for="avatar-upload" class="inline-block button white cursor-pointer">
										Change
									</label>
									<input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="onFileChange"/>
									<small class="block mt-2 text-gray-400">
										Max file size allowed is 1mb. Supports PNG, JPG and GIF.
									</small>
								</div>
							</div>
						</div>
					</div>
					<!-- Banner -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Banner</label>
						</div>
						<!-- Inputs -->
						<div class="mt-5 md:col-span-2 md:mt-0">
							<div class="mt-1 flex justify-center rounded-md border border-dashed border-gray-300 px-6 pt-5 pb-6">
								<div class="space-y-1 text-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-gray-400" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path d="M15 8h.01"></path>
										<path d="M12 20h-5a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5"></path>
										<path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4"></path>
										<path d="M14 14l1 -1c.617 -.593 1.328 -.793 2.009 -.598"></path>
										<path d="M16 19h6"></path>
										<path d="M19 16v6"></path>
									</svg>
									<div class="flex text-sm text-gray-600">
										<label for="banner-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
											<span>Upload a file</span>
											<input id="banner-upload" name="banner-upload" type="file" class="sr-only" />
										</label>
										<p class="pl-1">or drag and drop</p>
									</div>
									<p class="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
								</div>
							</div>
						</div>
					</div>
					<!-- Display Name -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Display name</label>
						</div>
						<!-- Inputs -->
						<div class="mt-5 md:col-span-2 md:mt-0">
							<input type="text" name="company-website" id="display-name" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="elon" />
							<p class="mt-2 text-sm text-gray-500">
								The name next to your posts and comments. Your profile URL will always be /elon.
							</p>
						</div>
					</div>
					<!-- Biography -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Biography</label>
						</div>
						<!-- Inputs -->
						<div class="mt-5 md:col-span-2 md:mt-0">
							<div class="mt-1">
								<textarea id="biography" name="biography" rows="4" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="A stranger surfing this World Wide Web." v-model="settings.bio"/>
							</div>
							<p class="mt-2 text-sm text-gray-500">Brief description about yourself. Markdown supported.</p>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4 sm:px-6">
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

	const toast = useToastStore();
	const authCookie = useCookie("token").value;

	// File inputs.
	const url = ref('https://i.imgur.com/nzY5zAg.jpg');

	const onFileChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			settings.value.avatar = reader.result;
		};
		reader.readAsDataURL(file);
	};

	// Fetch user settings.
	const { data, pending, error, refresh } = await useFetch("/settings", {
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
	}

	const isLoading = ref(false);

	// Submit settings.
	const submitSettings = () => {
		isLoading.value = true;
		useFetch('/settings', {
			baseURL,
			method: "put",
			body: {
				// "avatar": "settings.avatar",
				// "banner": "settings.banner",
				"bio": settings.value.bio
			},
			headers: {
				Authorization: authCookie ? `Bearer ${authCookie}` : '',
			}
		})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({header:'Settings saved',message:'Your profile settings were updated!',type:'success'});
			} else {
				// Show error toast.
				toast.addNotification({header:'Saving failed',message:'Your settings have failed to save.',type:'error'});
				// Log the error.
				console.error(error.value);
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
	};
</script>