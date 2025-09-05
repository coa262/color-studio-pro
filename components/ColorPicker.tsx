'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Palette, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  hslToRgb,
  generateRandomColor,
  generateComplementaryColor,
  getContrastRatio,
  isLightColor,
  type RGB,
  type HSL,
  type HSV,
  type CMYK
} from '@/lib/color-utils';

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: string) => void;
}

export default function ColorPicker({ initialColor = '#3B82F6', onChange }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [inputValue, setInputValue] = useState(initialColor);

  const updateColor = useCallback((newColor: string) => {
    setCurrentColor(newColor);
    setInputValue(newColor);
    onChange?.(newColor);
  }, [onChange]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    updateColor(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Ensure the value starts with #
    let formattedValue = value;
    if (!formattedValue.startsWith('#')) {
      formattedValue = '#' + formattedValue.replace(/^#+/, '');
    }
    
    // Limit to 7 characters (# + 6 hex digits)
    if (formattedValue.length > 7) {
      formattedValue = formattedValue.substring(0, 7);
    }
    
    // Only allow valid hex characters
    const hexPattern = /^#[0-9A-Fa-f]*$/;
    if (!hexPattern.test(formattedValue)) {
      return; // Don't update if invalid characters
    }
    
    setInputValue(formattedValue.toUpperCase());
    
    // Validate and update if valid hex
    if (/^#[0-9A-F]{6}$/i.test(formattedValue)) {
      setCurrentColor(formattedValue.toUpperCase());
      onChange?.(formattedValue.toUpperCase());
    }
  };

  const generateRandomColorHandler = () => {
    const randomColor = generateRandomColor();
    updateColor(randomColor);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Calculate color values
  const rgb = hexToRgb(currentColor);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const hsv = rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
  const complementary = generateComplementaryColor(currentColor);
  const contrastWithWhite = getContrastRatio(currentColor, '#FFFFFF');
  const contrastWithBlack = getContrastRatio(currentColor, '#000000');
  const isLight = isLightColor(currentColor);

  return (
    <Card className="w-full max-w-2xl backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Color Picker & Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Preview */}
        <div className="relative">
          <div 
            className="w-full h-32 rounded-lg border-2 border-border shadow-lg transition-all duration-300"
            style={{ backgroundColor: currentColor }}
          />
          <div 
            className={cn(
              "absolute inset-0 rounded-lg flex items-center justify-center text-lg font-semibold transition-colors duration-300",
              isLight ? "text-black" : "text-white"
            )}
          >
            {currentColor.toUpperCase()}
          </div>
        </div>

        {/* Color Input Controls */}
        <div className="flex gap-2">
          <Input
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="w-16 h-10 p-1 rounded-md cursor-pointer"
          />
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="#000000"
            className="flex-1 font-mono"
          />
          <Button onClick={generateRandomColorHandler} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Color Format Conversions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HEX */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="text-sm font-medium">HEX</div>
              <div className="font-mono text-lg">{currentColor.toUpperCase()}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(currentColor.toUpperCase(), 'HEX')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* RGB */}
          {rgb && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium">RGB</div>
                <div className="font-mono text-lg">{rgb.r}, {rgb.g}, {rgb.b}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* HSL */}
          {hsl && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium">HSL</div>
                <div className="font-mono text-lg">{hsl.h}°, {hsl.s}%, {hsl.l}%</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* HSV */}
          {hsv && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium">HSV</div>
                <div className="font-mono text-lg">{hsv.h}°, {hsv.s}%, {hsv.v}%</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`, 'HSV')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* CMYK */}
          {cmyk && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium">CMYK</div>
                <div className="font-mono text-sm">{cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'CMYK')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Complementary Color */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: complementary }}
              />
              <div>
                <div className="text-sm font-medium">Complementary</div>
                <div className="font-mono text-sm">{complementary.toUpperCase()}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(complementary.toUpperCase(), 'Complementary')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Accessibility Info */}
        <div className="space-y-3">
          <h3 className="font-semibold">Accessibility</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={contrastWithWhite >= 4.5 ? "default" : "destructive"}>
              White Text: {contrastWithWhite.toFixed(2)}:1 
              {contrastWithWhite >= 4.5 ? " ✓" : " ✗"}
            </Badge>
            <Badge variant={contrastWithBlack >= 4.5 ? "default" : "destructive"}>
              Black Text: {contrastWithBlack.toFixed(2)}:1
              {contrastWithBlack >= 4.5 ? " ✓" : " ✗"}
            </Badge>
            <Badge variant="secondary">
              {isLight ? "Light Color" : "Dark Color"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
