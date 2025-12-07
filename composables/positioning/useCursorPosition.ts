// Unified cursor position utilities for both TipTap and textarea
import type { Editor } from '@tiptap/vue-3'

export interface CursorPosition {
  top: number
  left: number
  bottom: number
  right: number
}

/**
 * Get cursor position for TipTap editor using multiple fallback strategies
 */
export function getTipTapCursorPosition(editor: Editor, pos?: number): CursorPosition | null {
  if (!editor?.view?.dom) {
    console.warn('Editor not ready for positioning')
    return null
  }

  // Strategy 1: Use native selection API (most reliable)
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const rects = range.getClientRects()
    if (rects.length > 0 && rects[0].top > 0) {
      const rect = rects[0]
      return {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right
      }
    }
  }

  // Strategy 2: Use TipTap's coordsAtPos with $anchor
  try {
    const position = pos ?? editor.state.selection.$anchor.pos
    const coords = editor.view.coordsAtPos(position)

    if (coords && (coords.top > 0 || coords.left > 0)) {
      return {
        top: coords.top,
        left: coords.left,
        bottom: coords.bottom || coords.top + 20,
        right: coords.right || coords.left
      }
    }
  } catch (error) {
    console.warn('coordsAtPos failed:', error)
  }

  return null
}

/**
 * Get cursor position for textarea using mirror div technique
 */
export function getTextareaCursorPosition(
  textarea: HTMLTextAreaElement,
  caretPos: number
): CursorPosition {
  const div = document.createElement('div')
  const computed = getComputedStyle(textarea)

  // Copy all relevant styles
  const stylesToCopy = [
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
    'letterSpacing', 'wordSpacing', 'lineHeight',
    'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    'border', 'borderLeft', 'borderRight', 'borderTop', 'borderBottom',
    'boxSizing', 'whiteSpace'
  ]

  stylesToCopy.forEach(prop => {
    div.style[prop as any] = computed[prop as any]
  })

  // Position and make invisible
  div.style.position = 'absolute'
  div.style.left = '-9999px'
  div.style.top = '-9999px'
  div.style.visibility = 'hidden'
  div.style.height = 'auto'
  div.style.width = textarea.clientWidth + 'px'
  div.style.whiteSpace = 'pre-wrap'
  div.style.wordWrap = 'break-word'
  div.style.overflow = 'hidden'

  document.body.appendChild(div)

  // Get text before caret
  const textBeforeCaret = textarea.value.substring(0, caretPos)
  div.textContent = textBeforeCaret

  // Create a span for the caret position
  const span = document.createElement('span')
  span.textContent = '|'
  div.appendChild(span)

  const spanRect = span.getBoundingClientRect()
  const divRect = div.getBoundingClientRect()
  const textareaRect = textarea.getBoundingClientRect()

  // Calculate relative position within the textarea
  const relativeTop = spanRect.top - divRect.top
  const relativeLeft = spanRect.left - divRect.left

  document.body.removeChild(div)

  return {
    top: textareaRect.top + relativeTop,
    left: textareaRect.left + relativeLeft,
    bottom: textareaRect.top + relativeTop + 20,
    right: textareaRect.left + relativeLeft
  }
}

/**
 * Calculate dropdown position with viewport boundary checks
 */
export function calculateDropdownPosition(
  cursorPos: CursorPosition,
  dropdownHeight: number = 200,
  dropdownWidth: number = 250
): { top: number; left: number } {
  const OFFSET = 5

  // Start position: below cursor
  let top = cursorPos.bottom + OFFSET
  let left = cursorPos.left

  // Viewport boundary checks
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  // Flip above if insufficient space below
  const spaceBelow = viewportHeight - cursorPos.bottom
  const spaceAbove = cursorPos.top

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    top = cursorPos.top - dropdownHeight - OFFSET
  }

  // Prevent overflow right edge
  if (left + dropdownWidth > viewportWidth - 10) {
    left = viewportWidth - dropdownWidth - 10
  }

  // Prevent overflow left edge
  if (left < 10) {
    left = 10
  }

  return { top, left }
}
