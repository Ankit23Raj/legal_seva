
import React from 'react';
import { Check, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import LANGUAGES from '@/lib/constants/languages';
import { ThemeToggle } from './ThemeToggle';

export function LanguageSelector() {
  const { language, setLanguage, translate } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1 bg-background">
            <Languages className="h-4 w-4" />
            <span className="font-medium">
              {LANGUAGES.find(lang => lang.code === language)?.name || 'English'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-background">
          <DropdownMenuLabel>{translate('Select Language')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  language === lang.code && "bg-accent text-accent-foreground"
                )}
                onClick={() => setLanguage(lang.code)}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.name}</span>
                  <span className="text-muted-foreground text-xs">({lang.nativeName})</span>
                </span>
                {language === lang.code && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
