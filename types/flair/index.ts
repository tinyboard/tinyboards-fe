// Flair Type Definitions for TinyBoards

export type FlairType = 'user' | 'post';

export type FlairScope = 'site' | 'board';

export type GradientType = 'linear' | 'radial';

export type AnimationType = 'none' | 'pulse' | 'shimmer' | 'bounce';

export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface ColorStop {
  color: string;
  position: number; // 0-100
}

export interface Gradient {
  type: GradientType;
  angle?: number; // For linear gradients (0-360)
  stops: ColorStop[];
}

export interface TextShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  spread?: number; // For glow effect
}

export interface FlairStyle {
  // Background
  backgroundColor?: string;
  gradient?: Gradient;
  useGradient: boolean;

  // Text
  textColor: string;
  fontWeight: FontWeight;
  textTransform: TextTransform;
  textShadow?: TextShadow;

  // Border
  borderWidth: number;
  borderColor: string;
  borderRadius: number;

  // Effects
  animation: AnimationType;
  animationDuration?: number; // in seconds
}

export interface FlairCategory {
  id: number;
  name: string;
  color?: string;
  boardId?: number;
  siteWide: boolean;
  creationDate: string;
  updated: string;
}

export interface FlairTemplate {
  id?: number;
  text: string;
  emoji?: string;
  flairType: FlairType;
  flairScope: FlairScope;
  categoryId?: number;
  category?: FlairCategory;
  modOnly: boolean;
  boardId?: number;
  style: FlairStyle;
  creationDate?: string;
  updated?: string;
  usageCount?: number;
}

export interface CreateFlairInput {
  text: string;
  emoji?: string;
  flairType: FlairType;
  flairScope: FlairScope;
  categoryId?: number;
  modOnly: boolean;
  boardId?: number;
  style: FlairStyle;
}

export interface UpdateFlairInput {
  id: number;
  text?: string;
  emoji?: string;
  flairType?: FlairType;
  categoryId?: number;
  modOnly?: boolean;
  style?: FlairStyle;
}

export interface FlairPreset {
  name: string;
  style: FlairStyle;
}

export interface GradientPreset {
  name: string;
  gradient: Gradient;
}

export interface ShadowPreset {
  name: string;
  shadow: TextShadow | null;
}

// Preset gradients
export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    name: 'Ocean Blue',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 }
      ]
    }
  },
  {
    name: 'Sunset',
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { color: '#f093fb', position: 0 },
        { color: '#f5576c', position: 100 }
      ]
    }
  },
  {
    name: 'Purple Dream',
    gradient: {
      type: 'linear',
      angle: 45,
      stops: [
        { color: '#c471f5', position: 0 },
        { color: '#fa71cd', position: 100 }
      ]
    }
  },
  {
    name: 'Forest',
    gradient: {
      type: 'linear',
      angle: 180,
      stops: [
        { color: '#134e5e', position: 0 },
        { color: '#71b280', position: 100 }
      ]
    }
  },
  {
    name: 'Fire',
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { color: '#ff0844', position: 0 },
        { color: '#ffb199', position: 100 }
      ]
    }
  },
  {
    name: 'Neon',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { color: '#12c2e9', position: 0 },
        { color: '#c471ed', position: 50 },
        { color: '#f64f59', position: 100 }
      ]
    }
  },
  {
    name: 'Cotton Candy',
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { color: '#fbc2eb', position: 0 },
        { color: '#a6c1ee', position: 100 }
      ]
    }
  },
  {
    name: 'Gold',
    gradient: {
      type: 'linear',
      angle: 45,
      stops: [
        { color: '#f7971e', position: 0 },
        { color: '#ffd200', position: 100 }
      ]
    }
  }
];

// Preset shadows
export const SHADOW_PRESETS: ShadowPreset[] = [
  {
    name: 'None',
    shadow: null
  },
  {
    name: 'Drop Shadow',
    shadow: {
      offsetX: 2,
      offsetY: 2,
      blur: 4,
      color: 'rgba(0, 0, 0, 0.3)'
    }
  },
  {
    name: 'Soft Glow',
    shadow: {
      offsetX: 0,
      offsetY: 0,
      blur: 8,
      color: 'rgba(255, 255, 255, 0.5)',
      spread: 2
    }
  },
  {
    name: 'Neon Glow',
    shadow: {
      offsetX: 0,
      offsetY: 0,
      blur: 12,
      color: '#00ffff',
      spread: 4
    }
  }
];

// Default flair style
export const DEFAULT_FLAIR_STYLE: FlairStyle = {
  backgroundColor: '#3b82f6',
  useGradient: false,
  textColor: '#ffffff',
  fontWeight: 'medium',
  textTransform: 'none',
  borderWidth: 0,
  borderColor: '#000000',
  borderRadius: 4,
  animation: 'none'
};

// Helper function to convert style to CSS
export function flairStyleToCSS(style: FlairStyle): Record<string, string> {
  const css: Record<string, string> = {};

  // Background
  if (style.useGradient && style.gradient) {
    const stops = style.gradient.stops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (style.gradient.type === 'linear') {
      css.background = `linear-gradient(${style.gradient.angle || 0}deg, ${stops})`;
    } else {
      css.background = `radial-gradient(circle, ${stops})`;
    }
  } else if (style.backgroundColor) {
    css.backgroundColor = style.backgroundColor;
  }

  // Text
  css.color = style.textColor;
  css.fontWeight = style.fontWeight;
  css.textTransform = style.textTransform;

  // Text shadow
  if (style.textShadow) {
    const { offsetX, offsetY, blur, color, spread } = style.textShadow;
    if (spread) {
      // Multi-layer shadow for glow effect
      const shadows = [];
      for (let i = 1; i <= spread; i++) {
        shadows.push(`0 0 ${blur * i}px ${color}`);
      }
      shadows.push(`${offsetX}px ${offsetY}px ${blur}px ${color}`);
      css.textShadow = shadows.join(', ');
    } else {
      css.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
    }
  }

  // Border
  if (style.borderWidth > 0) {
    css.border = `${style.borderWidth}px solid ${style.borderColor}`;
  }
  css.borderRadius = `${style.borderRadius}px`;

  // Animation
  if (style.animation !== 'none') {
    css.animation = `flair-${style.animation} ${style.animationDuration || 2}s ease-in-out infinite`;
  }

  return css;
}

// Helper to generate gradient CSS string
export function gradientToCSS(gradient: Gradient): string {
  const stops = gradient.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle || 0}deg, ${stops})`;
  } else {
    return `radial-gradient(circle, ${stops})`;
  }
}
