export type FontFamily = 'wenkai' | 'noto' | 'mashan' | 'zcool' | 'playfair' | 'sans' | 'huangyou' | 'longcang' | 'zhimang';
export type GradientType = 'none' | 'linear-to-b' | 'linear-to-r' | 'linear-to-br' | 'radial';
export type AspectRatio = 'portrait' | 'square' | 'landscape';
export type TextAlign = 'left' | 'center' | 'right' | 'vertical-rl';
export type EffectType = 'none' | 'snow' | 'rain' | 'sparkles' | 'orbs' | 'grain';

export interface Position {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
}

export interface Sticker {
  id: string;
  content: string; // Emoji or image URL
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  scale: number;
  rotation: number;
}

export interface CardState {
  // Content
  text: string;
  author: string;
  date: string;
  
  // Positioning (New)
  textPos: Position;
  authorPos: Position;
  datePos: Position;
  
  // Appearance
  fontFamily: FontFamily;
  fontSize: number;
  fontColor: string;
  textAlign: TextAlign;
  fontWeight: 'normal' | 'bold';
  lineHeight: number;
  
  // Background
  bgColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  bgGradientType: GradientType;
  bgImage: string | null; // Data URL
  bgBlur: number;
  bgOverlayOpacity: number;
  bgOverlayColor: string;
  noise: boolean;
  effect: EffectType; // New field for dynamic effects
  
  // Layout
  aspectRatio: AspectRatio;
  padding: number; // Used for max-width constraint now
  
  // Border
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double';

  // Decor
  stickers: Sticker[];
}

export interface Template {
  id: string;
  name: string;
  previewColor: string;
  state: Partial<CardState>;
}

export interface LayoutPreset {
  id: string;
  name: string;
  icon: any;
  state: Partial<CardState>;
}