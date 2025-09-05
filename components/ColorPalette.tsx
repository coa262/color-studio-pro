'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Copy, RefreshCw, Sparkles, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { generateColorPalette, isLightColor, hexToRgb, rgbToHsl } from '../lib/color-utils';

interface ColorPaletteProps {
  onColorSelect?: (color: string) => void;
}

export default function ColorPalette({ onColorSelect }: ColorPaletteProps) {
  const [palettes, setPalettes] = useState<string[][]>([]);
  const [selectedPalette, setSelectedPalette] = useState<number>(0);

  const generatePalettes = () => {
    const newPalettes = [
      generateColorPalette(5),
      generateColorPalette(6),
      generateColorPalette(4),
      generateColorPalette(7),
      generateColorPalette(5),
      generateColorPalette(6),
    ];
    setPalettes(newPalettes);
    setSelectedPalette(0);
  };

  useEffect(() => {
    generatePalettes();
  }, []);

  const copyPalette = async (palette: string[]) => {
    const paletteText = palette.join(', ');
    try {
      await navigator.clipboard.writeText(paletteText);
      toast.success('Palette copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy palette');
    }
  };

  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      toast.success(`${color} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy color');
    }
  };

  const downloadPalette = (palette: string[], index: number) => {
    const css = palette.map((color, i) => `--color-${i + 1}: ${color};`).join('\n');
    const content = `:root {\n  ${css}\n}`;
    
    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-palette-${index + 1}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Palette downloaded as CSS file!');
  };

  const getPaletteTheme = (palette: string[]): string => {
    const hues = palette.map(color => {
      const rgb = hexToRgb(color);
      if (!rgb) return 0;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return hsl.h;
    });
    
    const avgHue = hues.reduce((sum, hue) => sum + hue, 0) / hues.length;
    
    if (avgHue < 30) return "Warm Reds";
    if (avgHue < 60) return "Sunny Yellows";
    if (avgHue < 120) return "Fresh Greens";
    if (avgHue < 180) return "Cool Cyans";
    if (avgHue < 240) return "Deep Blues";
    if (avgHue < 300) return "Rich Purples";
    return "Vibrant Magentas";
  };

  if (palettes.length === 0) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Inspiring Color Palettes
          </CardTitle>
          <Button onClick={generatePalettes} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            New Palettes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Palette Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {palettes.map((palette, paletteIndex) => (
            <div
              key={paletteIndex}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg",
                selectedPalette === paletteIndex 
                  ? "border-primary shadow-md" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setSelectedPalette(paletteIndex)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Badge variant="secondary" className="mb-1">
                    {getPaletteTheme(palette)}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {palette.length} colors
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyPalette(palette);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPalette(palette, paletteIndex);
                    }}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="flex rounded-md overflow-hidden shadow-sm h-16">
                  {palette.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1 relative group cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onColorSelect?.(color);
                        copyColor(color);
                      }}
                    >
                      <div 
                        className={cn(
                          "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono font-semibold",
                          isLightColor(color) ? "text-black bg-black/10" : "text-white bg-white/10"
                        )}
                      >
                        {color.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                  {palette.slice(0, Math.min(4, palette.length)).map((color, colorIndex) => (
                    <div key={colorIndex} className="truncate text-muted-foreground">
                      {color.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Palette Detail */}
        {palettes[selectedPalette] && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Selected Palette - {getPaletteTheme(palettes[selectedPalette])}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyPalette(palettes[selectedPalette])}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPalette(palettes[selectedPalette], selectedPalette)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSS
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {palettes[selectedPalette].map((color, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => {
                    onColorSelect?.(color);
                    copyColor(color);
                  }}
                >
                  <div
                    className="w-full h-20 rounded-lg border border-border shadow-sm transition-transform group-hover:scale-105"
                    style={{ backgroundColor: color }}
                  />
                  <div className="mt-2 text-center">
                    <div className="font-mono text-sm font-semibold">{color.toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">Click to copy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
