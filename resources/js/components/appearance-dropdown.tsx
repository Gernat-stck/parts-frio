import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { HTMLAttributes } from 'react';
import { THEME_DESCRIPTIONS, THEME_ICONS, THEMES } from '../constants/themeConstants';
import { useAppearance } from '../hooks/use-appearance';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const getCurrentIcon = () => THEME_ICONS[appearance] ?? THEME_ICONS['system'];

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                        {getCurrentIcon()}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {THEMES.map((theme) => (
                        <DropdownMenuItem key={theme} onClick={() => updateAppearance(theme)} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {THEME_ICONS[theme]}
                                <div className="flex flex-col">
                                    <span className="capitalize">{theme}</span>
                                    <span className="text-muted-foreground text-xs">{THEME_DESCRIPTIONS[theme]}</span>
                                </div>
                            </span>
                            {appearance === theme && <div className="bg-primary h-2 w-2 rounded-full" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
