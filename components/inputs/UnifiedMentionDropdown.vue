<template>
  <Teleport to="body">
    <div
      v-if="isVisible && (userSuggestions.length > 0 || boardSuggestions.length > 0)"
      class="mention-dropdown"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      @mousedown.prevent
    >
      <div class="mention-dropdown-list">
        <!-- User Suggestions -->
        <div v-if="userSuggestions.length > 0">
          <div class="mention-dropdown-header">Users</div>
          <div
            v-for="(username, index) in userSuggestions"
            :key="`user-${username}`"
            class="mention-dropdown-item"
            :class="{ 'is-selected': selectedIndex === index && currentType === 'user' }"
            @click="selectUserMention(username)"
            @mouseenter="setSelected('user', index)"
          >
            <div class="mention-dropdown-avatar">
              <span class="mention-dropdown-at">@</span>
            </div>
            <span class="mention-dropdown-username">{{ username }}</span>
          </div>
        </div>

        <!-- Board Suggestions -->
        <div v-if="boardSuggestions.length > 0">
          <div class="mention-dropdown-header" :class="{ 'mt-2': userSuggestions.length > 0 }">Boards</div>
          <div
            v-for="(board, index) in boardSuggestions"
            :key="`board-${board.id}`"
            class="mention-dropdown-item"
            :class="{ 'is-selected': selectedIndex === index && currentType === 'board' }"
            @click="selectBoardMention(board)"
            @mouseenter="setSelected('board', index)"
          >
            <div class="mention-dropdown-avatar board-avatar">
              <span class="mention-dropdown-at">b/</span>
            </div>
            <div class="mention-dropdown-content">
              <span class="mention-dropdown-username">{{ board.name }}</span>
              <span v-if="board.title" class="mention-dropdown-subtitle">{{ board.title }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isUserLoading || isBoardLoading" class="mention-dropdown-loading">
        <span>Loading...</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BoardSuggestion } from '@/composables/useBoardMentions'

interface Props {
  userSuggestions: string[]
  boardSuggestions: BoardSuggestion[]
  isUserLoading: boolean
  isBoardLoading: boolean
  isVisible: boolean
  position: { top: number; left: number }
  selectedIndex: number
  currentType: 'user' | 'board'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectUser: [username: string]
  selectBoard: [board: BoardSuggestion]
  updateSelection: [type: 'user' | 'board', index: number]
}>()

const selectUserMention = (username: string) => {
  emit('selectUser', username)
}

const selectBoardMention = (board: BoardSuggestion) => {
  emit('selectBoard', board)
}

const setSelected = (type: 'user' | 'board', index: number) => {
  emit('updateSelection', type, index)
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
  min-width: 250px;
  max-height: 200px;
  overflow-y: auto;
}

.mention-dropdown-list {
  padding: 4px;
}

.mention-dropdown-header {
  padding: 8px 12px 4px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;
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
  font-size: 12px;
  font-weight: 600;
}

.mention-dropdown-avatar.board-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.mention-dropdown-at {
  color: white;
  font-weight: 600;
}

.mention-dropdown-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mention-dropdown-username {
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mention-dropdown-subtitle {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mention-dropdown-loading {
  padding: 12px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .mention-dropdown {
    background: #374151;
    border-color: #4b5563;
  }

  .mention-dropdown-header {
    color: #9ca3af;
    border-bottom-color: #4b5563;
  }

  .mention-dropdown-item:hover,
  .mention-dropdown-item.is-selected {
    background-color: #4b5563;
  }

  .mention-dropdown-username {
    color: #f3f4f6;
  }

  .mention-dropdown-subtitle {
    color: #9ca3af;
  }

  .mention-dropdown-loading {
    color: #9ca3af;
  }
}
</style>