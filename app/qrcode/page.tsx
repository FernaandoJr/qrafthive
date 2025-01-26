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

export default function Qrcode() {
    const [bgColor, setBgColor] = useState("#FFFFFF")
    const [fgColor, setFgColor] = useState("#000000")
    const [imageX, setImageX] = useState([0])
    const [imageY, setImageY] = useState([0])

    function handleSetBgColor(color: string) {
        setBgColor(color);
    }

    function handleSetFgColor(color: string) {
        setFgColor(color);
    }

    return (
        <div className="rounded-lg max-w-[1200px] mx-auto px-4 py-12 md:px-6 lg:px-8 flex flex-row justify-center">
            {
                // Lista das Janelas
            }
            <Tabs defaultValue="information" className="container flex flex-col items-center">
                <TabsList className="grid min-w-[900px] grid-cols-3 mb-4">
                    <TabsTrigger value="information">Information</TabsTrigger>
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <div className=" w-[900px] flex flex-row  border border-border rounded-xl p-8 h-fit">
                    {
                        // Conteúdo de Informações do QRCode
                    }
                    <TabsContent value="information" className="w-[800px]">
                        <div className="input-div gap-5 w-3/4">
                            {
                                // Error Level
                            }
                            <div className="input-div">
                                <Label className="text-muted-foreground">Select the Error Level</Label>
                                <Select defaultValue="L">
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
                            {
                                // Margin Size
                            }
                            <div className="input-div">
                                <Label htmlFor="margin-size" className="text-muted-foreground">
                                    Change the margin size
                                </Label>
                                <Input type="number" id="margin-size" placeholder="Margin size" defaultValue={2} max={100} min={0} />
                            </div>
                            {
                                // Boost Level
                            }
                            <div className="flex flex-row gap-2 items-center">
                                <Checkbox id="boost-level" />
                                <Label htmlFor="boost-level">Boost level</Label>
                            </div>
                            {
                                // Content
                            }
                            <div className="input-div">
                                <Label htmlFor="value-textarea" className="text-muted-foreground">
                                    Content
                                </Label>
                                <Textarea id="value-textarea" placeholder="Value" defaultValue="https://QRaftHive.vercel.app" />
                            </div>
                        </div>
                    </TabsContent>
                    {
                        // Conteúdo sobre Cores do QRCode
                    }
                    <TabsContent value="color" className="w-[800px]">
                        <div className="input-div gap-5 w-3/4">
                            <div className="input-div">
                                <Label htmlFor="background-color" className="text-muted-foreground">
                                    Background Color
                                </Label>
                                <AdvancedColorPicker
                                    color={bgColor}
                                    onChange={(color: string) => {
                                        console.log(color);
                                        handleSetBgColor(color);
                                    }}
                                />
                            </div>
                            <div className="input-div">
                                <Label htmlFor="background-color" className="text-muted-foreground">
                                    Foreground Color
                                </Label>
                                <AdvancedColorPicker
                                    color={fgColor}
                                    onChange={(color: string) => {
                                        console.log(color);
                                        handleSetFgColor(color);
                                    }}
                                />
                            </div>
                        </div>
                    </TabsContent>
                    {
                        // ver um jeito de fazer um set de imagens padrão pra selecionar, tipo instagram, facebook, sinal de wifi
                        // scan me etc
                    }
                    {
                        // Conteúdo sobre Imagens do QRCode
                    }
                    <TabsContent value="image" className="w-[800px]">
                        <div className="input-div gap-5 w-3/4">
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
                    {
                        // Parte direita do QRCode
                    }
                    <div className="flex items-center ">
                        <Separator orientation="vertical" className="mx-10" />
                        <div className="flex flex-col">
                            <QRCodeSVG
                                value="https://QRaftHive.vercel.app"
                                size={300}
                                marginSize={-10}
                                fgColor={fgColor}
                                bgColor={bgColor}
                            />
                            <Button className="m-5">Download</Button>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
