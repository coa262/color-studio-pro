'use client';

import { Toaster } from 'sonner';
import React, { useState } from 'react';
import ColorPicker from '../components/ColorPicker';
import ColorPalette from '../components/ColorPalette';
import ThemeSelector from '../components/ThemeSelector';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('#00FFB8');

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <main 
      className="min-h-screen transition-all duration-500 relative"
      style={{
        background: selectedColor 
          ? `linear-gradient(135deg, ${selectedColor}08 0%, ${selectedColor}03 50%, transparent 100%), 
             linear-gradient(to bottom right, 
               hsl(var(--background)) 0%, 
               hsl(var(--muted)) 100%)`
          : `linear-gradient(to bottom right, 
               hsl(var(--background)) 0%, 
               hsl(var(--muted)) 100%)`
      }}
    >
      {/* Theme Selector */}
      <ThemeSelector selectedColor={selectedColor} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 transition-all duration-300 text-foreground"
            style={{
              color: selectedColor || 'hsl(var(--primary))',
            }}
          >
            Color Studio Pro
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Professional color picker and palette generator. Convert between color formats, 
            discover inspiring palettes, and create beautiful color schemes for your projects.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8">
          {/* Color Picker */}
          <ColorPicker 
            initialColor={selectedColor}
            onChange={setSelectedColor}
          />

          {/* Color Palettes */}
          <ColorPalette onColorSelect={handleColorSelect} />
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            <p>Generate, convert, and explore colors with professional tools</p>
            <p className="mt-2">Designed for creators, developers, and color enthusiasts</p>
          </div>
        </footer>
      </div>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </main>
  );
}
