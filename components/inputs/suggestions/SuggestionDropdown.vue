<template>
  <Teleport to="body">
    <div
      v-if="visible && items.length > 0"
      class="fixed z-50 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg max-w-xs"
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
    >
      <div class="p-2">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
          {{ title }}
        </div>
        <div class="max-h-48 overflow-y-auto">
          <button
            v-for="(item, index) in items"
            :key="getItemKey(item, index)"
            @click="$emit('select', index)"
            class="w-full flex items-center px-2 py-1.5 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{
              'bg-primary text-white hover:bg-primary': index === selectedIndex
            }"
          >
            <slot name="item" :item="item" :index="index">
              {{ getItemDisplay(item) }}
            </slot>
          </button>
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-2 px-2">
          ↑↓ navigate • Enter to select • Esc to close
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts" generic="T">
interface Props {
  visible: boolean
  items: T[]
  position: { top: number; left: number }
  selectedIndex: number
  title?: string
  displayKey?: keyof T | ((item: T) => string)
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Suggestions',
  displayKey: undefined
})

defineEmits<{
  select: [index: number]
}>()

const getItemDisplay = (item: T): string => {
  if (typeof props.displayKey === 'function') {
    return props.displayKey(item)
  }
  if (props.displayKey && typeof item === 'object' && item !== null) {
    return String(item[props.displayKey])
  }
  return String(item)
}

const getItemKey = (item: T, index: number): string | number => {
  if (typeof item === 'object' && item !== null && 'id' in item) {
    return (item as any).id
  }
  return index
}
</script>
