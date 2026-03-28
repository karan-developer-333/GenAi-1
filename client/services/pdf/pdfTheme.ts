export const pdfTheme = {
  colors: {
    primary: '#2655C7',
    primaryLight: '#3A6BD4',
    primaryDark: '#1A3D8F',
    accent: '#539AE9',
    accentLight: '#7BB3F0',
    accentDark: '#3A7BC8',
    
    background: {
      light: '#F5F8FF',
      dark: '#010419',
      card: '#EEF3FF',
      cardDark: 'rgba(9, 21, 60, 0.6)',
    },
    
    foreground: {
      light: '#09153C',
      dark: '#FFFFFF',
    },
    
    text: {
      primary: '#09153C',
      secondary: '#4B6C8F',
      muted: '#7A8BA3',
      accent: '#539AE9',
      inverse: '#FFFFFF',
    },
    
    border: {
      light: 'rgba(21, 48, 129, 0.12)',
      dark: 'rgba(83, 154, 233, 0.15)',
      accent: 'rgba(83, 154, 233, 0.3)',
    },
    
    gold: '#B08D57',
    goldLight: '#E8D9B8',
    
    gradients: {
      primary: 'linear-gradient(135deg, #2655C7 0%, #539AE9 100%)',
      accent: 'linear-gradient(135deg, #539AE9 0%, #7BB3F0 100%)',
      dark: 'linear-gradient(135deg, #010419 0%, #09153C 100%)',
      mesh: 'radial-gradient(at 0% 0%, rgba(38, 85, 199, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(83, 154, 233, 0.15) 0px, transparent 50%)',
    },
  },
  
  typography: {
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace',
      serif: 'Georgia, Times New Roman, serif',
    },
    
    sizes: {
      hero: 48,
      h1: 36,
      h2: 28,
      h3: 22,
      h4: 18,
      body: 11,
      caption: 9,
      small: 7,
    },
    
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
  },
  
  layout: {
    page: {
      width: 595.28,
      height: 841.89,
      margin: {
        horizontal: 50,
        vertical: 45,
        top: 60,
        bottom: 50,
      },
    },
    
    grid: {
      columns: 12,
      gap: 20,
    },
    
    breakpoints: {
      sm: 400,
      md: 600,
      lg: 800,
    },
  },
  
  effects: {
    shadow: {
      light: '0 2px 8px rgba(9, 21, 60, 0.08)',
      medium: '0 4px 16px rgba(9, 21, 60, 0.12)',
      heavy: '0 8px 32px rgba(9, 21, 60, 0.16)',
    },
    
    glow: {
      primary: '0 0 20px rgba(38, 85, 199, 0.3)',
      accent: '0 0 30px rgba(83, 154, 233, 0.4)',
    },
  },
};

export const getThemeColors = (isDark: boolean = false) => {
  return {
    background: isDark ? pdfTheme.colors.background.dark : pdfTheme.colors.background.light,
    foreground: isDark ? pdfTheme.colors.foreground.dark : pdfTheme.colors.foreground.light,
    primary: pdfTheme.colors.primary,
    accent: pdfTheme.colors.accent,
    text: isDark ? pdfTheme.colors.text.inverse : pdfTheme.colors.text.primary,
    textSecondary: pdfTheme.colors.text.secondary,
    textMuted: pdfTheme.colors.text.muted,
    border: isDark ? pdfTheme.colors.border.dark : pdfTheme.colors.border.light,
    card: isDark ? pdfTheme.colors.background.cardDark : pdfTheme.colors.background.card,
  };
};

export const formatExportDate = () => {
  const now = new Date();
  return {
    full: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    short: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    month: now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase(),
    year: now.getFullYear(),
    iso: now.toISOString().split('T')[0],
  };
};

export const formatReadingTime = (text: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export const formatItemDate = (timestamp: string): string => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const cleanText = (text: string | null, maxChars?: number): string => {
  if (!text) return '';
  const cleaned = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (maxChars && cleaned.length > maxChars) {
    return cleaned.substring(0, maxChars).trimEnd() + '…';
  }
  return cleaned;
};

export const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url.substring(0, 30);
  }
};

export const isYouTubeUrl = (url: string): { isVideo: boolean; videoId: string | null } => {
  if (!url) return { isVideo: false, videoId: null };
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { isVideo: true, videoId: match[1] };
    }
  }
  
  return { isVideo: false, videoId: null };
};
