import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';
import {
  Type,
  Palette,
  Layout,
  Image as ImageIcon,
  Download,
  Share2,
  Sparkles,
  RotateCcw,
  Move,
  Plus,
  Trash2,
  Sticker as StickerIcon,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  Camera,
  X,
  Maximize,
  Columns,
  RefreshCw,
  Dice5,
  MessageSquareQuote,
  CloudRain,
  Snowflake,
  CircleDashed,
  Zap,
  Settings
} from 'lucide-react';
import { CardState, FontFamily, Sticker, Template, GradientType, AspectRatio, TextAlign, LayoutPreset, EffectType } from './types';
import { AIProviderService } from './services/ai-provider.service';
import { SettingsModal } from './components/SettingsModal';

// --- Constants & Data ---

const INITIAL_STATE: CardState = {
  text: "生活原本沉闷，\n但跑起来就有风。",
  author: "— 佚名",
  date: new Date().toLocaleDateString('zh-CN'),
  
  // Default positions (Center)
  textPos: { x: 50, y: 45 },
  authorPos: { x: 50, y: 65 },
  datePos: { x: 50, y: 70 },

  fontFamily: 'wenkai',
  fontSize: 24,
  fontColor: '#333333',
  textAlign: 'center',
  fontWeight: 'normal',
  lineHeight: 1.8,
  bgColor: '#ffffff',
  bgGradientStart: '#ffffff',
  bgGradientEnd: '#f3f4f6',
  bgGradientType: 'none',
  bgImage: null,
  bgBlur: 0,
  bgOverlayOpacity: 0,
  bgOverlayColor: '#000000',
  noise: true,
  effect: 'none',
  aspectRatio: 'portrait',
  padding: 40,
  borderWidth: 0,
  borderColor: '#000000',
  borderRadius: 0,
  borderStyle: 'solid',
  stickers: []
};

const FONTS: { label: string; value: FontFamily; class: string }[] = [
  { label: '霞鹜文楷', value: 'wenkai', class: 'font-wenkai' },
  { label: '庆科黄油', value: 'huangyou', class: 'font-huangyou' }, // New Wide Font
  { label: '龙苍草书', value: 'longcang', class: 'font-longcang' }, // New
  { label: '志莽行书', value: 'zhimang', class: 'font-zhimang' }, // New
  { label: '思源宋体', value: 'noto', class: 'font-noto' },
  { label: '马善政毛笔', value: 'mashan', class: 'font-mashan' },
  { label: '站酷快乐', value: 'zcool', class: 'font-zcool' },
  { label: 'Playfair (En)', value: 'playfair', class: 'font-playfair' },
  { label: '系统黑体', value: 'sans', class: 'font-sans' },
];

const LAYOUTS: LayoutPreset[] = [
  {
    id: 'center',
    name: '居中',
    icon: AlignCenter,
    state: {
      textPos: { x: 50, y: 45 },
      authorPos: { x: 50, y: 65 },
      datePos: { x: 50, y: 70 },
      textAlign: 'center'
    }
  },
  {
    id: 'poster-bottom',
    name: '海报',
    icon: AlignLeft,
    state: {
      textPos: { x: 10, y: 80 },
      authorPos: { x: 10, y: 92 },
      datePos: { x: 90, y: 92 },
      textAlign: 'left'
    }
  },
  {
    id: 'vertical-classic',
    name: '古风',
    icon: AlignVerticalJustifyCenter,
    state: {
      textPos: { x: 80, y: 50 },
      authorPos: { x: 20, y: 80 },
      datePos: { x: 20, y: 85 },
      textAlign: 'vertical-rl'
    }
  },
  {
    id: 'cinematic',
    name: '字幕',
    icon: Columns,
    state: {
      textPos: { x: 50, y: 85 },
      authorPos: { x: 50, y: 95 },
      datePos: { x: 50, y: 10 },
      textAlign: 'center'
    }
  },
  {
    id: 'magazine',
    name: '杂志',
    icon: Grid,
    state: {
      textPos: { x: 15, y: 20 },
      authorPos: { x: 85, y: 85 },
      datePos: { x: 15, y: 10 },
      textAlign: 'left'
    }
  }
];

const TEMPLATES: Template[] = [
  {
    id: 'simple-white',
    name: '极简白',
    previewColor: '#ffffff',
    state: {
      bgColor: '#ffffff',
      fontColor: '#333333',
      fontFamily: 'noto',
      textAlign: 'center',
      borderWidth: 0,
      noise: false,
      effect: 'none',
      textPos: { x: 50, y: 45 },
      authorPos: { x: 50, y: 65 },
      bgGradientType: 'none'
    }
  },
  {
    id: 'dreamy-cloud',
    name: '梦幻云彩',
    previewColor: '#e0c3fc',
    state: {
      bgColor: '#ffffff',
      fontColor: '#4a044e',
      fontFamily: 'huangyou',
      textAlign: 'center',
      effect: 'orbs',
      bgGradientType: 'none',
      textPos: { x: 50, y: 50 },
      authorPos: { x: 50, y: 75 },
    }
  },
  {
    id: 'winter-snow',
    name: '冬日雪景',
    previewColor: '#1e293b',
    state: {
      bgColor: '#0f172a',
      bgGradientStart: '#0f172a',
      bgGradientEnd: '#334155',
      bgGradientType: 'linear-to-b',
      fontColor: '#f8fafc',
      fontFamily: 'noto',
      textAlign: 'center',
      effect: 'snow',
      textPos: { x: 50, y: 45 },
      authorPos: { x: 50, y: 65 },
    }
  },
  {
    id: 'magic-sparkle',
    name: '魔法星尘',
    previewColor: '#4c1d95',
    state: {
      bgColor: '#2e1065',
      bgGradientStart: '#2e1065',
      bgGradientEnd: '#4c1d95',
      bgGradientType: 'radial',
      fontColor: '#e9d5ff',
      fontFamily: 'zcool',
      textAlign: 'center',
      effect: 'sparkles',
      textPos: { x: 50, y: 50 },
      stickers: []
    }
  },
  {
    id: 'dark-mood',
    name: '暗夜',
    previewColor: '#1a1a1a',
    state: {
      bgColor: '#1a1a1a',
      fontColor: '#e5e5e5',
      fontFamily: 'wenkai',
      textAlign: 'left',
      noise: true,
      effect: 'none',
      textPos: { x: 15, y: 40 },
      authorPos: { x: 15, y: 60 },
      bgGradientType: 'none'
    }
  },
  {
    id: 'peach',
    name: '蜜桃',
    previewColor: '#ffecd2',
    state: {
      bgColor: '#ffecd2',
      bgGradientStart: '#ffecd2',
      bgGradientEnd: '#fcb69f',
      bgGradientType: 'linear-to-br',
      fontColor: '#5d4037',
      fontFamily: 'zcool',
      textAlign: 'center',
      borderRadius: 12,
      effect: 'none',
      textPos: { x: 50, y: 50 },
      authorPos: { x: 50, y: 70 },
    }
  },
  {
    id: 'film',
    name: '电影感',
    previewColor: '#000000',
    state: {
      bgColor: '#000000',
      fontColor: '#ffeb3b',
      fontFamily: 'noto',
      textAlign: 'center',
      aspectRatio: 'landscape',
      bgImage: null, 
      bgOverlayOpacity: 0.3,
      bgOverlayColor: '#000000',
      effect: 'grain',
      textPos: { x: 50, y: 80 },
      authorPos: { x: 50, y: 92 },
    }
  },
  {
    id: 'retro-paper',
    name: '信纸',
    previewColor: '#fdfbf7',
    state: {
      bgColor: '#fdfbf7',
      fontColor: '#4a4a4a',
      fontFamily: 'wenkai',
      textAlign: 'vertical-rl',
      borderWidth: 1,
      borderColor: '#d1d5db',
      noise: true,
      effect: 'none',
      textPos: { x: 75, y: 50 },
      authorPos: { x: 25, y: 80 },
    }
  },
  {
    id: 'polaroid',
    name: '拍立得',
    previewColor: '#ffffff',
    state: {
      bgColor: '#ffffff',
      fontColor: '#222222',
      fontFamily: 'playfair',
      textAlign: 'center',
      aspectRatio: 'portrait',
      borderWidth: 0,
      bgGradientType: 'none',
      effect: 'none',
      textPos: { x: 50, y: 45 },
      stickers: []
    }
  },
  {
    id: 'stamp',
    name: '红印',
    previewColor: '#ef4444',
    state: {
      bgColor: '#fff1f2',
      fontColor: '#991b1b',
      borderColor: '#991b1b',
      borderWidth: 4,
      borderRadius: 0,
      borderStyle: 'double',
      fontFamily: 'mashan',
      textAlign: 'center',
      effect: 'none',
      textPos: { x: 50, y: 50 },
    }
  },
  {
    id: 'nature',
    name: '森系',
    previewColor: '#dcfce7',
    state: {
      bgColor: '#f0fdf4',
      bgGradientStart: '#f0fdf4',
      bgGradientEnd: '#bbf7d0',
      bgGradientType: 'linear-to-b',
      fontColor: '#14532d',
      fontFamily: 'wenkai',
      textAlign: 'left',
      noise: true,
      effect: 'none',
      textPos: { x: 20, y: 30 },
      authorPos: { x: 20, y: 60 },
    }
  },
];

const STICKER_PRESETS = [
  '✨', '💫', '🌟', '🌙', '☀️', '☁️', '🌸', '🌹', '🌿', '🍃', 
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', 
  '☕', '🍵', '📚', '🎵', '🎨', '📷', '🚲', '✈️',
  '❝', '❞', '『', '』', '「', '」'
];

// --- Helpers ---

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// --- Effects Component ---

const EffectLayer = ({ type, width, height }: { type: EffectType; width: number; height: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas-based particles (Snow, Rain, Sparkles)
  useEffect(() => {
    if (type === 'none' || type === 'orbs' || type === 'grain') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas
    canvas.width = width;
    canvas.height = height;

    let particles: any[] = [];
    const particleCount = type === 'rain' ? 80 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 2 + 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      
      particles.forEach(p => {
        ctx.beginPath();
        if (type === 'rain') {
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + 15);
          ctx.stroke();
          p.y += p.speed * 4;
          p.x -= 0.5;
        } else if (type === 'sparkles') {
           ctx.fillStyle = `rgba(255, 255, 200, ${p.opacity * Math.abs(Math.sin(Date.now() / 500 + p.x))})`;
           // Draw star shape roughly
           ctx.save();
           ctx.translate(p.x, p.y);
           ctx.rotate(Date.now() / 1000 + p.x);
           ctx.fillRect(-p.radius, -p.radius/4, p.radius*2, p.radius/2);
           ctx.fillRect(-p.radius/4, -p.radius, p.radius/2, p.radius*2);
           ctx.restore();
           // Slow float
           p.y -= 0.1; 
        } else {
          // Snow
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += Math.sin(p.y / 50);
        }

        // Reset
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < -15) p.y = height;
      });

      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [type, width, height]);

  // CSS-based effects (Orbs)
  if (type === 'orbs') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    );
  }

  // Grain is handled by CSS class, but we can enforce overlay here if needed.
  if (type === 'grain') {
     return <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none mix-blend-overlay"></div>
  }

  // Canvas fallback
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

// --- Main App Component ---

const App = () => {
  const [cardState, setCardState] = useState<CardState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'decor' | 'templates'>('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHitokotoLoading, setIsHitokotoLoading] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 300, height: 400 });
  const [showSettings, setShowSettings] = useState(false);

  const aiService = new AIProviderService();
  
  // Dragging State
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number, y: number, initialPos: { x: number, y: number } } | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview size for canvas
  useEffect(() => {
    if (previewRef.current) {
      const { clientWidth, clientHeight } = previewRef.current;
      setPreviewSize({ width: clientWidth, height: clientHeight });
    }
  }, [cardState.aspectRatio, cardState.borderRadius]); // Recalculate when size might change

  const updateState = (updates: Partial<CardState>) => {
    setCardState(prev => ({ ...prev, ...updates }));
  };

  const handleGenerateText = async () => {
    setIsGenerating(true);
    try {
      const prompt = "Generate a short, aesthetic, emotional or inspirational sentence in Chinese, max 20 words. Optionally include a matching author name or 'Unknown'. Return ONLY the sentence on the first line and the author on the second line.";

      const response = await aiService.generateText(prompt);

      if (response.error) {
        alert(`AI 生成失败: ${response.error}`);
        return;
      }

      const text = response.text || "";
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length > 0) {
        updateState({
          text: lines[0],
          author: lines.length > 1 ? lines[1] : '— AI 生成'
        });
      }
    } catch (error) {
      console.error("Failed to generate text", error);
      alert("AI 生成失败，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchHitokoto = async () => {
    setIsHitokotoLoading(true);
    try {
      const res = await fetch('https://v1.hitokoto.cn');
      const data = await res.json();
      updateState({
        text: data.hitokoto,
        author: `— ${data.from_who || data.from || '佚名'}`
      });
    } catch (e) {
      console.error(e);
      alert("获取一言失败");
    } finally {
      setIsHitokotoLoading(false);
    }
  };

  const handleRandomStyle = () => {
    const randomLayout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
    const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)].value;
    const isDarkTheme = Math.random() > 0.5;
    
    const bgHue = Math.floor(Math.random() * 360);
    const bgSat = Math.floor(Math.random() * 40) + 10;
    const bgLight = isDarkTheme ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 10) + 88;
    const bgColor = hslToHex(bgHue, bgSat, bgLight);

    const textHue = (bgHue + 180) % 360; 
    const textSat = Math.floor(Math.random() * 20); 
    const textLight = isDarkTheme ? 90 : 15;
    const fontColor = hslToHex(textHue, textSat, textLight);
    
    const hasBorder = Math.random() > 0.6;
    const borderWidth = hasBorder ? Math.floor(Math.random() * 8) + 1 : 0;
    const borderRadius = Math.floor(Math.random() * 30);
    const borderColor = fontColor;
    const effects: EffectType[] = ['none', 'snow', 'rain', 'sparkles', 'orbs', 'grain'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];

    updateState({
      ...randomLayout.state,
      fontFamily: randomFont,
      bgColor,
      fontColor,
      borderColor,
      borderWidth,
      borderRadius,
      bgGradientType: 'none',
      bgImage: null,
      noise: Math.random() > 0.3,
      effect: randomEffect
    });
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;

    const isDownloading = (window as any).__isDownloading;
    if (isDownloading) return;
    (window as any).__isDownloading = true;

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        fetchRequestInit: { mode: 'cors' }
      });

      const link = document.createElement('a');
      link.download = `mood-card-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
      alert("导出失败，请重试 (可尝试截图保存)");
    } finally {
      setTimeout(() => {
        (window as any).__isDownloading = false;
      }, 1000);
    }
  };

  const handleShare = async () => {
     if (!previewRef.current) return;

     const isSharing = (window as any).__isSharing;
     if (isSharing) return;
     (window as any).__isSharing = true;

     try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        fetchRequestInit: { mode: 'cors' }
      });
      const blob = await (await fetch(dataUrl)).blob();

      const file = new File([blob], "mood-card.png", { type: "image/png" });
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: 'Mood Card',
            text: 'Check out this card I made!'
          });
        } catch (err) {
          console.log("Share canceled or failed", err);
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mood-card.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("浏览器不支持直接分享，已为您下载图片。您可以手动分享到微信/微博/QQ。");
      }
     } catch (e) {
       console.error(e);
     } finally {
       setTimeout(() => {
         (window as any).__isSharing = false;
       }, 1000);
     }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateState({ bgImage: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Sticker Logic ---
  const addSticker = (content: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      content,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    updateState({ stickers: [...cardState.stickers, newSticker] });
  };

  const removeSticker = (id: string) => {
    updateState({
      stickers: cardState.stickers.filter(s => s.id !== id)
    });
  };

  const applyTemplate = (template: Template) => {
    const { text, author, date, ...restState } = template.state;
    updateState(restState);
  };

  const applyLayout = (layout: LayoutPreset) => {
    updateState(layout.state);
  };

  // --- Dragging Logic ---

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, id: string, type: 'text' | 'author' | 'date' | 'sticker') => {
    e.stopPropagation(); // Prevent card dragging
    
    // Get client coordinates
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    let initialPos = { x: 0, y: 0 };
    if (type === 'text') initialPos = cardState.textPos;
    else if (type === 'author') initialPos = cardState.authorPos;
    else if (type === 'date') initialPos = cardState.datePos;
    else if (type === 'sticker') {
      const s = cardState.stickers.find(st => st.id === id);
      if (s) initialPos = { x: s.x, y: s.y };
    }

    setDraggingId(id);
    dragStartRef.current = { x: clientX, y: clientY, initialPos };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingId || !dragStartRef.current || !previewRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const rect = previewRef.current.getBoundingClientRect();
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // Convert pixels to percentage
    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    const newX = Math.min(100, Math.max(0, dragStartRef.current.initialPos.x + deltaXPercent));
    const newY = Math.min(100, Math.max(0, dragStartRef.current.initialPos.y + deltaYPercent));

    if (draggingId === 'text') updateState({ textPos: { x: newX, y: newY } });
    else if (draggingId === 'author') updateState({ authorPos: { x: newX, y: newY } });
    else if (draggingId === 'date') updateState({ datePos: { x: newX, y: newY } });
    else {
      // Sticker
      updateState({
        stickers: cardState.stickers.map(s => s.id === draggingId ? { ...s, x: newX, y: newY } : s)
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    dragStartRef.current = null;
  };

  // --- Rendering Helpers ---

  const getFontClass = (f: FontFamily) => FONTS.find(font => font.value === f)?.class || 'font-sans';

  const getBackgroundStyle = () => {
    const { bgImage, bgColor, bgGradientStart, bgGradientEnd, bgGradientType } = cardState;
    
    if (bgImage) {
      return { 
        backgroundColor: bgColor,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }

    if (bgGradientType === 'none') {
      return { backgroundColor: bgColor };
    }
    
    let gradient = '';
    switch (bgGradientType) {
      case 'linear-to-b': gradient = `linear-gradient(to bottom, ${bgGradientStart}, ${bgGradientEnd})`; break;
      case 'linear-to-r': gradient = `linear-gradient(to right, ${bgGradientStart}, ${bgGradientEnd})`; break;
      case 'linear-to-br': gradient = `linear-gradient(to bottom right, ${bgGradientStart}, ${bgGradientEnd})`; break;
      case 'radial': gradient = `radial-gradient(circle, ${bgGradientStart}, ${bgGradientEnd})`; break;
    }
    return { background: gradient };
  };

  const getAspectRatioClasses = () => {
    switch (cardState.aspectRatio) {
      case 'square': return 'aspect-square w-full max-w-[400px]';
      case 'landscape': return 'aspect-[16/9] w-full max-w-[500px]';
      case 'portrait': return 'aspect-[3/4] w-full max-w-[380px]';
      default: return 'aspect-[3/4] w-full max-w-[380px]';
    }
  };

  const getTextWritingMode = () => {
    return cardState.textAlign === 'vertical-rl' ? { writingMode: 'vertical-rl' as any, textOrientation: 'upright' } : {};
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggingId(null);
      dragStartRef.current = null;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onConfigured={() => {}}
      />
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      
      {/* --- Left Panel: Preview --- */}
      <div 
        className="flex-1 bg-slate-200 p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
         <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none"></div>
         
         <div className="mb-6 flex gap-2">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition text-slate-700 font-medium text-sm">
              <Download size={16} /> 保存图片
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition text-white font-medium text-sm">
              <Share2 size={16} /> 分享卡片
            </button>
         </div>

         <div 
           id="card-preview"
           ref={previewRef}
           className={`relative shadow-2xl transition-all duration-300 overflow-hidden group ${getAspectRatioClasses()} ${cardState.noise ? 'bg-noise' : ''}`}
           style={{
             ...getBackgroundStyle(),
             borderRadius: `${cardState.borderRadius}px`,
             borderWidth: `${cardState.borderWidth}px`,
             borderColor: cardState.borderColor,
             borderStyle: cardState.borderStyle,
             fontFamily: getFontClass(cardState.fontFamily).split(' ')[0]
           }}
         >
           {/* Background Overlay */}
           {cardState.bgImage && (
             <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ 
                  backgroundColor: cardState.bgOverlayColor, 
                  opacity: cardState.bgOverlayOpacity 
                }} 
             />
           )}
           
           {/* Dynamic Effect Layer */}
           <EffectLayer type={cardState.effect} width={previewSize.width} height={previewSize.height} />

           {/* Draggable: Main Text */}
           <div 
             className={`absolute cursor-move hover:ring-1 hover:ring-indigo-400 hover:bg-black/5 rounded p-2 transition-colors z-10 ${getFontClass(cardState.fontFamily)}`}
             style={{
                left: `${cardState.textPos.x}%`,
                top: `${cardState.textPos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 'max-content',
                maxWidth: '90%',
                color: cardState.fontColor,
                fontSize: `${cardState.fontSize}px`,
                fontWeight: cardState.fontWeight,
                lineHeight: cardState.lineHeight,
                whiteSpace: 'pre-wrap',
                textAlign: cardState.textAlign === 'vertical-rl' ? undefined : cardState.textAlign as any,
                ...getTextWritingMode()
             }}
             onMouseDown={(e) => handleMouseDown(e, 'text', 'text')}
             onTouchStart={(e) => handleMouseDown(e, 'text', 'text')}
           >
             {cardState.text}
           </div>

           {/* Draggable: Author */}
           {cardState.author && (
              <div 
                className={`absolute cursor-move hover:ring-1 hover:ring-indigo-400 hover:bg-black/5 rounded p-2 transition-colors z-10 ${getFontClass(cardState.fontFamily)}`}
                style={{
                  left: `${cardState.authorPos.x}%`,
                  top: `${cardState.authorPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  color: cardState.fontColor,
                  opacity: 0.8,
                  fontSize: `${Math.max(12, cardState.fontSize * 0.6)}px`,
                  textAlign: 'right'
                }}
                onMouseDown={(e) => handleMouseDown(e, 'author', 'author')}
                onTouchStart={(e) => handleMouseDown(e, 'author', 'author')}
              >
                {cardState.author}
              </div>
           )}

           {/* Draggable: Date */}
           {cardState.date && (
              <div 
                className={`absolute cursor-move hover:ring-1 hover:ring-indigo-400 hover:bg-black/5 rounded p-2 transition-colors z-10 ${getFontClass(cardState.fontFamily)}`}
                style={{
                  left: `${cardState.datePos.x}%`,
                  top: `${cardState.datePos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  color: cardState.fontColor,
                  opacity: 0.7,
                  fontSize: `${Math.max(10, cardState.fontSize * 0.5)}px`
                }}
                onMouseDown={(e) => handleMouseDown(e, 'date', 'date')}
                onTouchStart={(e) => handleMouseDown(e, 'date', 'date')}
              >
                {cardState.date}
              </div>
           )}

           {/* Stickers Layer */}
           {cardState.stickers.map((sticker) => (
             <div
               key={sticker.id}
               className="absolute cursor-move select-none hover:ring-2 hover:ring-indigo-400 rounded-lg p-1 transition-shadow group/sticker z-20"
               style={{
                 left: `${sticker.x}%`,
                 top: `${sticker.y}%`,
                 transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                 fontSize: '40px'
               }}
               onMouseDown={(e) => handleMouseDown(e, sticker.id, 'sticker')}
               onTouchStart={(e) => handleMouseDown(e, sticker.id, 'sticker')}
             >
               {sticker.content}
               <button 
                 onClick={(e) => { e.stopPropagation(); removeSticker(sticker.id); }}
                 className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hidden group-hover/sticker:block shadow-sm z-10"
               >
                 <X size={10} />
               </button>
             </div>
           ))}
         </div>
         
         <p className="mt-6 text-slate-400 text-sm">
           Generated with Gemini AI • Hitokoto • MoodCard
         </p>
      </div>

      {/* --- Right Panel: Editor --- */}
      <div className="w-full md:w-[400px] bg-white border-l border-slate-200 flex flex-col h-[50vh] md:h-screen">
        {/* Header with Settings Button */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-800">Mood Card</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition"
            title="AI 配置"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button onClick={() => setActiveTab('content')} className={`flex-1 py-4 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
            <Type size={18} /> 内容
          </button>
          <button onClick={() => setActiveTab('style')} className={`flex-1 py-4 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'style' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
            <Palette size={18} /> 样式
          </button>
          <button onClick={() => setActiveTab('decor')} className={`flex-1 py-4 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'decor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
            <Sparkles size={18} /> 装饰
          </button>
          <button onClick={() => setActiveTab('templates')} className={`flex-1 py-4 text-sm font-medium flex flex-col items-center gap-1 ${activeTab === 'templates' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
            <Layout size={18} /> 模板
          </button>
        </div>

        {/* Tab Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <label className="text-sm font-medium text-slate-700">正文内容</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={fetchHitokoto}
                      disabled={isHitokotoLoading}
                      className="flex items-center gap-1 text-xs bg-emerald-500 text-white px-2 py-1 rounded-md shadow-sm hover:bg-emerald-600 disabled:opacity-50 transition"
                      title="随机获取一句一言"
                    >
                      <MessageSquareQuote size={12} /> {isHitokotoLoading ? '获取中...' : '一言'}
                    </button>
                    <button 
                      onClick={handleGenerateText}
                      disabled={isGenerating}
                      className="flex items-center gap-1 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-md shadow-sm hover:opacity-90 disabled:opacity-50 transition"
                      title="AI 生成灵感文案"
                    >
                      <Sparkles size={12} /> {isGenerating ? '思考中...' : '帮我写一句'}
                    </button>
                  </div>
                </div>
                <textarea 
                  value={cardState.text}
                  onChange={(e) => updateState({ text: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="写下你的心情..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">作者 / 落款</label>
                  <input 
                    type="text" 
                    value={cardState.author}
                    onChange={(e) => updateState({ author: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">日期</label>
                   <input 
                    type="text" 
                    value={cardState.date}
                    onChange={(e) => updateState({ date: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

               {/* New Layout Section in Content */}
               <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1"><Layout size={14} /> 快速排版</label>
                <div className="grid grid-cols-5 gap-2">
                  {LAYOUTS.map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => applyLayout(layout)}
                      className="flex flex-col items-center gap-1 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-300 transition"
                      title={layout.name}
                    >
                       <layout.icon size={18} className="text-slate-600" />
                       <span className="text-[10px] text-slate-500">{layout.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">提示：卡片上的文字和装饰都可以直接拖拽移动哦！</p>
              </div>
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              
              {/* Random Style Button */}
              <button 
                onClick={handleRandomStyle}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg shadow hover:opacity-90 transition font-medium text-sm"
              >
                <Dice5 size={16} /> 随机生成样式
              </button>

              {/* Fonts */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">字体</label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map(font => (
                    <button
                      key={font.value}
                      onClick={() => updateState({ fontFamily: font.value })}
                      className={`p-2 text-sm border rounded-md transition ${cardState.fontFamily === font.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'} ${font.class}`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">颜色</label>
                <div className="grid grid-cols-3 gap-2">
                   <div>
                     <span className="text-xs text-slate-500 block mb-1">文字</span>
                     <div className="flex gap-2">
                        <input type="color" value={cardState.fontColor} onChange={(e) => updateState({ fontColor: e.target.value })} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                        <span className="text-xs self-center text-slate-400">{cardState.fontColor}</span>
                     </div>
                   </div>
                   <div>
                     <span className="text-xs text-slate-500 block mb-1">背景</span>
                     <div className="flex gap-2">
                        <input type="color" value={cardState.bgColor} onChange={(e) => updateState({ bgColor: e.target.value })} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                        <span className="text-xs self-center text-slate-400">{cardState.bgColor}</span>
                     </div>
                   </div>
                   <div>
                     <span className="text-xs text-slate-500 block mb-1">边框</span>
                     <div className="flex gap-2">
                        <input type="color" value={cardState.borderColor} onChange={(e) => updateState({ borderColor: e.target.value })} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                     </div>
                   </div>
                </div>
              </div>

               {/* Background Gradient */}
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">背景渐变</label>
                <div className="flex flex-wrap gap-2">
                  {(['none', 'linear-to-b', 'linear-to-r', 'linear-to-br', 'radial'] as GradientType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => updateState({ bgGradientType: type })}
                      className={`px-3 py-1 text-xs border rounded-full ${cardState.bgGradientType === type ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600'}`}
                    >
                      {type === 'none' ? '无' : type.replace('linear-', '').replace('radial', '圆心')}
                    </button>
                  ))}
                </div>
                {cardState.bgGradientType !== 'none' && (
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">起</span>
                      <input type="color" value={cardState.bgGradientStart} onChange={(e) => updateState({ bgGradientStart: e.target.value })} className="h-6 w-6 rounded border-0 p-0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">止</span>
                      <input type="color" value={cardState.bgGradientEnd} onChange={(e) => updateState({ bgGradientEnd: e.target.value })} className="h-6 w-6 rounded border-0 p-0" />
                    </div>
                  </div>
                )}
              </div>

              {/* Layout Controls */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">对齐方式 (文本内)</label>
                  <div className="flex bg-slate-100 p-1 rounded-md">
                    <button onClick={() => updateState({ textAlign: 'left' })} className={`p-1 rounded ${cardState.textAlign === 'left' ? 'bg-white shadow-sm' : ''}`}><AlignLeft size={16} /></button>
                    <button onClick={() => updateState({ textAlign: 'center' })} className={`p-1 rounded ${cardState.textAlign === 'center' ? 'bg-white shadow-sm' : ''}`}><AlignCenter size={16} /></button>
                    <button onClick={() => updateState({ textAlign: 'right' })} className={`p-1 rounded ${cardState.textAlign === 'right' ? 'bg-white shadow-sm' : ''}`}><AlignRight size={16} /></button>
                    <button onClick={() => updateState({ textAlign: 'vertical-rl' })} className={`p-1 rounded ${cardState.textAlign === 'vertical-rl' ? 'bg-white shadow-sm' : ''}`}><AlignVerticalJustifyCenter size={16} className="rotate-90" /></button>
                  </div>
                </div>

                <div>
                   <label className="text-sm font-medium text-slate-700 flex justify-between">字体大小 <span>{cardState.fontSize}px</span></label>
                   <input type="range" min="12" max="80" value={cardState.fontSize} onChange={(e) => updateState({ fontSize: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                </div>
                
                <div>
                   <label className="text-sm font-medium text-slate-700 flex justify-between">圆角 <span>{cardState.borderRadius}px</span></label>
                   <input type="range" min="0" max="50" value={cardState.borderRadius} onChange={(e) => updateState({ borderRadius: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                </div>

                <div>
                   <label className="text-sm font-medium text-slate-700 flex justify-between">边框宽度 <span>{cardState.borderWidth}px</span></label>
                   <input type="range" min="0" max="20" value={cardState.borderWidth} onChange={(e) => updateState({ borderWidth: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                </div>
              </div>
            </div>
          )}

          {/* DECOR TAB */}
          {activeTab === 'decor' && (
            <div className="space-y-6">
              
              {/* Dynamic Effects */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">动态特效 & 滤镜</label>
                <div className="grid grid-cols-3 gap-2">
                   {[
                     { id: 'none', name: '无', icon: X },
                     { id: 'snow', name: '下雪', icon: Snowflake },
                     { id: 'rain', name: '下雨', icon: CloudRain },
                     { id: 'sparkles', name: '星光', icon: Zap },
                     { id: 'orbs', name: '流光', icon: CircleDashed },
                     { id: 'grain', name: '胶片', icon: Camera },
                   ].map(eff => (
                     <button
                       key={eff.id}
                       onClick={() => updateState({ effect: eff.id as EffectType })}
                       className={`flex flex-col items-center gap-1 p-2 border rounded-md text-xs transition ${cardState.effect === eff.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}
                     >
                        <eff.icon size={16} />
                        {eff.name}
                     </button>
                   ))}
                </div>
              </div>

              {/* Background Image */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-sm font-medium text-slate-700">背景图片</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-400 hover:bg-indigo-50 transition"
                  >
                    <Camera size={20} className="mb-2" />
                    <span className="text-xs">上传图片</span>
                  </button>
                  {cardState.bgImage && (
                    <button 
                      onClick={() => updateState({ bgImage: null })}
                      className="w-12 border border-slate-200 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                {cardState.bgImage && (
                  <div className="pt-2">
                     <label className="text-xs text-slate-500 flex justify-between">遮罩浓度 <span>{Math.round(cardState.bgOverlayOpacity * 100)}%</span></label>
                     <input type="range" min="0" max="1" step="0.1" value={cardState.bgOverlayOpacity} onChange={(e) => updateState({ bgOverlayOpacity: parseFloat(e.target.value) })} className="w-full accent-indigo-600" />
                  </div>
                )}
              </div>

              {/* Noise Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">颗粒质感 (Noise)</label>
                <button 
                  onClick={() => updateState({ noise: !cardState.noise })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${cardState.noise ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cardState.noise ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

               {/* Ratio */}
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">卡片比例</label>
                <div className="grid grid-cols-3 gap-2">
                   {(['portrait', 'square', 'landscape'] as AspectRatio[]).map(ratio => (
                     <button
                       key={ratio}
                       onClick={() => updateState({ aspectRatio: ratio })}
                       className={`py-2 text-xs border rounded-md ${cardState.aspectRatio === ratio ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200'}`}
                     >
                       {ratio === 'portrait' ? '3:4' : ratio === 'square' ? '1:1' : '16:9'}
                     </button>
                   ))}
                </div>
              </div>

              {/* Stickers */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-sm font-medium text-slate-700">添加贴纸</label>
                <div className="grid grid-cols-6 gap-2">
                  {STICKER_PRESETS.map(s => (
                    <button
                      key={s}
                      onClick={() => addSticker(s)}
                      className="aspect-square flex items-center justify-center text-xl hover:bg-slate-100 rounded transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-500 transition text-left"
                >
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: template.previewColor }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm">
                    <span className="text-xs font-medium text-slate-800">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);