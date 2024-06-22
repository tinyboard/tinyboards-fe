<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Sidebar</h3>
				<p class="mt-1 text-sm text-gray-600">Long text on the board sidebar. You can use this to write a longer description, add links, set rules, etc. It's all yours.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="onSubmit" @submit="submitSettings()">
				<div class="m-4">
					<textarea id="sidebar" name="sidebar" maxlength="10000" rows="30"
					class="block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
					:placeholder="board.description"
					v-model="settings.sidebar" />
				<div class="flex justify-between">
					<p class="mt-1 flex justify-end items-center text-sm text-gray-400">
						<svg xmlns="http://www.w3.org/2000/svg" class="mr-1 w-4 h-4" width="24" height="24"
							viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
							stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<rect x="3" y="5" width="18" height="14" rx="2"></rect>
							<path d="M7 15v-6l2 2l2 -2v6"></path>
							<path d="M14 13l2 2l2 -2m-2 2v-6"></path>
						</svg>
						Board sidebar text. Markdown supported.
					</p>
					<p class="mt-2 text-xs"
						:class="settings.sidebar?.length > 9950 ? 'text-red-600' : 'text-gray-500'">{{
							settings.sidebar?.length || 0 }} / 10 000</p>
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
	alias: ['/+:board/mod/s', '/+:board/mod/sidebar']
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
			"sidebar": settings.value.sidebar
		}
	})
		.then(({ data, error }) => {
			if (data.value) {
				// Show success toast.
				toast.addNotification({ header: 'Settings saved', message: 'Board settings were updated!', type: 'success' });

				// window.location.reload(true);
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