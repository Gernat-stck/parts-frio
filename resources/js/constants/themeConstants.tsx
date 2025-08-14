import { Bot, Leaf, Monitor, Moon, Palette, Shell, Sun, Sunset, Waves, Zap } from 'lucide-react';
import type { JSX } from 'react';

export type Appearance = 'light' | 'claude' | 'dark' | 'system' | 'amber' | 'blue' | 'forest' | 'ocean' | 'sunset' | 'neon' | 'slate';

export const THEMES: Appearance[] = ['light', 'claude', 'dark', 'system', 'amber', 'blue', 'forest', 'ocean', 'sunset', 'neon', 'slate'];

export const THEME_ICONS: Record<Appearance, JSX.Element> = {
    light: <Sun className="h-5 w-5" />,
    claude: <Bot className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Monitor className="h-5 w-5" />,
    amber: <Shell className="h-5 w-5" />,
    blue: <Palette className="h-5 w-5" />,
    forest: <Leaf className="h-5 w-5" />,
    ocean: <Waves className="h-5 w-5" />,
    sunset: <Sunset className="h-5 w-5" />,
    neon: <Zap className="h-5 w-5" />,
    slate: <Leaf className="h-5 w-5" />,
};

export const THEME_DESCRIPTIONS: Record<Appearance, string> = {
    light: 'Tema claro clásico',
    claude: 'Tema claro inspirado en Claude IA',
    dark: 'Tema oscuro elegante',
    system: 'Sigue la preferencia del sistema',
    amber: 'Tonos cálidos ámbar',
    blue: 'Azul profundo y profesional',
    forest: 'Verde bosque natural',
    ocean: 'Azul océano tranquilo',
    sunset: 'Colores de atardecer',
    neon: 'Neón vibrante y futurista',
    slate: 'Tema claro elegante',
};
