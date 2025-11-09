<template>
  <Teleport to="body">
    <div
      v-if="isVisible && suggestions.length > 0"
      class="mention-dropdown"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      @mousedown.prevent
    >
    <div class="mention-dropdown-list">
      <div
        v-for="(username, index) in suggestions"
        :key="username"
        class="mention-dropdown-item"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="selectMention(username)"
        @mouseenter="selectedIndex = index"
      >
        <div class="mention-dropdown-avatar">
          <span class="mention-dropdown-at">@</span>
        </div>
        <span class="mention-dropdown-username">{{ username }}</span>
      </div>
    </div>
    <div v-if="isLoading" class="mention-dropdown-loading">
      <span>Loading...</span>
    </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  suggestions: string[]
  selectedIndex: number
  isVisible: boolean
  isLoading: boolean
  position: { top: number; left: number }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', username: string): void
  (e: 'update:selectedIndex', index: number): void
}>()

const selectedIndex = computed({
  get: () => props.selectedIndex,
  set: (value) => emit('update:selectedIndex', value)
})

const selectMention = (username: string) => {
  emit('select', username)
}
</script>

<style scoped>
.mention-dropdown {
  position: fixed;
  z-index: 1000;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 4px;
}

.mention-dropdown-list {
  padding: 4px;
}

.mention-dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.15s;
}

.mention-dropdown-item:hover,
.mention-dropdown-item.is-selected {
  background-color: #f3f4f6;
}

.mention-dropdown-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.mention-dropdown-at {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.mention-dropdown-username {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.mention-dropdown-loading {
  padding: 8px 12px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .mention-dropdown {
    background: #1f2937;
    border-color: #374151;
  }

  .mention-dropdown-item:hover,
  .mention-dropdown-item.is-selected {
    background-color: #374151;
  }

  .mention-dropdown-username {
    color: #e5e7eb;
  }

  .mention-dropdown-loading {
    color: #6b7280;
  }
}
</style>
