import { pdfTheme } from './pdfTheme';

export const svgComponents = {
  logo: `
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2655C7"/>
          <stop offset="100%" style="stop-color:#539AE9"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" fill="url(#logoGradient)" opacity="0.9"/>
      <path d="M14 20 L20 14 L26 20 L20 26 Z" fill="white"/>
      <circle cx="20" cy="20" r="4" fill="white"/>
      <text x="45" y="26" font-family="Poppins, sans-serif" font-size="18" font-weight="600" fill="#09153C">MNEMOAI</text>
    </svg>
  `,
  
  logoDark: `
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#539AE9"/>
          <stop offset="100%" style="stop-color:#7BB3F0"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" fill="url(#logoGradientDark)" opacity="0.9"/>
      <path d="M14 20 L20 14 L26 20 L20 26 Z" fill="white"/>
      <circle cx="20" cy="20" r="4" fill="white"/>
      <text x="45" y="26" font-family="Poppins, sans-serif" font-size="18" font-weight="600" fill="white">MNEMOAI</text>
    </svg>
  `,
  
  decorativeCircle: (size: number = 200, opacity: number = 0.1) => `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 5}" stroke="url(#circleGradient)" stroke-width="2" fill="none" opacity="${opacity}"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/3}" stroke="#539AE9" stroke-width="1" fill="none" opacity="${opacity * 0.7}"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/4}" stroke="#2655C7" stroke-width="1" fill="none" opacity="${opacity * 0.5}"/>
      <defs>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2655C7"/>
          <stop offset="100%" style="stop-color:#539AE9"/>
        </linearGradient>
      </defs>
    </svg>
  `,
  
  neuralNetwork: `
    <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#539AE9;stop-opacity:0.8"/>
          <stop offset="100%" style="stop-color:#2655C7;stop-opacity:0.6"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Input Layer -->
      <circle cx="50" cy="40" r="8" fill="url(#nodeGradient)" filter="url(#glow)"/>
      <circle cx="50" cy="100" r="8" fill="url(#nodeGradient)" filter="url(#glow)"/>
      <circle cx="50" cy="160" r="8" fill="url(#nodeGradient)" filter="url(#glow)"/>
      
      <!-- Hidden Layer 1 -->
      <circle cx="150" cy="50" r="10" fill="url(#nodeGradient)" filter="url(#glow)"/>
      <circle cx="150" cy="100" r="10" fill="url(#nodeGradient)" filter="url(#glow)"/>
      <circle cx="150" cy="150" r="10" fill="url(#nodeGradient)" filter="url(#glow)"/>
      
      <!-- Hidden Layer 2 -->
      <circle cx="220" cy="75" r="8" fill="url(#nodeGradient)" filter="url(#glow)"/>
      <circle cx="220" cy="125" r="8" fill="url(#nodeGradient)" filter="url(#glow)"/>
      
      <!-- Output Layer -->
      <circle cx="280" cy="100" r="12" fill="url(#nodeGradient)" filter="url(#glow)"/>
      
      <!-- Connections -->
      <g stroke="#539AE9" stroke-width="0.5" opacity="0.4">
        <line x1="58" y1="40" x2="140" y2="50"/>
        <line x1="58" y1="40" x2="140" y2="100"/>
        <line x1="58" y1="100" x2="140" y2="50"/>
        <line x1="58" y1="100" x2="140" y2="100"/>
        <line x1="58" y1="100" x2="140" y2="150"/>
        <line x1="58" y1="160" x2="140" y2="100"/>
        <line x1="58" y1="160" x2="140" y2="150"/>
        
        <line x1="160" y1="50" x2="212" y2="75"/>
        <line x1="160" y1="50" x2="212" y2="125"/>
        <line x1="160" y1="100" x2="212" y2="75"/>
        <line x1="160" y1="100" x2="212" y2="125"/>
        <line x1="160" y1="150" x2="212" y2="75"/>
        <line x1="160" y1="150" x2="212" y2="125"/>
        
        <line x1="228" y1="75" x2="268" y2="100"/>
        <line x1="228" y1="125" x2="268" y2="100"/>
      </g>
    </svg>
  `,
  
  knowledgeGraph: `
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#539AE9;stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:#539AE9;stop-opacity:0"/>
        </radialGradient>
      </defs>
      
      <!-- Connection lines -->
      <g stroke="#539AE9" stroke-width="1" opacity="0.3">
        <line x1="100" y1="100" x2="40" y2="50"/>
        <line x1="100" y1="100" x2="160" y2="40"/>
        <line x1="100" y1="100" x2="170" y2="120"/>
        <line x1="100" y1="100" x2="140" y2="170"/>
        <line x1="100" y1="100" x2="50" y2="160"/>
        <line x1="100" y1="100" x2="30" y2="100"/>
      </g>
      
      <!-- Outer nodes -->
      <circle cx="40" cy="50" r="15" fill="url(#nodeGlow)"/>
      <circle cx="40" cy="50" r="6" fill="#2655C7"/>
      
      <circle cx="160" cy="40" r="12" fill="url(#nodeGlow)"/>
      <circle cx="160" cy="40" r="5" fill="#539AE9"/>
      
      <circle cx="170" cy="120" r="18" fill="url(#nodeGlow)"/>
      <circle cx="170" cy="120" r="7" fill="#2655C7"/>
      
      <circle cx="140" cy="170" r="14" fill="url(#nodeGlow)"/>
      <circle cx="140" cy="170" r="5" fill="#539AE9"/>
      
      <circle cx="50" cy="160" r="10" fill="url(#nodeGlow)"/>
      <circle cx="50" cy="160" r="4" fill="#2655C7"/>
      
      <circle cx="30" cy="100" r="12" fill="url(#nodeGlow)"/>
      <circle cx="30" cy="100" r="5" fill="#539AE9"/>
      
      <!-- Center node (larger) -->
      <circle cx="100" cy="100" r="30" fill="url(#nodeGlow)"/>
      <circle cx="100" cy="100" r="20" fill="rgba(38, 85, 199, 0.3)"/>
      <circle cx="100" cy="100" r="12" fill="#2655C7"/>
    </svg>
  `,
  
  abstractShapes: `
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shapeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2655C7;stop-opacity:0.1"/>
          <stop offset="100%" style="stop-color:#539AE9;stop-opacity:0.05"/>
        </linearGradient>
        <linearGradient id="shapeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#539AE9;stop-opacity:0.15"/>
          <stop offset="100%" style="stop-color:#2655C7;stop-opacity:0.08"/>
        </linearGradient>
      </defs>
      
      <!-- Abstract geometric shapes -->
      <polygon points="50,250 150,250 100,150" fill="url(#shapeGrad1)" stroke="#539AE9" stroke-width="1" opacity="0.5"/>
      <polygon points="300,50 380,120 220,120" fill="url(#shapeGrad2)" stroke="#2655C7" stroke-width="1" opacity="0.4"/>
      
      <rect x="280" y="200" width="80" height="80" rx="10" fill="url(#shapeGrad1)" stroke="#539AE9" stroke-width="1" opacity="0.3" transform="rotate(15 320 240)"/>
      
      <circle cx="180" cy="80" r="40" fill="url(#shapeGrad2)" stroke="#2655C7" stroke-width="1" opacity="0.3"/>
      
      <path d="M50 100 Q100 50 150 100 T250 100" stroke="url(#shapeGrad1)" stroke-width="2" fill="none" opacity="0.4"/>
      <path d="M100 200 Q150 150 200 200 T300 200" stroke="url(#shapeGrad2)" stroke-width="2" fill="none" opacity="0.3"/>
    </svg>
  `,
  
  divider: `
    <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="divGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#2655C7;stop-opacity:0"/>
          <stop offset="50%" style="stop-color:#539AE9;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:#2655C7;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="10" x2="200" y2="10" stroke="url(#divGrad)" stroke-width="1"/>
      <circle cx="100" cy="10" r="3" fill="#539AE9"/>
    </svg>
  `,
  
  bulletPoint: `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="4" fill="#539AE9"/>
      <circle cx="6" cy="6" r="2" fill="#2655C7"/>
    </svg>
  `,
  
  checkmark: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#2655C7" opacity="0.1"/>
      <path d="M8 12 L11 15 L16 9" stroke="#2655C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  aiIcon: `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2655C7"/>
          <stop offset="100%" style="stop-color:#539AE9"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#aiGrad)" opacity="0.15"/>
      <circle cx="16" cy="16" r="10" fill="url(#aiGrad)" opacity="0.3"/>
      <circle cx="16" cy="16" r="6" fill="url(#aiGrad)"/>
      <circle cx="16" cy="16" r="3" fill="white"/>
      <path d="M16 2 L16 6 M16 26 L16 30 M2 16 L6 16 M26 16 L30 16" stroke="url(#aiGrad)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  
  documentIcon: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#EEF3FF" stroke="#2655C7" stroke-width="2"/>
      <line x1="14" y1="14" x2="34" y2="14" stroke="#539AE9" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="22" x2="34" y2="22" stroke="#539AE9" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="30" x2="26" y2="30" stroke="#539AE9" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  
  chartIcon: `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="24" width="8" height="12" rx="2" fill="#2655C7" opacity="0.6"/>
      <rect x="16" y="16" width="8" height="20" rx="2" fill="#539AE9" opacity="0.8"/>
      <rect x="28" y="8" width="8" height="28" rx="2" fill="#2655C7"/>
      <line x1="4" y1="38" x2="36" y2="38" stroke="#539AE9" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  
  quoteIcon: `
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8 L4 8 L4 16 C4 24 8 28 16 28 L12 32 C6 32 4 26 4 20 L12 20 L12 8 Z" fill="#539AE9" opacity="0.3"/>
      <path d="M36 8 L28 8 L28 16 C28 24 32 28 40 28 L36 32 C30 32 28 26 28 20 L36 20 L36 8 Z" fill="#539AE9" opacity="0.3"/>
    </svg>
  `,
  
  tagIcon: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6 L2 2 L8 2 L14 8 L8 14 L2 14 Z" fill="#539AE9" opacity="0.2" stroke="#539AE9" stroke-width="1.5"/>
      <circle cx="5" cy="5" r="1.5" fill="#2655C7"/>
    </svg>
  `,
  
  linkIcon: `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 10 L10 6 M8 4 L12 4 C13.1 4 14 4.9 14 6 L14 10 M2 6 L2 2 C2 0.9 2.9 0 4 0 L8 0" stroke="#539AE9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  clockIcon: `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke="#539AE9" stroke-width="1.5" fill="none"/>
      <path d="M8 4 L8 8 L10 10" stroke="#2655C7" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,
};

export const getSvgAsDataUri = (svg: string): string => {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
};

export const createSectionHeader = (title: string, icon?: string) => {
  return `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      ${icon || svgComponents.bulletPoint}
      <span style="font-size: 8px; letter-spacing: 2px; color: #539AE9; font-family: Inter, sans-serif; font-weight: 600;">
        ${title.toUpperCase()}
      </span>
    </div>
  `;
};

export const createDivider = (type: 'line' | 'dots' | 'gradient' = 'line') => {
  switch (type) {
    case 'dots':
      return `<div style="display: flex; align-items: center; gap: 8px; margin: 16px 0;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #539AE9;"></div>
        <div style="flex: 1; height: 1px; background: linear-gradient(90deg, #539AE9, transparent);"></div>
        <div style="width: 4px; height: 4px; border-radius: 50%; background: #2655C7;"></div>
        <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #539AE9);"></div>
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #539AE9;"></div>
      </div>`;
    case 'gradient':
      return `<div style="height: 1px; background: linear-gradient(90deg, transparent, #539AE9, #2655C7, #539AE9, transparent); margin: 20px 0;"></div>`;
    default:
      return `<div style="height: 1px; background: rgba(83, 154, 233, 0.2); margin: 16px 0;"></div>`;
  }
};

export const createTag = (text: string) => {
  return `<span style="display: inline-block; padding: 4px 10px; background: rgba(83, 154, 233, 0.1); border: 1px solid rgba(83, 154, 233, 0.2); border-radius: 4px; font-size: 7px; letter-spacing: 1px; color: #539AE9; font-family: Inter, sans-serif; margin: 2px;">${text.toUpperCase()}</span>`;
};

export const createStatBox = (value: string | number, label: string, highlight: boolean = false) => {
  return `
    <div style="background: ${highlight ? 'linear-gradient(135deg, rgba(38, 85, 199, 0.1), rgba(83, 154, 233, 0.05))' : 'rgba(238, 243, 255, 0.5)'}; border-left: 2px solid ${highlight ? '#539AE9' : '#2655C7'}; padding: 10px 14px; margin-bottom: 8px;">
      <div style="font-size: 24px; font-weight: 700; color: #2655C7; line-height: 1; font-family: Poppins, sans-serif;">${value}</div>
      <div style="font-size: 7px; letter-spacing: 1.5px; color: #4B6C8F; margin-top: 4px; font-family: Inter, sans-serif;">${label.toUpperCase()}</div>
    </div>
  `;
};

export const createProgressBar = (percent: number, label?: string) => {
  return `
    <div style="margin: 8px 0;">
      ${label ? `<div style="font-size: 7px; color: #4B6C8F; margin-bottom: 4px; font-family: Inter, sans-serif;">${label}</div>` : ''}
      <div style="height: 4px; background: rgba(83, 154, 233, 0.1); border-radius: 2px; overflow: hidden;">
        <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #2655C7, #539AE9); border-radius: 2px;"></div>
      </div>
    </div>
  `;
};

export const createTimelineDot = (active: boolean = false) => {
  return `
    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${active ? '#2655C7' : 'rgba(83, 154, 233, 0.3)'}; ${active ? 'box-shadow: 0 0 8px rgba(38, 85, 199, 0.5);' : ''}"></div>
  `;
};
