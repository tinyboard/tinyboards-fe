<template>
  <NuxtLayout name="admin">
    <div class="flex flex-col space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <NuxtLink to="/admin" class="text-gray-700 dark:text-gray-300 hover:text-primary">
              Admin
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <NuxtLink to="/admin/flairs" class="ml-1 text-gray-700 dark:text-gray-300 hover:text-primary">
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
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Site-Wide Flair</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create a new global flair for the entire site
        </p>
      </div>

      <!-- Flair Editor -->
      <FlairEditor
        :is-site-wide="true"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/StoreToast';
import FlairEditor from '@/components/flair/editor/FlairEditor.vue';

const router = useRouter();
const toast = useToastStore();

definePageMeta({
  hasAuthRequired: true,
  isAdminRequired: true,
  isLeftNavbarDisabled: true
});

useHead({
  title: 'Create Site-Wide Flair - Admin'
});

const handleSave = () => {
  toast.addNotification({
    header: 'Flair created',
    message: 'The site-wide flair has been created successfully.',
    type: 'success'
  });
  router.push('/admin/flairs');
};

const handleCancel = () => {
  router.push('/admin/flairs');
};
</script>
