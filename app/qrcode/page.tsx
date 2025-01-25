import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Qrcode() {
    return (
        <div className="rounded-lg container mx-auto px-4 py-12 md:px-6 lg:px-8">
            {
                // Lista das Janelas
            }
            <Tabs defaultValue="information" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="information">Information</TabsTrigger>
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <div className="w-full flex flex-row  h-[500px] border border-border rounded-xl p-8 justify-between">
                    {
                        // Conteúdo de Informações do QRCode
                    }
                    <TabsContent value="information">
                        <Select>
                            <SelectTrigger className="w-[180px]">
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
                        <Input type="number" id="margin-size" placeholder="Margin size" />
                    </TabsContent>
                    {
                        // Conteúdo sobre Cores do QRCode
                    }
                    <TabsContent value="color">color</TabsContent>
                    {
                        // Conteúdo sobre Imagens do QRCode
                    }
                    <TabsContent value="image">image</TabsContent>
                    {
                        // Parte direita do QRCode
                    }
                    <div className="flex items-center ">
                        <Separator orientation="vertical" className="mx-10" />
                        <div className="flex flex-col">
                            <QRCodeSVG value="https://reactjs.org/" size={250} marginSize={2} />
                            <Button className="m-5">Download</Button>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
