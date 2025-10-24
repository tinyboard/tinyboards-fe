<template>
  <NuxtLayout name="settings">
    <div class="flex flex-col space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <NuxtLink :to="`/b/${boardName}`" class="text-gray-700 dark:text-gray-300 hover:text-primary">
              {{ boardName }}
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <NuxtLink :to="`/b/${boardName}/flairs`" class="ml-1 text-gray-700 dark:text-gray-300 hover:text-primary">
                Flairs
              </NuxtLink>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-gray-500 dark:text-gray-400">Create</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Flair</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create a new flair for {{ boardName }}
        </p>
      </div>

      <!-- Flair Editor -->
      <FlairEditor
        :board-id="boardId"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery } from '@/composables/useGraphQL';
import { requireModPermission } from '@/composables/mod';
import FlairEditor from '@/components/flair/editor/FlairEditor.vue';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const boardName = route.params.board;

definePageMeta({
  hasAuthRequired: true,
  isLeftNavbarDisabled: true
});

useHead({
  title: `Create Flair - ${boardName}`
});

// Fetch board info to get board ID and check permissions
const { data: boardData, error } = await useGraphQLQuery(`
  query GetBoard($boardName: String!) {
    board(name: $boardName) {
      id
      name
      myModPermissions
    }
  }
`, {
  variables: {
    boardName
  }
});

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load board information',
    fatal: true
  });
}

const board = computed(() => boardData.value?.board);
const boardId = computed(() => board.value?.id);

// Check permissions
const hasConfigPermission = computed(() => {
  const perms = board.value?.myModPermissions;
  if (!perms) return false;

  return requireModPermission(perms, 'config');
});

// Check permissions after data loads
watch(hasConfigPermission, (hasPerms) => {
  if (hasPerms === false && board.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to create flairs',
      fatal: true
    });
  }
});

const handleSave = () => {
  toast.addNotification({
    header: 'Flair created',
    message: 'The flair has been created successfully.',
    type: 'success'
  });
  router.push(`/b/${boardName}/flairs`);
};

const handleCancel = () => {
  router.push(`/b/${boardName}/flairs`);
};
</script>
