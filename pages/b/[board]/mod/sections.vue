<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Board Sections</h3>
				<p class="mt-1 text-sm text-gray-600">Configure which sections are enabled for your board. At least one section must be enabled.</p>
			</div>
			<!-- Form -->
			<form @submit.prevent="submitSettings">
				<div class="flex flex-col space-y-6 bg-white p-4">
					<!-- Section Toggles -->
					<div class="space-y-4">
						<!-- Feed Section -->
						<div class="border border-gray-200 rounded-lg p-4">
							<label class="flex items-start justify-between cursor-pointer">
								<div class="flex-1 pr-4">
									<div class="flex items-center gap-2 mb-1">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<rect x="3" y="5" width="18" height="14" rx="2"></rect>
											<line x1="3" y1="10" x2="21" y2="10"></line>
											<line x1="8" y1="15" x2="8.01" y2="15"></line>
											<line x1="12" y1="15" x2="12.01" y2="15"></line>
											<line x1="16" y1="15" x2="16.01" y2="15"></line>
										</svg>
										<h4 class="font-semibold text-gray-900">Feed</h4>
									</div>
									<p class="text-sm text-gray-600">
										Traditional Reddit-style feed with upvotes/downvotes and nested comments
									</p>
								</div>
								<input
									type="checkbox"
									v-model="sections.feed"
									:disabled="sections.feed && enabledSectionsCount === 1"
									class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</label>
						</div>

						<!-- Threads Section -->
						<div class="border border-gray-200 rounded-lg p-4">
							<label class="flex items-start justify-between cursor-pointer">
								<div class="flex-1 pr-4">
									<div class="flex items-center gap-2 mb-1">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
											<path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
											<line x1="3" y1="6" x2="3" y2="19"></line>
											<line x1="12" y1="6" x2="12" y2="19"></line>
											<line x1="21" y1="6" x2="21" y2="19"></line>
										</svg>
										<h4 class="font-semibold text-gray-900">Threads</h4>
									</div>
									<p class="text-sm text-gray-600">
										Forum-style discussion threads with chronological comments and quote-based replies
									</p>
								</div>
								<input
									type="checkbox"
									v-model="sections.threads"
									:disabled="sections.threads && enabledSectionsCount === 1"
									class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</label>
						</div>

						<!-- Future sections (disabled for now) -->
						<div class="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-60">
							<div class="flex items-start justify-between">
								<div class="flex-1 pr-4">
									<div class="flex items-center gap-2 mb-1">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
											<path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
											<path d="M3 6l9 9l9 -9"></path>
										</svg>
										<h4 class="font-semibold text-gray-500">Wiki</h4>
										<span class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Coming Soon</span>
									</div>
									<p class="text-sm text-gray-500">
										Collaborative wiki pages for documentation and guides
									</p>
								</div>
								<input
									type="checkbox"
									disabled
									class="h-5 w-5 text-gray-400 rounded cursor-not-allowed"
								/>
							</div>
						</div>
					</div>

					<!-- Validation Message -->
					<div v-if="enabledSectionsCount === 0" class="p-4 bg-red-50 border border-red-200 rounded-lg">
						<div class="flex items-start gap-3">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<circle cx="12" cy="12" r="9"></circle>
								<line x1="12" y1="8" x2="12" y2="12"></line>
								<line x1="12" y1="16" x2="12.01" y2="16"></line>
							</svg>
							<div>
								<p class="font-medium text-red-800">At least one section required</p>
								<p class="text-sm text-red-700 mt-1">Your board must have at least one section enabled.</p>
							</div>
						</div>
					</div>

					<!-- Quick Presets -->
					<div class="border-t pt-6">
						<h4 class="font-medium text-gray-900 mb-3">Quick Presets</h4>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<button
								type="button"
								@click="applyPreset('feed')"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Feed Only
							</button>
							<button
								type="button"
								@click="applyPreset('threads')"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Threads Only
							</button>
							<button
								type="button"
								@click="applyPreset('both')"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Both
							</button>
						</div>
					</div>

					<!-- Section Order -->
					<div class="border-t pt-6" v-if="enabledSectionsCount > 1">
						<h4 class="font-medium text-gray-900 mb-3">Section Order</h4>
						<p class="text-sm text-gray-600 mb-4">Drag to reorder how sections appear in the navigation</p>
						<div class="space-y-2">
							<div
								v-for="(section, index) in orderedSections"
								:key="section"
								class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50"
								draggable="true"
								@dragstart="onDragStart(index)"
								@dragover.prevent
								@drop="onDrop(index)"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<line x1="4" y1="6" x2="20" y2="6"></line>
									<line x1="4" y1="12" x2="20" y2="12"></line>
									<line x1="4" y1="18" x2="20" y2="18"></line>
								</svg>
								<span class="font-medium text-gray-900 capitalize">{{ section }}</span>
								<span v-if="defaultSection === section" class="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
									Default
								</span>
							</div>
						</div>
					</div>

					<!-- Default Section -->
					<div class="border-t pt-6" v-if="enabledSectionsCount > 0">
						<h4 class="font-medium text-gray-900 mb-3">Default Section</h4>
						<p class="text-sm text-gray-600 mb-4">Which section should load when users visit this board?</p>
						<div class="space-y-2">
							<label v-if="sections.feed" class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
								<input
									type="radio"
									v-model="defaultSection"
									value="feed"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500"
								/>
								<span class="font-medium text-gray-900">Feed</span>
							</label>
							<label v-if="sections.threads" class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
								<input
									type="radio"
									v-model="defaultSection"
									value="threads"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500"
								/>
								<span class="font-medium text-gray-900">Threads</span>
							</label>
						</div>
					</div>

					<!-- Current Configuration Summary -->
					<div class="border-t pt-6">
						<h4 class="font-medium text-gray-900 mb-2">Current Configuration</h4>
						<div class="bg-gray-50 rounded-lg p-4">
							<p class="text-sm text-gray-600 mb-2">Enabled sections:</p>
							<div class="flex flex-wrap gap-2">
								<span v-if="sections.feed" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
									Feed
								</span>
								<span v-if="sections.threads" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
									Threads
								</span>
								<span v-if="enabledSectionsCount === 0" class="text-sm text-gray-500 italic">
									None (invalid - must enable at least one)
								</span>
							</div>
							<p v-if="defaultSection" class="text-sm text-gray-600 mt-3">Default: <strong class="text-gray-900 capitalize">{{ defaultSection }}</strong></p>
							<p v-if="sectionOrder" class="text-sm text-gray-600 mt-2">Order: <strong class="text-gray-900">{{ sectionOrder }}</strong></p>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4">
					<button
						type="submit"
						class="button primary"
						:class="{ 'loading': isLoading }"
						:disabled="isLoading || enabledSectionsCount === 0"
					>
						Save Sections
					</button>
				</div>
			</form>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useBoardStore } from '@/stores/StoreBoard';
import { useGraphQLMutation } from '@/composables/useGraphQL';

const boardStore = useBoardStore();
const board = boardStore.board;

// Initialize sections from board section_config
const sections = ref({
	feed: (board.hasFeed !== undefined) ? board.hasFeed : true,
	threads: (board.hasThreads !== undefined) ? board.hasThreads : false,
});

// Initialize section order from board
const parseSectionOrder = (orderString) => {
	if (!orderString) return [];
	return orderString.split(',').filter(s => s.trim());
};

const orderedSections = ref(parseSectionOrder(board.sectionOrder || 'feed,threads'));
const defaultSection = ref(board.defaultSection || 'feed');
const draggedIndex = ref(null);

definePageMeta({
	'hasAuthRequired': true,
	isLeftNavbarDisabled: true
});

useHead({
	'title': `${board.name} - Section Settings`
});

const toast = useToastStore();
const isLoading = ref(false);

// Computed property for count of enabled sections
const enabledSectionsCount = computed(() => {
	let count = 0;
	if (sections.value.feed) count++;
	if (sections.value.threads) count++;
	return count;
});

// Computed for section order string
const sectionOrder = computed(() => {
	return orderedSections.value.filter(s => sections.value[s]).join(',');
});

// Watch sections changes and update ordered list
watch(sections, (newSections) => {
	// Add newly enabled sections to the order
	if (newSections.feed && !orderedSections.value.includes('feed')) {
		orderedSections.value.push('feed');
	}
	if (newSections.threads && !orderedSections.value.includes('threads')) {
		orderedSections.value.push('threads');
	}

	// Remove disabled sections from the order
	orderedSections.value = orderedSections.value.filter(s => newSections[s]);

	// Update default section if it was disabled
	if (!newSections[defaultSection.value]) {
		if (newSections.feed) defaultSection.value = 'feed';
		else if (newSections.threads) defaultSection.value = 'threads';
	}
}, { deep: true });

// Drag and drop handlers
const onDragStart = (index) => {
	draggedIndex.value = index;
};

const onDrop = (dropIndex) => {
	if (draggedIndex.value === null) return;

	const draggedItem = orderedSections.value[draggedIndex.value];
	orderedSections.value.splice(draggedIndex.value, 1);
	orderedSections.value.splice(dropIndex, 0, draggedItem);

	draggedIndex.value = null;
};

// Convert sections object to bit flags
const getSectionConfig = () => {
	let config = 0;
	if (sections.value.feed) config |= 1;     // bit 0
	if (sections.value.threads) config |= 2;  // bit 1
	// Future: wiki = 4, gallery = 8, events = 16
	return config;
};

// Apply preset configurations
const applyPreset = (preset) => {
	switch (preset) {
		case 'feed':
			sections.value.feed = true;
			sections.value.threads = false;
			defaultSection.value = 'feed';
			break;
		case 'threads':
			sections.value.feed = false;
			sections.value.threads = true;
			defaultSection.value = 'threads';
			break;
		case 'both':
			sections.value.feed = true;
			sections.value.threads = true;
			break;
	}
};

const submitSettings = async () => {
	if (enabledSectionsCount.value === 0) {
		toast.addNotification({
			header: 'Invalid configuration',
			message: 'At least one section must be enabled.',
			type: 'error'
		});
		return;
	}

	isLoading.value = true;

	try {
		const mutation = `
			mutation updateBoardSettings($input: UpdateBoardSettingsInput!) {
				updateBoardSettings(input: $input) {
					board {
						id
						name
						title
						description
						hasFeed
						hasThreads
						sectionOrder
						defaultSection
					}
				}
			}
		`;

		const sectionConfig = getSectionConfig();

		const { data: result } = await useGraphQLMutation(mutation, {
			variables: {
				input: {
					boardId: board.id,
					sectionConfig: sectionConfig,
					sectionOrder: sectionOrder.value,
					defaultSection: defaultSection.value
				}
			}
		});

		if (result.value?.updateBoardSettings?.board) {
			toast.addNotification({
				header: 'Sections updated',
				message: 'Board section configuration has been saved!',
				type: 'success'
			});

			// Update the board store
			boardStore.setBoard({
				...board,
				...result.value.updateBoardSettings.board
			});

			// Refresh the page to update navigation
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} else {
			throw new Error('Failed to update section settings');
		}
	} catch (error) {
		toast.addNotification({
			header: 'Saving failed',
			message: 'Section settings failed to save.',
			type: 'error'
		});
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};
</script>
