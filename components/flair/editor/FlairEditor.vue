<template>
  <div class="max-w-6xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Flair Template' : 'Create Flair Template' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create a custom flair with unique styling and animations
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Form Inputs -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>

            <div class="space-y-4">
              <!-- Flair Text -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Flair Text
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="localFlair.text"
                  type="text"
                  required
                  maxlength="50"
                  placeholder="e.g., Moderator, VIP, Verified"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ localFlair.text.length }}/50 characters
                </p>
              </div>

              <!-- Emoji Picker -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emoji (Optional)
                </label>
                <div class="flex items-center gap-2">
                  <div
                    v-if="localFlair.emoji"
                    class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span class="text-2xl">{{ localFlair.emoji }}</span>
                    <button
                      type="button"
                      @click="localFlair.emoji = undefined"
                      class="text-red-600 hover:text-red-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="showEmojiPicker = true"
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {{ localFlair.emoji ? 'Change Emoji' : 'Add Emoji' }}
                  </button>
                </div>
              </div>

              <!-- Flair Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Flair Type
                  <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="localFlair.flairType"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="USER">User Flair</option>
                  <option value="POST">Post Flair</option>
                  <option value="BOTH">User & Post Flair</option>
                </select>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Where this flair can be used
                </p>
              </div>

              <!-- Category -->
              <FlairCategorySelector
                v-model="localFlair.categoryId"
                :board-id="boardId"
              />

              <!-- Mod Only Toggle -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-900 dark:text-white">
                    Moderator Only
                  </label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Only moderators can assign this flair
                  </p>
                </div>
                <SwitchInput
                  :is-enabled="localFlair.modOnly"
                  @enabled="localFlair.modOnly = $event"
                />
              </div>
            </div>
          </div>

          <!-- Visual Styling Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Visual Styling
            </h3>

            <FlairStyleEditor v-model="localFlair.style" />
          </div>
        </div>

        <!-- Right Column: Live Preview -->
        <div class="lg:col-span-1">
          <div class="sticky top-4 space-y-6">
            <!-- Preview Card -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Live Preview
              </h3>
              <FlairPreview :flair="localFlair" />
            </div>

            <!-- Actions -->
            <div class="space-y-3">
              <button
                type="submit"
                :disabled="saving || !isValid"
                class="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saving ? 'Saving...' : (isEditing ? 'Update Flair' : 'Create Flair') }}
              </button>

              <button
                type="button"
                @click="handleCancel"
                :disabled="saving"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                v-if="isEditing"
                type="button"
                @click="handleDelete"
                :disabled="saving"
                class="w-full px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Flair
              </button>
            </div>

            <!-- Usage Stats (if editing) -->
            <div v-if="isEditing && localFlair.usageCount !== undefined" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Used {{ localFlair.usageCount }} times
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Emoji Picker Modal -->
    <Teleport to="body">
      <div
        v-if="showEmojiPicker"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showEmojiPicker = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Select Emoji
            </h3>
            <button
              @click="showEmojiPicker = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <InputsEmojiPicker
            :board-id="boardId"
            @emoji-selected="handleEmojiSelected"
          />
        </div>
      </div>
    </Teleport>

    <!-- Error/Success Messages -->
    <Teleport to="body">
      <div
        v-if="errorMessage"
        class="fixed bottom-4 right-4 max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg z-50"
      >
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800 dark:text-red-200">Error</p>
            <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ errorMessage }}</p>
          </div>
          <button
            @click="errorMessage = ''"
            class="text-red-400 hover:text-red-600 dark:hover:text-red-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div
        v-if="successMessage"
        class="fixed bottom-4 right-4 max-w-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg z-50"
      >
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">Success</p>
            <p class="text-sm text-green-600 dark:text-green-400 mt-1">{{ successMessage }}</p>
          </div>
          <button
            @click="successMessage = ''"
            class="text-green-400 hover:text-green-600 dark:hover:text-green-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { FlairTemplate, FlairType, FlairScope } from '~/types/flair';
import { DEFAULT_FLAIR_STYLE } from '~/types/flair';
import { useGraphQLMutation } from '~/composables/useGraphQL';
import FlairCategorySelector from './FlairCategorySelector.vue';
import FlairStyleEditor from './FlairStyleEditor.vue';
import FlairPreview from './FlairPreview.vue';
import SwitchInput from '~/components/inputs/Switch.vue';
import InputsEmojiPicker from '~/components/inputs/EmojiPicker.vue';

interface Props {
  flair?: FlairTemplate;
  boardId?: number;
  scope?: FlairScope;
}

const props = withDefaults(defineProps<Props>(), {
  scope: 'BOARD'
});

const emit = defineEmits<{
  save: [flair: FlairTemplate];
  cancel: [];
  delete: [id: number];
}>();

// State
const isEditing = computed(() => !!props.flair?.id);
const saving = ref(false);
const showEmojiPicker = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Local flair state
const localFlair = ref<FlairTemplate>({
  text: '',
  flairType: 'POST' as FlairType,
  flairScope: props.scope,
  modOnly: false,
  boardId: props.boardId,
  style: { ...DEFAULT_FLAIR_STYLE },
  ...props.flair
});

// Validation
const isValid = computed(() => {
  return localFlair.value.text.length > 0 && localFlair.value.text.length <= 50;
});

// Methods
const handleEmojiSelected = (emoji: string) => {
  localFlair.value.emoji = emoji;
  showEmojiPicker.value = false;
};

// Convert frontend FlairStyle to backend FlairStyleInput
const convertStyleToBackend = (style: FlairStyle) => {
  const backendStyle: any = {
    backgroundColor: style.backgroundColor,
    textColor: style.textColor,
    borderColor: style.borderColor,
    borderWidth: style.borderWidth,
    borderRadius: style.borderRadius,
    fontWeight: style.fontWeight,
  };

  // Handle gradient
  if (style.useGradient && style.gradient) {
    backendStyle.gradientStart = style.gradient.stops[0]?.color;
    backendStyle.gradientEnd = style.gradient.stops[style.gradient.stops.length - 1]?.color;
    backendStyle.gradientDirection = style.gradient.type === 'linear'
      ? `${style.gradient.angle || 90}deg`
      : 'radial';
  }

  // Handle text shadow
  if (style.textShadow) {
    backendStyle.shadowColor = style.textShadow.color;
    backendStyle.shadowOffsetX = style.textShadow.offsetX;
    backendStyle.shadowOffsetY = style.textShadow.offsetY;
    backendStyle.shadowBlur = style.textShadow.blur;
  }

  // Handle animation
  if (style.animation && style.animation !== 'none') {
    backendStyle.animationType = style.animation;
    backendStyle.animationDuration = style.animationDuration || 2;
  }

  return backendStyle;
};

const handleSubmit = async () => {
  if (!isValid.value) {
    errorMessage.value = 'Please fill in all required fields';
    return;
  }

  saving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const styleConfig = convertStyleToBackend(localFlair.value.style);

    if (isEditing.value && localFlair.value.id) {
      // Update existing flair template
      const updateMutation = `
        mutation UpdateFlairTemplate($templateId: Int!, $input: UpdateFlairTemplateInput!) {
          updateFlairTemplate(templateId: $templateId, input: $input) {
            id
            textDisplay
            textColor
            backgroundColor
            styleConfig
            categoryId
            displayOrder
            requiresApproval
            isActive
            usageCount
          }
        }
      `;

      const { data, error: mutationError } = await useGraphQLMutation(updateMutation, {
        variables: {
          templateId: localFlair.value.id,
          input: {
            textDisplay: localFlair.value.text,
            textEditable: !localFlair.value.modOnly,
            backgroundColor: localFlair.value.style.backgroundColor,
            textColor: localFlair.value.style.textColor,
            styleConfig,
            categoryId: localFlair.value.categoryId,
            displayOrder: localFlair.value.displayOrder,
            requiresApproval: localFlair.value.modOnly,
          }
        }
      });

      if (mutationError.value) {
        throw new Error(mutationError.value.message || 'Failed to update flair template');
      }

      if (data.value?.updateFlairTemplate) {
        emit('save', data.value.updateFlairTemplate);
        successMessage.value = 'Flair updated successfully!';
      }
    } else {
      // Create new flair template
      const createMutation = `
        mutation CreateFlairTemplate($input: CreateFlairTemplateInput!) {
          createFlairTemplate(input: $input) {
            id
            textDisplay
            textColor
            backgroundColor
            styleConfig
            categoryId
            displayOrder
            requiresApproval
            isActive
            usageCount
          }
        }
      `;

      const { data, error: mutationError } = await useGraphQLMutation(createMutation, {
        variables: {
          input: {
            boardId: props.boardId,
            flairType: localFlair.value.flairType,
            textDisplay: localFlair.value.text,
            textEditable: !localFlair.value.modOnly,
            backgroundColor: localFlair.value.style.backgroundColor,
            textColor: localFlair.value.style.textColor,
            styleConfig,
            categoryId: localFlair.value.categoryId,
            displayOrder: localFlair.value.displayOrder || 0,
            requiresApproval: localFlair.value.modOnly
          }
        }
      });

      if (mutationError.value) {
        throw new Error(mutationError.value.message || 'Failed to create flair template');
      }

      if (data.value?.createFlairTemplate) {
        emit('save', data.value.createFlairTemplate);
        successMessage.value = 'Flair created successfully!';
      }
    }

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to save flair';
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};

const handleDelete = async () => {
  if (!localFlair.value.id) return;

  if (!confirm('Are you sure you want to delete this flair? This action cannot be undone.')) {
    return;
  }

  saving.value = true;
  errorMessage.value = '';

  try {
    const deleteMutation = `
      mutation DeleteFlairTemplate($templateId: Int!) {
        deleteFlairTemplate(templateId: $templateId)
      }
    `;

    const { data, error: mutationError } = await useGraphQLMutation(deleteMutation, {
      variables: {
        templateId: localFlair.value.id
      }
    });

    if (mutationError.value) {
      throw new Error(mutationError.value.message || 'Failed to delete flair template');
    }

    if (data.value?.deleteFlairTemplate) {
      emit('delete', localFlair.value.id);
      successMessage.value = 'Flair deleted successfully!';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to delete flair';
  } finally {
    saving.value = false;
  }
};

// Watch for external changes
watch(
  () => props.flair,
  (newValue) => {
    if (newValue) {
      localFlair.value = {
        text: '',
        flairType: 'POST' as FlairType,
        flairScope: props.scope,
        modOnly: false,
        boardId: props.boardId,
        style: { ...DEFAULT_FLAIR_STYLE },
        ...newValue
      };
    }
  },
  { deep: true }
);
</script>
