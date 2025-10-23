<template>
  <div
    class="flair-stack"
    :class="[
      layoutClass,
      collapsible && !isExpanded ? 'flair-stack-collapsed' : ''
    ]"
  >
    <FlairDisplayFlairBadge
      v-for="(flair, index) in visibleFlairs"
      :key="flair.id"
      :flair="flair"
      :size="size"
      :clickable="clickable"
      :removable="removable"
      @click="handleFlairClick"
      @remove="handleFlairRemove"
    />

    <button
      v-if="hasOverflow"
      type="button"
      class="flair-expand-button inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded transition-colors"
      :class="[
        size === 'xs' ? 'text-xs px-1.5 py-0.5' : '',
        size === 'sm' ? 'text-sm px-2 py-0.5' : '',
        size === 'md' ? 'text-sm px-2.5 py-1' : '',
        size === 'lg' ? 'text-base px-3 py-1.5' : '',
        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
        'hover:bg-gray-200 dark:hover:bg-gray-600',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400'
      ]"
      :aria-label="isExpanded ? 'Show less' : `Show ${overflowCount} more`"
      @click="toggleExpanded"
    >
      <span v-if="!isExpanded">+{{ overflowCount }}</span>
      <span v-else class="flex items-center gap-1">
        <span>Show less</span>
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Flair, FlairSize, FlairLayout } from '~/types/flair'

interface Props {
  flairs: Flair[]
  size?: FlairSize
  clickable?: boolean
  removable?: boolean
  layout?: FlairLayout
  maxVisible?: number
  collapsible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  clickable: false,
  removable: false,
  layout: 'horizontal',
  maxVisible: 5,
  collapsible: true
})

const emit = defineEmits<{
  'flair-click': [flair: Flair]
  'flair-remove': [flair: Flair]
}>()

const isExpanded = ref(false)

const layoutClass = computed(() => {
  return props.layout === 'horizontal'
    ? 'flex flex-wrap items-center gap-2'
    : 'flex flex-col items-start gap-2'
})

const hasOverflow = computed(() => {
  return props.collapsible && props.flairs.length > props.maxVisible
})

const overflowCount = computed(() => {
  return Math.max(0, props.flairs.length - props.maxVisible)
})

const visibleFlairs = computed(() => {
  if (!hasOverflow.value || isExpanded.value) {
    return props.flairs
  }
  return props.flairs.slice(0, props.maxVisible)
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const handleFlairClick = (flair: Flair) => {
  if (props.clickable) {
    emit('flair-click', flair)
  }
}

const handleFlairRemove = (flair: Flair) => {
  if (props.removable) {
    emit('flair-remove', flair)
  }
}

// Reset expansion when flairs change
watch(() => props.flairs.length, () => {
  isExpanded.value = false
})
</script>

<style scoped>
.flair-stack {
  max-width: 100%;
}

.flair-stack-collapsed {
  overflow: hidden;
}

.flair-expand-button {
  flex-shrink: 0;
  user-select: none;
}
</style>
