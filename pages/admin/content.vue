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
								<InputsSwitch id="nsfw" :isEnabled="settings.enable_federation" @enabled="settings.enable_federation = !settings.enable_federation" />
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Enable
									federation</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Opt the site into the Fediverse.
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
								<InputsSwitch id="nsfw" :isEnabled="settings.enable_nsfw" @enabled="settings.enable_nsfw = !settings.enable_nsfw" />
								<label for="nsfw" class="ml-2 font-medium text-gray-900 dark:text-gray-300">Allow NSFW
									content</label>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								Allow adult content marked "not safe for work" to be posted.
							</p>
						</div>
					</div>
					<!-- Default Avatar -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Default Avatar</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0 flex items-center">
							<img v-if="imageStore.default_avatar || settings.default_avatar" :src="imageStore.default_avatar ?? settings.default_avatar" class="w-20 h-20 object-cover p-0.5 border bg-white" />
							<div v-else class="w-20 h-20 rounded-md border border-gray-300 border-dashed"></div>
							<div class="ml-5">
								<label for="avatar-upload" class="inline-block button gray cursor-pointer">
									{{ settings.default_avatar ? 'Change default avatar' : 'Upload default avatar' }}
								</label>
								<input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="e => onFileChange(e, 'default_avatar')" />
								<small class="block mt-2 text-gray-400">
									PNG, JPG <span class="line-through">and GIF</span> up to 1MB. This will be the default
									avatar for users.
								</small>
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
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
import { useImageStore } from '@/stores/StoreImages';
import { useModalStore } from "@/stores/StoreModal";
import { dataURLtoFile } from '@/utils/files';

definePageMeta({
	'hasAuthRequired': true,
	'title': 'Settings',
	isFooterDisabled: true,
	isScrollDisabled: true,
	permissionRequired: "content",
    'isLeftNavbarDisabled': true
});

const toast = useToastStore();
const imageStore = useImageStore();
const modalStore = useModalStore();
const authCookie = useCookie("token").value;

// File inputs
const onFileChange = (e, type) => {
	const file = e.target.files[0];

	const maxFileSize = type == "avatar" ? 1024 * 1024 : 3 * 1024 * 1024;

	if (file.size > maxFileSize) {
		toast.addNotification({ header: 'Your files are too large!', message: `Max size for ${type}s is ${type == 'avatar' ? 1 : 3}MB.`, type: 'error' });
		return;
	}

	modalStore.setModal({
		modal: "ModalCrop",
		id: 0,
		contentType: type,
		isOpen: true,
		options: {
			image: URL.createObjectURL(file)
		}
	});
};

const uploadFile = async (file, type) => {
	const maxFileSize = type == "avatar" ? 1024 * 1024 : 3 * 1024 * 1024;

	if (file.size > maxFileSize) {
		toast.addNotification({ header: 'Your files are too large!', message: `Max size for ${type}s is ${type == 'avatar' ? 1 : 3}MB.`, type: 'error' });
		throw new Error("enormous file");
	}

	let formData = new FormData();
	formData.append('file', file);

	const { data, pending, error, refresh } = await useApi("/file/upload", {
		method: "put",
		body: formData
	});

	if (data.value.uploads.length > 0) {
		return data.value.uploads[0];
	} else if (error.value.statusCode == 413) {
		toast.addNotification({ header: 'Your files are too large!', message: 'Your file is over 25MB!! How did you bypass the previous checks?', type: 'error' });

		throw new Error(error.value);
	} else {
		// Show error toast.
		toast.addNotification({ header: 'Upload failed', message: 'Failed to upload image :(', type: 'error' });
		// Log the error.
		console.error(error.value);

		throw new Error(error.value);
	}
}

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

	// upload default avatar
	if (imageStore.default_avatar) {
		const default_avatar = dataURLtoFile(imageStore.default_avatar);
		// after converting to file is finished, delete the original b64 url
		imageStore.purgeDefaultAvatar();

		try {
			settings.value.default_avatar = await uploadFile(default_avatar, 'avatar');
		} catch (e) {
			console.error(e);
			isLoading.value = false;
			return;
		}
	}

	useApi('/admin/site', {
			method: "put",
			body: {
				//"name": settings.value.name,
				//"description": settings.value.description,
				"enable_downvotes": settings.value.enable_downvotes,
				"site_mode": settings.value.site_mode,
				"enable_nsfw": settings.value.enable_nsfw,
				"application_question": settings.value.application_question,
				"private_instance": settings.value.private_instance,
				"email_verification_required": settings.value.email_verification_required,
				"default_avatar": settings.value.default_avatar
				//"boards_enabled": settings.value.boards_enabled
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