<template>
  <div class="flex items-center gap-2">
    <!-- Participants Icon/Label -->
    <div
      v-if="showLabel"
      class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
      title="Thread participants"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/>
      </svg>
      <span class="hidden lg:inline font-medium">Participants:</span>
    </div>

    <!-- Avatar list -->
    <div class="flex -space-x-2">
      <NuxtLink
        v-for="(participant, index) in displayedParticipants"
        :key="participant.id"
        :to="`/@${participant.name}`"
        :title="participant.displayName || participant.name"
        class="relative inline-block"
      >
      <img
        v-if="participant.avatar || site.defaultAvatar"
        :src="participant.avatar || site.defaultAvatar"
        :alt="participant.displayName || participant.name"
        class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 hover:scale-110 hover:z-10 transition-transform"
        @error="(e) => handleImageError(e, participant)"
      />
      <div
        v-else
        class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900 flex items-center justify-center hover:scale-110 hover:z-10 transition-transform"
        :title="participant.displayName || participant.name"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4 text-blue-600 dark:text-blue-400"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </NuxtLink>

      <!-- Show count if more than 5 participants -->
      <div
        v-if="participants && participants.length > maxDisplay"
        class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300"
        :title="`${participants.length - maxDisplay} more participant${participants.length - maxDisplay > 1 ? 's' : ''}`"
      >
        +{{ participants.length - maxDisplay }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSiteStore } from '@/stores/StoreSite';

const site = useSiteStore();

interface Participant {
  id: number;
  name: string;
  displayName?: string;
  avatar?: string;
}

interface Props {
  participants?: Participant[];
  maxDisplay?: number;
  showTooltip?: boolean;
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  participants: () => [],
  maxDisplay: 5,
  showTooltip: false,
  showLabel: true
});

const displayedParticipants = computed(() => {
  return props.participants?.slice(0, props.maxDisplay) || [];
});

const handleImageError = (event: Event, participant: Participant) => {
  // If image fails to load, hide the img element so the v-else fallback shows
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
};
</script>
