<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Board Profile</h3>
				<p class="mt-1 text-sm text-gray-600">The basic information about your board that everyone sees.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="flex flex-col space-y-6 divide-y bg-white p-4">
					<!-- Title -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Title</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="text" name="name" id="name" class="mt-1 form-input gray"
								placeholder="..." v-model="settings.title" />
							<p class="mt-2 text-sm text-gray-500">
								The big bold name in the board banner. Takes precedence everywhere over the +name.
							</p>
						</div>
					</div>
					<!-- +name -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Name</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<input type="text" name="name" id="name" class="mt-1 form-input gray"
								placeholder="..." v-model="settings.name" />
							<p class="mt-2 text-sm text-gray-500">
								The +name of your board. Only the capitalization can be changed.
							</p>
						</div>
					</div>
					<!-- Description -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Description</label>
						</div>
						<!-- Inputs -->
						<div class="mt-4 md:col-span-2 md:mt-0">
							<textarea id="biography" name="biography" rows="4" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" placeholder="The best board on this godforsaken website." v-model="settings.description"/>
							<p class="mt-2 text-sm text-gray-500">Brief description about +{{ board.name }}.</p>
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
import { useBoardStore } from '@/stores/StoreBoard';
import { useApi } from "@/composables/api";

const boardStore = useBoardStore();
const board = boardStore.boardView.board;

const settings = ref(JSON.parse(JSON.stringify(board)));

definePageMeta({
	'hasAuthRequired': true,
	alias: ['/+:board/mod/settings'],
	isLeftNavbarDisabled: true
});

useHead({
	'title': `+${board.name} Settings`
});

const toast = useToastStore();

const isLoading = ref(false);

const submitSettings = () => {
	isLoading.value = true;
	useApi(`/board/${board.id}`, {
		method: "put",
		body: {
			"name": settings.value.name,
			"title": settings.value.title,
			"description": settings.value.description
		}
	})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({ header: 'Settings saved', message: 'Board settings were updated!', type: 'success' });

				window.location.reload(true);
			} else {
				// Show error toast.
				toast.addNotification({ header: 'Saving failed', message: 'Board settings have failed to save.', type: 'error' });
				// Log the error.
				console.error(error.value);
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
};
</script>