"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AdvancedColorPickerProps {
    color: string
    onChange: (color: string) => void
}

export function AdvancedColorPicker({ color, onChange }: AdvancedColorPickerProps) {
    const handleColorChange = React.useCallback(
        (newColor: string) => {
            onChange(newColor.toUpperCase())
        },
        [onChange],
    )

    const colorPresets = ["#ff4940", "#FF9500", "#FFCC00", "#4CD964", "#5AC8FA", "#007AFF", "#5856D6", "#EFEFF4", "#E5E5EA", "#D1D1D6", "#1C1C1C", "#000000"]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                        {color}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-4">
                <HexColorPicker color={color} onChange={handleColorChange} />
                <div className="flex items-center gap-2 my-4">
                    <Label htmlFor="hex-input">Hex:</Label>
                    <HexColorInput id="hex-input" color={color} onChange={handleColorChange} prefixed className="w-[95px] p-2 text-sm border rounded" />
                </div>
                <div className="w-[200px] grid grid-cols-6 gap-2">
                    {colorPresets.map((presetColor) => (
                        <motion.button key={presetColor} className="w-6 h-6 rounded-full" style={{ backgroundColor: presetColor }} onClick={() => handleColorChange(presetColor)} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.2, zIndex: 1 }} />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
