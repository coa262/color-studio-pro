'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeSelectorProps {
  selectedColor?: string;
}

export default function ThemeSelector({ selectedColor }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg animate-pulse" />
      </div>
    );
  }

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative">
        {/* Main Theme Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-12 h-12 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
            "bg-background/80 border-border hover:bg-background/90",
            isOpen && "scale-105 shadow-xl"
          )}
          style={{
            backgroundColor: selectedColor ? `${selectedColor}15` : undefined,
            borderColor: selectedColor ? `${selectedColor}30` : undefined,
          }}
        >
          <div className="flex items-center justify-center">
            {theme === 'light' && <Sun className="h-5 w-5 text-foreground" />}
            {theme === 'dark' && <Moon className="h-5 w-5 text-foreground" />}
            {theme === 'system' && <Monitor className="h-5 w-5 text-foreground" />}
          </div>
        </button>

        {/* Theme Options */}
        <div
          className={cn(
            "absolute top-16 right-0 transition-all duration-300 origin-top-right",
            isOpen 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          <div 
            className="bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl p-2 min-w-[140px]"
            style={{
              backgroundColor: selectedColor ? `${selectedColor}08` : undefined,
              borderColor: selectedColor ? `${selectedColor}20` : undefined,
            }}
          >
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.id;
              
              return (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  style={{
                    backgroundColor: isActive && selectedColor ? `${selectedColor}20` : undefined,
                    color: isActive && selectedColor ? selectedColor : undefined,
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{themeOption.name}</span>
                  {isActive && (
                    <div 
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedColor || 'currentColor' }}
                    />
                  )}
                </button>
              );
            })}
            
            {/* Color Indicator */}
            {selectedColor && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                  <Palette className="h-3 w-3" />
                  <span>Theme Color</span>
                  <div 
                    className="ml-auto w-3 h-3 rounded-full border border-border/50"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
