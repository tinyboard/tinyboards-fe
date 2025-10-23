<template>
  <div class="space-y-4">
    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Preview
    </div>

    <!-- Size Variations -->
    <div class="space-y-3">
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Small</p>
        <div class="flex items-center gap-2">
          <FlairBadge :flair="flair" size="sm" />
        </div>
      </div>

      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Medium (Default)</p>
        <div class="flex items-center gap-2">
          <FlairBadge :flair="flair" size="md" />
        </div>
      </div>

      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Large</p>
        <div class="flex items-center gap-2">
          <FlairBadge :flair="flair" size="lg" />
        </div>
      </div>
    </div>

    <!-- Background Variations -->
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">On Different Backgrounds</p>
      <div class="space-y-2">
        <!-- Light Background -->
        <div class="p-3 bg-white dark:bg-gray-100 rounded-lg">
          <FlairBadge :flair="flair" />
        </div>

        <!-- Gray Background -->
        <div class="p-3 bg-gray-200 dark:bg-gray-300 rounded-lg">
          <FlairBadge :flair="flair" />
        </div>

        <!-- Dark Background -->
        <div class="p-3 bg-gray-800 dark:bg-gray-900 rounded-lg">
          <FlairBadge :flair="flair" />
        </div>

        <!-- Primary Background -->
        <div class="p-3 bg-primary rounded-lg">
          <FlairBadge :flair="flair" />
        </div>
      </div>
    </div>

    <!-- Context Examples -->
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">In Context</p>
      <div class="space-y-3">
        <!-- Post Title Context -->
        <div class="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-start gap-2">
            <h3 class="text-base font-medium text-gray-900 dark:text-white">
              Example Post Title
            </h3>
            <FlairBadge :flair="flair" size="sm" />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Posted by u/username · 2 hours ago
          </p>
        </div>

        <!-- User Name Context -->
        <div class="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">u/username</span>
                <FlairBadge :flair="flair" size="sm" />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Active 5m ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlairTemplate } from '~/types/flair';

interface Props {
  flair: FlairTemplate;
  background?: 'light' | 'dark';
}

withDefaults(defineProps<Props>(), {
  background: 'light'
});
</script>
