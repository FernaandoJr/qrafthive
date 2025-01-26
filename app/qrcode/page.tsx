import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function Qrcode() {
    return (
        <div className="rounded-lg max-w-[1200px] mx-auto px-4 py-12 md:px-6 lg:px-8 flex flex-row justify-center">
            {
                // Lista das Janelas
            }
            <Tabs defaultValue="information" className="container flex flex-col items-center">
                <TabsList className="grid min-w-[800px] grid-cols-3 mb-4">
                    <TabsTrigger value="information">Information</TabsTrigger>
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <div className=" w-[800px] flex flex-row  border border-border rounded-xl p-8">
                    {
                        // Conteúdo de Informações do QRCode
                    }
                    <TabsContent value="information" className="w-[800px]">
                        <div className="flex flex-col gap-6 w-3/4">
                            {
                                // Error Level
                            }
                            <div className=" flex flex-col gap-4">
                                <Label>Select the Error Level</Label>
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
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="margin-size">Change the margin size</Label>
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
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="value-textarea">Content</Label>
                                <Textarea id="value-textarea" placeholder="Value" defaultValue="https://QRaftHive.vercel.app" />
                            </div>
                        </div>
                    </TabsContent>
                    {
                        // Conteúdo sobre Cores do QRCode
                    }
                    <TabsContent value="color" className="w-[800px]">
                        color
                    </TabsContent>
                    {
                        // Conteúdo sobre Imagens do QRCode
                    }
                    <TabsContent value="image" className="w-[800px]">
                        image
                    </TabsContent>
                    {
                        // Parte direita do QRCode
                    }
                    <div className="flex items-center ">
                        <Separator orientation="vertical" className="mx-10" />
                        <div className="flex flex-col">
                            <QRCodeSVG value="https://QRaftHive.vercel.app" size={250} marginSize={-10} />
                            <Button className="m-5">Download</Button>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
