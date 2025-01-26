"use client";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { AdvancedColorPicker } from "@/components/ui/advanced-color-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ErrorLevel = "L" | "M" | "Q" | "H"

export default function Qrcode() {
    const [bgColor, setBgColor] = useState("#FFFFFF")
    const [fgColor, setFgColor] = useState("#000000")
    const [imageX, setImageX] = useState([0])
    const [imageY, setImageY] = useState([0])
    const [marginSize, setMarginSize] = useState(2)
    const [boostLevel, setBoostLevel] = useState(true)
    // const [centerImage, setCenterImage] = useState(true)
    // const [excavateImage, setExcavateImage] = useState(true)
    // const [imageScale, setImageScale] = useState(true)
    // const [imageWidth, setImageWidth] = useState(0)
    // const [imageHeight, setImageHeight] = useState(0)
    const [content, setContent] = useState("https://QRaftHive.vercel.app")
    const [errorLevel, setErrorLevel] = useState<ErrorLevel>("L")

    return (
        <div className="rounded-lg max-w-[1200px] mx-auto px-4 py-12 md:px-6 lg:px-8 flex flex-row justify-center md:max-w-[800px]">
            {
                // Lista das Janelas
            }
            <Tabs defaultValue="information" className="container flex flex-col items-center md:max-w-[800px] sm:w-full">
                <TabsList className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-2 mb-4 w-full">
                    <TabsTrigger value="information">Information</TabsTrigger>
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <div className="flex flex-col sm:flex-row sm:gap-8 w-full border border-border rounded-xl p-8 h-fit">
                    {/* Conteúdo de Informações do QRCode */}
                    <TabsContent value="information" className="w-full sm:w-[800px]">
                        <div className="input-div gap-5 w-full sm:w-3/4">
                            {/* Error Level */}
                            <div className="input-div">
                                <Label className="text-muted-foreground">Select the Error Level</Label>
                                <Select
                                    value={errorLevel}
                                    onValueChange={(value) => {
                                        const newErrorLevel = value as ErrorLevel
                                        setErrorLevel(newErrorLevel)
                                    }}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Error Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Error Level</SelectLabel>
                                            <SelectItem value="L">L</SelectItem>
                                            <SelectItem value="M">M</SelectItem>
                                            <SelectItem value="Q">Q</SelectItem>
                                            <SelectItem value="H">H</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Margin Size */}
                            <div className="input-div">
                                <Label htmlFor="margin-size" className="text-muted-foreground">
                                    Change the margin size
                                </Label>
                                <Input
                                    type="number"
                                    id="margin-size"
                                    placeholder="Margin size"
                                    max={150}
                                    min={0}
                                    value={marginSize}
                                    onChange={(event) => {
                                        setMarginSize(Number(event.target.value))
                                    }}
                                />
                            </div>
                            {/* Boost Level */}
                            <div className="flex flex-row gap-2 items-center">
                                <Checkbox
                                    id="boost-level"
                                    checked={boostLevel}
                                    onCheckedChange={(newLevel: boolean) => {
                                        setBoostLevel(newLevel)
                                    }}
                                />
                                <Label htmlFor="boost-level">Boost level</Label>
                            </div>
                            {/* Content */}
                            <div className="input-div">
                                <Label htmlFor="value-textarea" className="text-muted-foreground">
                                    Content
                                </Label>
                                <Textarea
                                    id="value-textarea"
                                    placeholder="Value"
                                    value={content}
                                    onChange={(event) => {
                                        setContent(event.target.value)
                                    }}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Conteúdo sobre Cores do QRCode */}
                    <TabsContent value="color" className="w-full sm:w-[800px]">
                        <div className="input-div gap-5 w-full sm:w-3/4">
                            <div className="input-div">
                                <Label htmlFor="background-color" className="text-muted-foreground">
                                    Background Color
                                </Label>
                                <AdvancedColorPicker
                                    color={bgColor}
                                    onChange={(color: string) => {
                                        setBgColor(color)
                                    }}
                                />
                            </div>
                            <div className="input-div">
                                <Label htmlFor="foreground-color" className="text-muted-foreground">
                                    Foreground Color
                                </Label>
                                <AdvancedColorPicker
                                    color={fgColor}
                                    onChange={(color: string) => {
                                        setFgColor(color)
                                    }}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Conteúdo sobre Imagens do QRCode */}
                    <TabsContent value="image" className="w-full sm:w-[800px]">
                        <div className="input-div gap-5 w-full sm:w-3/4">
                            <div className="input-div">
                                <Label htmlFor="picture" className="text-muted-foreground">
                                    Custom image
                                </Label>
                                <Input id="picture" type="file" accept="image/*" />
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Checkbox id="image-scale" defaultChecked />
                                <Label htmlFor="image-scale">Maintain image scale</Label>
                            </div>
                            <div className="flex flex-row gap-5">
                                <div className="input-div">
                                    <Label htmlFor="image-width" className="text-muted-foreground">
                                        Width
                                    </Label>
                                    <Input id="image-width" type="number" min={0} />
                                </div>
                                <div className="input-div">
                                    <Label htmlFor="image-height" className="text-muted-foreground">
                                        Height
                                    </Label>
                                    <Input id="image-height" type="number" min={0} />
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 items-center">
                                <Checkbox id="center-image" defaultChecked />
                                <Label htmlFor="center-image">Center Image</Label>
                            </div>
                            <div className="flex flex-row gap-5 w-full">
                                <div className="input-div min-w-[200px]">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="image-height" className="text-muted-foreground">
                                            Image X
                                        </Label>
                                        <output className="text-sm font-medium tabular-nums text-right">{imageX[0]}</output>
                                    </div>
                                    <Slider value={imageX} onValueChange={setImageX} aria-label="Slider with output" max={100} />
                                </div>

                                <div className="input-div min-w-[200px]">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="image-height" className="text-muted-foreground">
                                            Image Y
                                        </Label>
                                        <output className="text-sm font-medium tabular-nums text-right">{imageY[0]}</output>
                                    </div>
                                    <Slider value={imageY} onValueChange={setImageY} aria-label="Slider with output" max={100} />
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Checkbox id="excavate-image" defaultChecked />
                                <Label htmlFor="excavate-image">Excavate</Label>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Parte direita do QRCode */}
                    <div className="flex items-center justify-center sm:w-full sm:mt-4 md:mt-0">
                        <Separator orientation="vertical" className="mx-10 hidden sm:block lg:block" />
                        <div className="flex flex-col items-center">
                            <Separator orientation="horizontal" className="mx-8 mt-8 mb-4 block lg:hidden" />
                            <QRCodeSVG value={content} size={300} marginSize={marginSize} fgColor={fgColor} bgColor={bgColor} level={errorLevel} boostLevel={boostLevel} className="my-4" />
                            <Button className="mb-4">Download</Button>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
