import type { FlairStyle, FlairGradient, FlairTextShadow } from '~/types/flair'

export const useFlairStyle = () => {
  /**
   * Converts backend FlairStyle JSON to frontend FlairStyle object
   */
  const parseBackendStyle = (styleConfig: string | null): any => {
    if (!styleConfig) {
      return {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        borderWidth: 0,
        borderColor: '#000000',
        borderRadius: 4,
        fontWeight: 'normal',
        useGradient: false,
        animation: 'none',
        textTransform: 'none'
      };
    }

    try {
      const parsed = JSON.parse(styleConfig);

      // Convert backend style to frontend format
      const style: any = {
        backgroundColor: parsed.background_color || parsed.backgroundColor || '#3b82f6',
        textColor: parsed.text_color || parsed.textColor || '#ffffff',
        borderWidth: parsed.border_width || parsed.borderWidth || 0,
        borderColor: parsed.border_color || parsed.borderColor || '#000000',
        borderRadius: parsed.border_radius || parsed.borderRadius || 4,
        fontWeight: parsed.font_weight || parsed.fontWeight || 'normal',
        textTransform: parsed.text_transform || parsed.textTransform || 'none',
        useGradient: false,
        animation: parsed.animation_type || parsed.animationType || 'none',
        animationDuration: parsed.animation_duration || parsed.animationDuration || 2
      };

      // Handle gradient
      const gradientStart = parsed.gradient_start || parsed.gradientStart;
      const gradientEnd = parsed.gradient_end || parsed.gradientEnd;
      const gradientDirection = parsed.gradient_direction || parsed.gradientDirection;

      if (gradientStart && gradientEnd) {
        style.useGradient = true;
        style.gradient = {
          type: gradientDirection?.includes('deg') ? 'linear' : 'radial',
          angle: gradientDirection?.includes('deg') ? parseInt(gradientDirection) : 90,
          stops: [
            { color: gradientStart, position: 0 },
            { color: gradientEnd, position: 100 }
          ]
        };
      }

      // Handle text shadow
      const shadowColor = parsed.shadow_color || parsed.shadowColor;
      const shadowOffsetX = parsed.shadow_offset_x || parsed.shadowOffsetX;
      const shadowOffsetY = parsed.shadow_offset_y || parsed.shadowOffsetY;
      const shadowBlur = parsed.shadow_blur || parsed.shadowBlur;

      if (shadowColor) {
        style.textShadow = {
          color: shadowColor,
          offsetX: shadowOffsetX || 0,
          offsetY: shadowOffsetY || 0,
          blur: shadowBlur || 0
        };
      }

      return style;
    } catch (e) {
      console.error('Failed to parse flair style:', e);
      return {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        borderWidth: 0,
        borderColor: '#000000',
        borderRadius: 4,
        fontWeight: 'normal',
        useGradient: false,
        animation: 'none',
        textTransform: 'none'
      };
    }
  };

  /**
   * Builds a CSS gradient string from gradient configuration
   */
  const buildGradient = (gradient: FlairGradient): string => {
    const { type, colors, angle = 90, stops } = gradient

    if (type === 'linear') {
      if (stops && stops.length === colors.length) {
        const colorStops = colors.map((color, i) => `${color} ${stops[i]}%`).join(', ')
        return `linear-gradient(${angle}deg, ${colorStops})`
      }
      return `linear-gradient(${angle}deg, ${colors.join(', ')})`
    }

    if (type === 'radial') {
      if (stops && stops.length === colors.length) {
        const colorStops = colors.map((color, i) => `${color} ${stops[i]}%`).join(', ')
        return `radial-gradient(circle, ${colorStops})`
      }
      return `radial-gradient(circle, ${colors.join(', ')})`
    }

    return colors[0] || '#000000'
  }

  /**
   * Builds a CSS text-shadow string from shadow configuration
   */
  const buildTextShadow = (shadow: FlairTextShadow): string => {
    const { offsetX, offsetY, blur, color } = shadow
    return `${offsetX}px ${offsetY}px ${blur}px ${color}`
  }

  /**
   * Calculates relative luminance for a color
   */
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = ((rgb >> 16) & 0xff) / 255
    const g = ((rgb >> 8) & 0xff) / 255
    const b = (rgb & 0xff) / 255

    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  /**
   * Calculates a contrasting text color (black or white) based on background
   */
  const getContrastColor = (backgroundColor?: string): string => {
    if (!backgroundColor || backgroundColor === 'transparent') {
      return '#000000'
    }

    // Handle rgb/rgba format
    if (backgroundColor.startsWith('rgb')) {
      const matches = backgroundColor.match(/\d+/g)
      if (matches && matches.length >= 3) {
        const [r, g, b] = matches.map(Number)
        const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        backgroundColor = hex
      }
    }

    // Ensure hex format
    if (!backgroundColor.startsWith('#')) {
      return '#000000'
    }

    const luminance = getLuminance(backgroundColor)
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  /**
   * Builds a complete CSS style object from flair style configuration
   */
  const buildFlairStyle = (style: FlairStyle): Record<string, string> => {
    const cssStyle: Record<string, string> = {}

    // Background - gradient takes precedence over solid color
    if (style.gradient) {
      cssStyle.background = buildGradient(style.gradient)
    } else if (style.backgroundColor) {
      cssStyle.backgroundColor = style.backgroundColor
    }

    // Text color
    if (style.textColor) {
      cssStyle.color = style.textColor
    } else if (style.backgroundColor && !style.gradient) {
      // Auto-calculate contrast color if not specified
      cssStyle.color = getContrastColor(style.backgroundColor)
    }

    // Border
    if (style.borderColor && style.borderWidth) {
      cssStyle.border = `${style.borderWidth}px solid ${style.borderColor}`
    }

    if (style.borderRadius !== undefined) {
      cssStyle.borderRadius = `${style.borderRadius}px`
    }

    // Text shadow
    if (style.textShadow) {
      cssStyle.textShadow = buildTextShadow(style.textShadow)
    }

    // Font weight
    if (style.fontWeight) {
      const weightMap = {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
      cssStyle.fontWeight = weightMap[style.fontWeight]
    }

    // Glow effect
    if (style.glow && style.glowColor) {
      const glowShadow = `0 0 10px ${style.glowColor}, 0 0 20px ${style.glowColor}`
      if (cssStyle.textShadow) {
        cssStyle.textShadow += `, ${glowShadow}`
      } else {
        cssStyle.textShadow = glowShadow
      }
      cssStyle.boxShadow = `0 0 15px ${style.glowColor}`
    }

    return cssStyle
  }

  /**
   * Gets the animation class name for a flair animation type
   */
  const getAnimationClass = (animation?: string): string => {
    if (!animation || animation === 'none') return ''

    const animationMap: Record<string, string> = {
      pulse: 'flair-pulse',
      shimmer: 'flair-shimmer',
      bounce: 'flair-bounce'
    }

    return animationMap[animation] || ''
  }

  /**
   * Gets size-specific classes
   */
  const getSizeClasses = (size: 'xs' | 'sm' | 'md' | 'lg'): string => {
    const sizeMap = {
      xs: 'text-xs px-1.5 py-0.5 gap-1',
      sm: 'text-sm px-2 py-0.5 gap-1',
      md: 'text-sm px-2.5 py-1 gap-1.5',
      lg: 'text-base px-3 py-1.5 gap-2'
    }

    return sizeMap[size] || sizeMap.md
  }

  return {
    parseBackendStyle,
    buildGradient,
    buildTextShadow,
    buildFlairStyle,
    getContrastColor,
    getAnimationClass,
    getSizeClasses
  }
}
