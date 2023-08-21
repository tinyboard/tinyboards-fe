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
							<img v-if="imageStore.avatar || settings.avatar" :src="imageStore.avatar ?? settings.avatar" class="w-20 h-20 object-cover p-0.5 border bg-white"/>
							<div v-else class="w-20 h-20 rounded-md border border-gray-300 border-dashed"></div>
							<div class="ml-5">
								<label for="avatar-upload" class="inline-block button gray cursor-pointer">
									{{ settings.avatar ? 'Change avatar' : 'Upload avatar' }}
								</label>
								<input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="e => onFileChange(e, 'avatar')" />
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
								<img v-if="imageStore.banner || settings.banner" :src="imageStore.banner ?? settings.banner" class="w-full h-24 object-cover p-0.5 border bg-white"/>
								<div v-else class="w-full h-24 rounded-md border border-gray-300 border-dashed"></div>
								<div class="mt-5">
									<label for="banner-upload" class="inline-block button gray cursor-pointer">
										{{ settings.banner ? 'Change banner' : 'Upload banner' }}
									</label>
									<input id="banner-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="e => onFileChange(e, 'banner')"/>
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
							<input type="text" v-model="settings.display_name" name="company-website" id="display-name" class="mt-1 form-input gray" placeholder="My profile looks horrible" />
							<p class="mt-2 text-sm text-gray-500">
								This will take precedence over your @username on your profile page. Your @username won't be changed.
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
	// import { baseURL } from "@/server/constants";
	import { useApi } from "@/composables/api";
	import { useToastStore } from '@/stores/StoreToast';
	import { useLoggedInUser } from '@/stores/StoreAuth';
	import { useModalStore } from "@/stores/StoreModal";
	import { useImageStore } from '@/stores/StoreImages';

	definePageMeta({
		'hasAuthRequired': true,
		'alias': '/settings/profile',
		'title': 'Profile'
	});

	const toast = useToastStore();
	const authCookie = useCookie("token").value;
	const userStore = useLoggedInUser();
	const modalStore = useModalStore();
	const imageStore = useImageStore();

	const v = userStore.user;

	// File inputs
	const onFileChange = (e,type) => {
		console.log(type);
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			console.log("load ended");
			// Open modal for cropping file
			modalStore.setModal({
			  modal: "ModalCrop",
			  id: 0,
			  contentType: type,
			  isOpen: true,
			  options: {
			  	image: reader.result
			  }
			});
		};
		reader.readAsDataURL(file);

		/*const files = e.target.files || e.dataTransfer.files;

		let data = new FormData();
		data.append('file', files[0]);

		useApi("/file/upload", {
			method: "put",
			body: data
		})
		.then(({ data, pending, error, refresh }) => {
			if (data.value.uploads.length > 0) {
				const link = data.value.uploads[0];
				console.log(data);
				if (type === 'avatar') {
					settings.value.avatar = link;
				} else {
					settings.value.banner = link;
				}
			} else {
				// Show error toast.
				toast.addNotification({header:'Upload failed',message:'Failed to upload image :(',type:'error'});
				// Log the error.
				console.error(error.value);
			}
		});*/
	};

	// Fetch user settings
	// const { data, pending, error, refresh } = await useApi("/settings");

	let settings = ref({});

	/*if (data.value) {
		settings.value = { ...JSON.parse(JSON.stringify(data.value.settings.settings)) };
	}*/
	settings.value = { ...JSON.parse(JSON.stringify(v)) };

	// Submit settings
	const isLoading = ref(false);

	const change = ({ coordinates, canvas }) => {
      console.log(coordinates, canvas);
    }

	const submitSettings = () => {
		isLoading.value = true;
		useApi('/settings', {
			method: "put",
			body: {
				"avatar": settings.value.avatar,
				"banner": settings.value.banner,
				"bio": settings.value.bio,
				"display_name": settings.value.display_name,
			}
		})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({header:'Settings saved',message:'Your profile settings were updated!',type:'success'});
				// refresh page to remove old data from everywhere
				window.location.reload(true);
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