<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="p-4 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Reaction Settings</h3>
				<p class="mt-1 text-sm text-gray-600">Configure emoji reactions for threads on your board.</p>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="p-8 text-center">
				<p class="text-gray-500">Loading reaction settings...</p>
			</div>

			<!-- Form -->
			<form v-else @submit.prevent="submitSettings" class="flex flex-col space-y-6 bg-white p-4">
				<!-- Enable/Disable Reactions -->
				<div class="border border-gray-200 rounded-lg p-4">
					<label class="flex items-start justify-between cursor-pointer">
						<div class="flex-1 pr-4">
							<h4 class="font-semibold text-gray-900 mb-1">Enable Reactions</h4>
							<p class="text-sm text-gray-600">
								Allow users to react to thread posts and comments with emojis
							</p>
						</div>
						<input
							type="checkbox"
							v-model="reactionsEnabled"
							class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
						/>
					</label>
				</div>

				<!-- Emoji Configuration -->
				<div v-if="reactionsEnabled" class="space-y-4">
					<div class="border-t pt-4">
						<h4 class="font-semibold text-gray-900 mb-3">Allowed Emojis</h4>
						<p class="text-sm text-gray-600 mb-4">
							Configure which emojis are allowed and their weights. Weights must be -1 (negative), 0 (neutral), or 1 (positive).
						</p>

						<!-- Emoji List -->
						<div class="space-y-2">
							<div
								v-for="(weight, emoji, index) in emojiWeights"
								:key="index"
								class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
							>
								<span class="text-2xl">{{ emoji }}</span>
								<select
									v-model.number="emojiWeights[emoji]"
									class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
								>
									<option :value="1">Positive (+1)</option>
									<option :value="0">Neutral (0)</option>
									<option :value="-1">Negative (-1)</option>
								</select>
								<button
									type="button"
									@click="removeEmoji(emoji)"
									class="text-red-600 hover:text-red-700 p-2"
									title="Remove emoji"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
										<path stroke="none" d="M0 0h24h24H0z" fill="none"></path>
										<line x1="18" y1="6" x2="6" y2="18"></line>
										<line x1="6" y1="6" x2="18" y2="18"></line>
									</svg>
								</button>
							</div>
						</div>

						<!-- Add New Emoji -->
						<div class="mt-4 flex items-center gap-2">
							<input
								v-model="newEmoji"
								type="text"
								placeholder="Enter emoji (e.g., 🔥)"
								class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
								maxlength="10"
							/>
							<select
								v-model.number="newEmojiWeight"
								class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							>
								<option :value="1">Positive (+1)</option>
								<option :value="0">Neutral (0)</option>
								<option :value="-1">Negative (-1)</option>
							</select>
							<button
								type="button"
								@click="addEmoji"
								class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							>
								Add
							</button>
						</div>

						<!-- Quick Presets -->
						<div class="mt-6 pt-4 border-t">
							<h5 class="font-medium text-gray-900 mb-3">Quick Presets</h5>
							<div class="flex flex-wrap gap-2">
								<button
									type="button"
									@click="applyPreset('default')"
									class="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
								>
									Default Set
								</button>
								<button
									type="button"
									@click="applyPreset('simple')"
									class="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
								>
									Simple (👍👎)
								</button>
								<button
									type="button"
									@click="applyPreset('discord')"
									class="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
								>
									Discord-style
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex items-center justify-between pt-4 border-t">
					<p class="text-sm text-gray-500">Changes will take effect immediately</p>
					<button
						type="submit"
						:disabled="submitting"
						class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{{ submitting ? 'Saving...' : 'Save Settings' }}
					</button>
				</div>

				<!-- Success Message -->
				<div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-md">
					<p class="text-sm text-green-800">{{ successMessage }}</p>
				</div>

				<!-- Error Message -->
				<div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
					<p class="text-sm text-red-800">{{ errorMessage }}</p>
				</div>
			</form>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useGraphQLQuery, useGraphQLMutation } from "@/composables/useGraphQL";

const route = useRoute();
const boardStore = useBoardStore();
const userStore = useLoggedInUser();

const boardName = route.params.board;
const board = computed(() => boardStore.board);

// State
const loading = ref(true);
const submitting = ref(false);
const reactionsEnabled = ref(true);
const emojiWeights = ref({});
const newEmoji = ref('');
const newEmojiWeight = ref(1);
const successMessage = ref('');
const errorMessage = ref('');

// Fetch board reaction settings
const fetchSettings = async () => {
	loading.value = true;
	try {
		const query = `
			query GetBoardReactionSettings($name: String!) {
				board(name: $name) {
					id
					reactionSettings {
						id
						emojiWeights
						reactionsEnabled
					}
				}
			}
		`;

		const { data, error } = await useGraphQLQuery(query, {
			variables: { name: boardName }
		});

		if (error.value || !data.value?.board) {
			throw new Error('Failed to load board settings');
		}

		const settings = data.value.board.reactionSettings;
		if (settings) {
			reactionsEnabled.value = settings.reactionsEnabled;
			emojiWeights.value = settings.emojiWeights || getDefaultEmojiWeights();
		} else {
			emojiWeights.value = getDefaultEmojiWeights();
		}
	} catch (err) {
		console.error('Error fetching reaction settings:', err);
		errorMessage.value = 'Failed to load reaction settings';
		emojiWeights.value = getDefaultEmojiWeights();
	} finally {
		loading.value = false;
	}
};

// Default emoji weights
const getDefaultEmojiWeights = () => ({
	'👍': 1,
	'❤️': 1,
	'😂': 0,
	'😮': 0,
	'😢': 0,
	'👎': -1
});

// Add emoji
const addEmoji = () => {
	const emoji = newEmoji.value.trim();
	if (!emoji) return;

	if (emojiWeights.value[emoji] !== undefined) {
		errorMessage.value = `Emoji ${emoji} already exists`;
		setTimeout(() => errorMessage.value = '', 3000);
		return;
	}

	emojiWeights.value[emoji] = newEmojiWeight.value;
	newEmoji.value = '';
	newEmojiWeight.value = 1;
};

// Remove emoji
const removeEmoji = (emoji) => {
	delete emojiWeights.value[emoji];
};

// Apply preset
const applyPreset = (preset) => {
	switch (preset) {
		case 'default':
			emojiWeights.value = getDefaultEmojiWeights();
			break;
		case 'simple':
			emojiWeights.value = {
				'👍': 1,
				'👎': -1
			};
			break;
		case 'discord':
			emojiWeights.value = {
				'👍': 1,
				'❤️': 1,
				'😂': 0,
				'😮': 0,
				'😢': 0,
				'😠': 0,
				'👎': -1
			};
			break;
	}
};

// Submit settings
const submitSettings = async () => {
	if (submitting.value) return;

	submitting.value = true;
	errorMessage.value = '';
	successMessage.value = '';

	try {
		const mutation = `
			mutation UpdateBoardReactionSettings($input: UpdateBoardReactionSettingsInput!) {
				updateBoardReactionSettings(input: $input) {
					settings {
						id
						emojiWeights
						reactionsEnabled
					}
				}
			}
		`;

		const { data, error } = await useGraphQLMutation(mutation, {
			variables: {
				input: {
					boardId: board.value.id,
					emojiWeights: emojiWeights.value,
					reactionsEnabled: reactionsEnabled.value
				}
			}
		});

		if (error.value) {
			throw new Error(error.value.message || 'Failed to update settings');
		}

		successMessage.value = 'Reaction settings updated successfully!';
		setTimeout(() => successMessage.value = '', 3000);
	} catch (err) {
		console.error('Error updating reaction settings:', err);
		errorMessage.value = err.message || 'Failed to update reaction settings';
	} finally {
		submitting.value = false;
	}
};

// Load settings on mount
onMounted(() => {
	fetchSettings();
});

definePageMeta({
	middleware: 'auth'
});
</script>
