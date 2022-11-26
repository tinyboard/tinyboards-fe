<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="px-4 py-5 sm:p-6 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Content</h3>
				<p class="mt-1 text-sm text-gray-600">Manage how content is displayed on this TinyBoard.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white px-4 py-5 sm:p-6">
					<!-- NSFW -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Show NSFW</label>
						</div>
						<!-- Inputs -->
						<div class="mt-5 md:col-span-2 md:mt-0">
							<InputsSwitch :isEnabled="settings.show_nsfw" @enabled="settings.show_nsfw = !settings.show_nsfw"/>
							<p class="mt-2 text-sm text-gray-500">
								Show adult content marked as "not safe for work".
							</p>
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
				"show_nsfw": settings.value.show_nsfw
			},
			headers: {
				Authorization: authCookie ? `Bearer ${authCookie}` : '',
			}
		})
		.then(({ data }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({header:'Settings saved',message:'Your account settings were updated!',type:'success'});
			} else {
				// Show error toast.
				toast.addNotification({header:'Saving failed',message:'Your settings have failed to save.',type:'error'});
				// Log the error.
				console.error(`Error: ${data.error}`)
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
	};
</script>