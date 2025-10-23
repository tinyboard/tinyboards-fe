<template>
  <span
    class="flair-badge inline-flex items-center justify-center whitespace-nowrap rounded transition-all duration-200"
    :class="[
      sizeClasses,
      animationClass,
      clickable ? 'cursor-pointer hover:opacity-80' : '',
      truncated ? 'max-w-full' : '',
      className
    ]"
    :style="computedStyle"
    :aria-label="ariaLabel"
    :title="flair.text"
    @click="handleClick"
  >
    <FlairDisplayEmojiRenderer
      v-if="flair.emoji"
      :emoji="flair.emoji"
      :size="size"
      class="flex-shrink-0"
    />
    <span
      v-if="displayText"
      class="flair-text"
      :class="{ 'truncate': truncated }"
    >
      {{ displayText }}
    </span>
    <button
      v-if="removable"
      type="button"
      class="flair-remove ml-1 flex-shrink-0 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 rounded-full"
      :aria-label="`Remove flair: ${flair.text}`"
      @click.stop="handleRemove"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
import type { Flair, FlairSize } from '~/types/flair'

interface Props {
  flair: Flair
  size?: FlairSize
  clickable?: boolean
  removable?: boolean
  truncated?: boolean
  maxLength?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  clickable: false,
  removable: false,
  truncated: false,
  maxLength: 50,
  className: ''
})

const emit = defineEmits<{
  click: [flair: Flair]
  remove: [flair: Flair]
}>()

const { buildFlairStyle, getAnimationClass, getSizeClasses } = useFlairStyle()

const sizeClasses = computed(() => getSizeClasses(props.size))

const animationClass = computed(() => getAnimationClass(props.flair.style.animation))

const computedStyle = computed(() => {
  return buildFlairStyle(props.flair.style)
})

const displayText = computed(() => {
  if (!props.flair.text) return ''

  if (props.truncated && props.flair.text.length > props.maxLength) {
    return props.flair.text.substring(0, props.maxLength) + '...'
  }

  return props.flair.text
})

const ariaLabel = computed(() => {
  const parts = []
  if (props.flair.emoji) {
    parts.push(props.flair.emoji.shortcode)
  }
  if (props.flair.text) {
    parts.push(props.flair.text)
  }
  return parts.join(' ')
})

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.flair)
  }
}

const handleRemove = () => {
  emit('remove', props.flair)
}
</script>

<style scoped>
.flair-badge {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  user-select: none;
}

.flair-text {
  display: inline-block;
  line-height: 1.2;
}

/* Animation keyframes */
@keyframes flair-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes flair-shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes flair-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.flair-pulse {
  animation: flair-pulse 2s ease-in-out infinite;
}

.flair-shimmer {
  background-size: 200% auto;
  animation: flair-shimmer 3s linear infinite;
}

.flair-bounce {
  animation: flair-bounce 1s ease-in-out infinite;
}
</style>
