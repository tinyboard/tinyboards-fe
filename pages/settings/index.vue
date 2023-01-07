<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h2 class="text-lg font-medium leading-6 text-gray-900">Profile</h2>
				<p class="mt-1 text-sm text-gray-600">This information will be displayed on the World Wide Web just so you know.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Photo -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Avatar</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex items-center">
							<img v-if="settings.avatar" :src="settings.avatar" class="w-20 h-20 object-cover p-0.5 border bg-white"/>
							<div v-else class="w-20 h-20 rounded-md border border-gray-300 border-dashed"></div>
							<div class="ml-5">
								<label for="avatar-upload" class="inline-block button gray cursor-pointer">
									{{ settings.avatar ? 'Change avatar' : 'Upload avatar' }}
								</label>
								<input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="onFileChange($event,'avatar')"/>
								<small class="block mt-2 text-gray-400">
									PNG, JPG and GIF up to 1MB.
								</small>
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
						<div class="mt-4 md:col-span-2 md:mt-0 flex flex-col">
								<img v-if="settings.banner" :src="settings.banner" class="w-full h-24 object-cover p-0.5 border bg-white"/>
								<div v-else class="w-full h-24 rounded-md border border-gray-300 border-dashed"></div>
								<div class="mt-5">
									<label for="banner-upload" class="inline-block button gray cursor-pointer">
										{{ settings.banner ? 'Change banner' : 'Upload banner' }}
									</label>
									<input id="banner-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="onFileChange($event)"/>
									<small class="block mt-2 text-gray-400">
										PNG, JPG and GIF up to 1MB. Recommended 1390x192 pixels.
									</small>
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
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="text" name="company-website" id="display-name" class="mt-1 form-input gray" placeholder="elon" />
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
						<div class="mt-4 md:col-span-2 md:mt-0">
							<textarea id="biography" name="biography" rows="4" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" placeholder="A stranger surfing this World Wide Web." v-model="settings.bio"/>
							<p class="mt-2 text-sm text-gray-500">Brief description about yourself. Markdown supported.</p>
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
		'alias': '/settings/profile',
		'title': 'Profile'
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

	// Submit settings.
	const isLoading = ref(false);

	const submitSettings = () => {
		isLoading.value = true;
		useFetch('/settings', {
			baseURL,
			method: "put",
			body: {
				// "avatar": "https://i.imgur.com/U6CBf1D.gif",
				// "avatar": settings.value.avatar,
				// "banner": settings.value.banner,
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