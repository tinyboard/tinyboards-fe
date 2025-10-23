export interface FlairEmoji {
  id: number
  shortcode: string
  imageUrl?: string
  category?: string
  isCustom: boolean
}

export interface GradientStop {
  color: string
  position: number
}

export interface FlairGradient {
  type: 'linear' | 'radial'
  colors: string[]
  angle?: number
  stops?: GradientStop[]
}

export type Gradient = FlairGradient

export interface FlairTextShadow {
  offsetX: number
  offsetY: number
  blur: number
  color: string
}

export type TextShadow = FlairTextShadow

export interface FlairStyle {
  backgroundColor?: string
  gradient?: FlairGradient
  textColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  textShadow?: FlairTextShadow
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  animation?: 'pulse' | 'shimmer' | 'bounce' | 'none'
  glow?: boolean
  glowColor?: string
}

export interface FlairCategory {
  id: number
  name: string
  boardId?: number
  description?: string
  creationDate: string
  updated: string
}

export interface Flair {
  id: number
  text: string
  emoji?: FlairEmoji
  style: FlairStyle
  category?: FlairCategory
  categoryId?: number
  boardId?: number
  isUserSelectable: boolean
  isModOnly: boolean
  creationDate: string
  updated: string
}

export interface FlairAssignment {
  id: number
  flairId: number
  flair: Flair
  userId?: number
  postId?: number
  assignedAt: string
}

export type FlairSize = 'xs' | 'sm' | 'md' | 'lg'
export type FlairLayout = 'horizontal' | 'vertical'
export type FlairType = 'POST' | 'USER' | 'BOTH'
export type FlairScope = 'BOARD' | 'SITE'
export type AnimationType = 'pulse' | 'shimmer' | 'bounce' | 'none'

export interface FlairTemplate {
  id?: number
  boardId?: number
  flairType: FlairType
  flairScope?: FlairScope
  templateName?: string
  templateKey?: string
  text: string
  textColor?: string
  backgroundColor?: string
  cssClass?: string
  styleConfig?: string
  emojiIds?: number[]
  category?: FlairCategory
  categoryId?: number
  displayOrder?: number
  requiresApproval?: boolean
  isActive?: boolean
  usageCount?: number
  creationDate?: string
  updated?: string
  createdBy?: number
  modOnly?: boolean
  emoji?: string
  style: FlairStyle
}

// Default flair style
export const DEFAULT_FLAIR_STYLE: FlairStyle = {
  backgroundColor: '#e5e7eb',
  textColor: '#1f2937',
  borderRadius: 4,
  fontWeight: 'medium',
  animation: 'none'
}

// Gradient helper function
export function gradientToCSS(gradient: Gradient): string {
  if (!gradient.stops || gradient.stops.length < 2) {
    return 'transparent'
  }

  const stops = gradient.stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ')

  if (gradient.type === 'radial') {
    return `radial-gradient(circle, ${stops})`
  }

  const angle = gradient.angle ?? 90
  return `linear-gradient(${angle}deg, ${stops})`
}

// Flair style to CSS helper function
export function flairStyleToCSS(style: FlairStyle): Record<string, string> {
  const css: Record<string, string> = {}

  if (style.gradient) {
    css.background = gradientToCSS(style.gradient)
  } else if (style.backgroundColor) {
    css.backgroundColor = style.backgroundColor
  }

  if (style.textColor) {
    css.color = style.textColor
  }

  if (style.borderColor) {
    css.borderColor = style.borderColor
  }

  if (style.borderWidth !== undefined) {
    css.borderWidth = `${style.borderWidth}px`
    css.borderStyle = 'solid'
  }

  if (style.borderRadius !== undefined) {
    css.borderRadius = `${style.borderRadius}px`
  }

  if (style.fontWeight) {
    css.fontWeight = style.fontWeight
  }

  if (style.textShadow) {
    const { offsetX, offsetY, blur, color } = style.textShadow
    css.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`
  }

  return css
}

// Gradient presets
export const GRADIENT_PRESETS: Gradient[] = [
  {
    type: 'linear',
    angle: 90,
    colors: ['#667eea', '#764ba2'],
    stops: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 }
    ]
  },
  {
    type: 'linear',
    angle: 45,
    colors: ['#f093fb', '#f5576c'],
    stops: [
      { color: '#f093fb', position: 0 },
      { color: '#f5576c', position: 100 }
    ]
  },
  {
    type: 'linear',
    angle: 135,
    colors: ['#4facfe', '#00f2fe'],
    stops: [
      { color: '#4facfe', position: 0 },
      { color: '#00f2fe', position: 100 }
    ]
  },
  {
    type: 'radial',
    colors: ['#fa709a', '#fee140'],
    stops: [
      { color: '#fa709a', position: 0 },
      { color: '#fee140', position: 100 }
    ]
  }
]

// Shadow presets
export const SHADOW_PRESETS: TextShadow[] = [
  { offsetX: 0, offsetY: 0, blur: 0, color: 'transparent' }, // None
  { offsetX: 1, offsetY: 1, blur: 2, color: 'rgba(0, 0, 0, 0.5)' }, // Subtle
  { offsetX: 2, offsetY: 2, blur: 4, color: 'rgba(0, 0, 0, 0.6)' }, // Medium
  { offsetX: 3, offsetY: 3, blur: 6, color: 'rgba(0, 0, 0, 0.7)' }, // Strong
  { offsetX: 0, offsetY: 0, blur: 8, color: 'rgba(255, 255, 255, 0.8)' } // Glow
]
