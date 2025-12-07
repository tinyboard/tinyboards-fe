<template>
  <nav v-if="breadcrumbs.length > 0" aria-label="Breadcrumb" class="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
    <ol class="flex items-center space-x-2">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
        <NuxtLink
          v-if="crumb.href"
          :to="crumb.href"
          class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          {{ crumb.name }}
        </NuxtLink>
        <span v-else class="text-gray-900 dark:text-gray-100 font-medium">
          {{ crumb.name }}
        </span>
        <svg
          v-if="index < breadcrumbs.length - 1"
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 mx-2 text-gray-400"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSiteStore } from '@/stores/StoreSite';
import { useBoardStore } from '@/stores/StoreBoard';
import { useUrlBuilder } from '@/composables/useUrlBuilder';

const props = defineProps({
  // Optional custom breadcrumbs to display
  customCrumbs: {
    type: Array,
    default: null
  },
  // Current page title (for the last breadcrumb)
  currentPage: {
    type: String,
    default: null
  },
  // Board slug (if different from route params)
  boardSlug: {
    type: String,
    default: null
  },
  // Board name/title for display
  boardName: {
    type: String,
    default: null
  },
  // Stream information (for posts viewed from streams)
  streamSlug: {
    type: String,
    default: null
  },
  streamName: {
    type: String,
    default: null
  },
  streamCreatorUsername: {
    type: String,
    default: null
  }
});

const route = useRoute();
const siteStore = useSiteStore();
const boardStore = useBoardStore();
const { buildBoardUrl, buildSectionUrl, boardsEnabled } = useUrlBuilder();

const breadcrumbs = computed(() => {
  // Use custom breadcrumbs if provided
  if (props.customCrumbs) {
    return props.customCrumbs;
  }

  const crumbs = [];

  // Home
  crumbs.push({ name: 'Home', href: '/' });

  // Stream (if viewing from stream context)
  if (props.streamSlug && props.streamCreatorUsername) {
    // Add Streams section
    crumbs.push({
      name: 'Streams',
      href: '/streams'
    });

    // Add specific stream
    crumbs.push({
      name: props.streamName || props.streamSlug,
      href: `/streams/@${props.streamCreatorUsername}/${props.streamSlug}`
    });
  }
  // Board (if boards are enabled and we're in a board context, but not in stream context)
  else {
    const boardSlug = props.boardSlug || route.params?.board;
    if (boardsEnabled.value && boardSlug) {
      const boardName = props.boardName || boardStore.board?.title || boardStore.board?.name || boardSlug;
      crumbs.push({
        name: boardName,
        href: buildBoardUrl(boardSlug)
      });
    }

    // Section (threads, feed, wiki, etc.)
    const section = extractSection();
    if (section) {
      crumbs.push({
        name: capitalizeFirst(section),
        href: boardSlug ? buildSectionUrl(section, boardSlug) : `/${section}`
      });
    }
  }

  // Current page
  if (props.currentPage) {
    crumbs.push({
      name: props.currentPage,
      href: null // No href for current page
    });
  }

  return crumbs;
});

function extractSection() {
  const path = route.path;

  // Check for common sections
  if (path.includes('/threads')) return 'threads';
  if (path.includes('/feed')) return 'feed';
  if (path.includes('/wiki')) return 'wiki';
  if (path.includes('/members')) return 'members';
  if (path.includes('/submit')) return 'submit';

  return null;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style scoped>
/* Add any breadcrumb-specific styles here */
</style>
