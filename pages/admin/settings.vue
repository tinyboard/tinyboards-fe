<template>
	<NuxtLayout name="admin">
		<div class="flex flex-col">
			<!-- Page Heading & Description -->
			<div class="p-4">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Site</h3>
				<p class="mt-1 text-sm text-gray-600">Set your site's name and configure how it appears in search results and embeds.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()" class="sm:border sm:rounded-md overflow-y-auto">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Site Name -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Site name</label>
						</div>
						<!-- Input -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="text" name="site-name" id="site-name" v-model="settings.name" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="tinyboard" maxlength="36"/>
							<p class="mt-2 text-sm text-gray-500">
								The name of your tinyboard. Visible wherever <span class="pre">site.name</span> is present.
							</p>
						</div>
					</div>
					<!-- Site Description -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Description</label>
						</div>
						<!-- Input -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<textarea id="description" name="description" rows="4" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" placeholder="A cozy little corner of the Internet where we discuss the intersection of technology and society." v-model="settings.description"/>
							<p class="mt-2 text-sm text-gray-500">Brief description about your tinyboard.</p>
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