export const APP_CONSTANTS = {
  WEBSITE_NAME: 'GiantyLive',
  GIANTYTALK_LOGO: {
    SVG_PATH: '/giantytalk-logo.svg',
    ICON: 'Mic',
    ICON_CLASSES: 'w-7 h-7',
    TEXT_CLASSES: 'text-lg font-bold text-foreground',
    COMPACT_ICON_CLASSES: 'w-10 h-10 flex items-center justify-center',
    COMPACT_TEXT_CLASSES: 'text-2xl font-bold text-foreground',
    COMPACT_LETTER: 'G',
    // Professional color palette for audio equalizer logo
    PRIMARY_COLOR: '#ed2647',        // Vibrant red for bars
    SECONDARY_COLOR: '#ffffff',      // Pure white background
    ACCENT_COLOR: '#000000',         // Pure black for text
    PRIMARY_COLOR_CLASSES: 'text-[#ed2647]',
    SECONDARY_COLOR_CLASSES: 'text-[#ffffff]',
    ACCENT_COLOR_CLASSES: 'text-[#000000]',
    PRIMARY_BG_CLASSES: 'bg-[#ed2647]',
    SECONDARY_BG_CLASSES: 'bg-[#ffffff]',
    ACCENT_BG_CLASSES: 'bg-[#000000]',
    PRIMARY_HOVER_CLASSES: 'hover:bg-[#ed2647]/90',
    SECONDARY_HOVER_CLASSES: 'hover:bg-[#ffffff]/90',
    ACCENT_HOVER_CLASSES: 'hover:bg-[#000000]/90'
  }
} as const 