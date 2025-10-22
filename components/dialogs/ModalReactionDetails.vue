<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="modal relative z-50">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>

      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]"
            enter-from="opacity-0 scale-90"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-90"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-gray-950 text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <DialogTitle class="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Reactions
                </DialogTitle>
              </div>

              <!-- Tabs -->
              <div class="border-b border-gray-200 dark:border-gray-800">
                <nav class="flex space-x-1 px-4 overflow-x-auto" aria-label="Tabs">
                  <button
                    @click="selectedEmoji = 'all'"
                    :class="[
                      selectedEmoji === 'all'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                      'whitespace-nowrap border-b-2 py-3 px-3 text-sm font-medium transition-colors flex-shrink-0'
                    ]"
                  >
                    All ({{ totalCount }})
                  </button>
                  <button
                    v-for="reaction in reactionCounts"
                    :key="reaction.emoji"
                    @click="selectedEmoji = reaction.emoji"
                    :class="[
                      selectedEmoji === reaction.emoji
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                      'whitespace-nowrap border-b-2 py-3 px-3 text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0'
                    ]"
                  >
                    <span v-if="!isCustomEmoji(reaction.emoji)" class="text-base">{{ reaction.emoji }}</span>
                    <div v-else class="w-4 h-4 flex items-center justify-center">
                      <img :src="getCustomEmojiUrl(reaction.emoji)" :alt="reaction.emoji" class="w-4 h-4 object-contain" />
                    </div>
                    <span>{{ reaction.count }}</span>
                  </button>
                </nav>
              </div>

              <!-- User List -->
              <div class="max-h-96 overflow-y-auto">
                <div v-if="filteredUsers.length === 0" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No reactions yet
                </div>
                <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
                  <div
                    v-for="item in filteredUsers"
                    :key="`${item.user.id}-${item.emoji}`"
                    class="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <!-- Avatar -->
                    <NuxtLink :to="`/@${item.user.name}`" class="flex-shrink-0">
                      <img
                        v-if="item.user.avatar || site.defaultAvatar"
                        :src="item.user.avatar || site.defaultAvatar"
                        :alt="item.user.displayName || item.user.name"
                        class="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                      />
                      <div
                        v-else
                        class="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-5 h-5 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </NuxtLink>

                    <!-- User Info -->
                    <div class="flex-1 min-w-0">
                      <NuxtLink :to="`/@${item.user.name}`" class="font-medium text-gray-900 dark:text-gray-100 hover:underline">
                        {{ item.user.displayName || item.user.name }}
                      </NuxtLink>
                      <p class="text-sm text-gray-500 dark:text-gray-400">@{{ item.user.name }}</p>
                    </div>

                    <!-- Emoji -->
                    <div class="flex-shrink-0 text-2xl flex items-center justify-center">
                      <span v-if="!isCustomEmoji(item.emoji)">{{ item.emoji }}</span>
                      <img v-else :src="getCustomEmojiUrl(item.emoji)" :alt="item.emoji" class="w-6 h-6 object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-900">
                <button
                  type="button"
                  class="button gray w-full"
                  @click="modalStore.closeModal"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { useModalStore } from '@/stores/StoreModal';
import { useSiteStore } from '@/stores/StoreSite';
import { useCustomEmojis } from '@/composables/useCustomEmojis';

const site = useSiteStore();
const { loadCustomEmojis, isCustomEmoji, getCustomEmojiUrl } = useCustomEmojis();

interface User {
  id: number;
  name: string;
  displayName?: string;
  avatar?: string;
}

interface ReactionCount {
  id: number;
  emoji: string;
  count: number;
  users: User[];
}

interface Props {
  isOpen: boolean;
  options?: {
    reactionCounts: ReactionCount[];
    boardId?: number;
  };
}

const props = defineProps<Props>();

const reactionCounts = computed(() => props.options?.reactionCounts || []);

const modalStore = useModalStore();
const selectedEmoji = ref<string>('all');

// Load custom emojis on mount
onMounted(async () => {
  await loadCustomEmojis(props.options?.boardId);
});

const totalCount = computed(() => {
  return reactionCounts.value.reduce((sum, r) => sum + r.count, 0);
});

const filteredUsers = computed(() => {
  const users: Array<{ user: User; emoji: string }> = [];

  for (const reaction of reactionCounts.value) {
    if (selectedEmoji.value === 'all' || selectedEmoji.value === reaction.emoji) {
      for (const user of reaction.users || []) {
        users.push({ user, emoji: reaction.emoji });
      }
    }
  }

  return users;
});
</script>
