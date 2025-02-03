"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useRef } from "react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { useState } from "react"
import { AdvancedColorPicker } from "@/components/ui/advanced-color-picker"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TooltipInfo } from "@/components/ui/tooltip-info"
import { motion } from "framer-motion"
import { ArrowRight, Bookmark, Download } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

function downloadStringAsFile(data: string, filename: string) {
    const a = document.createElement("a")
    a.download = filename
    a.href = data
    a.click()
}

type ErrorLevel = "L" | "M" | "Q" | "H"

export default function Qrcode() {
    const [bgColor, setBgColor] = useState("#FFFFFF")
    const [fgColor, setFgColor] = useState("#000000")
    const [imageX, setImageX] = useState<number | undefined>(undefined)
    const [imageY, setImageY] = useState<number | undefined>(undefined)
    const [marginSize, setMarginSize] = useState(1)
    const [boostLevel, setBoostLevel] = useState(true)
    const [centerImage, setCenterImage] = useState(true)
    const [excavateImage, setExcavateImage] = useState(true)
    const [imageScale, setImageScale] = useState(true)
    const [imageWidth, setImageWidth] = useState(50)
    const [imageHeight, setImageHeight] = useState(50)
    const [content, setContent] = useState("https://QRaftHive.vercel.app")
    const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M")
    const [imageURL, setImageURL] = useState<string>("https://avatars.githubusercontent.com/u/77449521?s=200&v=4")
    const [imageSize, setImageSize] = useState(300)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const [fileName, setFileName] = useState("qrafthive-qrcode")
	const router = useRouter()
	const { data: session, status } = useSession()



    function onCanvasButtonClick() {
        const node = canvasRef.current
        if (node == null) {
            return
        }
        // For canvas, we just extract the image data and send that directly.
        const dataURI = node.toDataURL("image/png")

        if (fileName === "") {
            setFileName("qrafthive-qrcode")
        }

        downloadStringAsFile(dataURI, fileName + ".png")
    }

    function onSVGButtonClick() {
        const node = svgRef.current
        if (node == null) {
            return
        }

        // For SVG, we need to get the markup and turn it into XML.
        // Using XMLSerializer is the easiest way to ensure the markup
        // contains the xmlns. Then we make sure it gets the right DOCTYPE,
        // encode all of that to be safe to be encoded as a URI (which we
        // need to stuff into href).
        const serializer = new XMLSerializer()
        const fileURI =
            "data:image/svg+xmlcharset=utf-8," + encodeURIComponent('<?xml version="1.0" standalone="no"?>' + serializer.serializeToString(node))

        if (fileName === "") {
            setFileName("qrafthive-qrcode")
        }

        downloadStringAsFile(fileURI, fileName + ".svg")
    }

    return (
        <div className="rounded-lg max-w-[1200px] mx-auto px-4 py-12 md:px-6 lg:px-8 flex flex-row justify-center md:max-w-[800px]">
            {
                // Lista das Janelas
            }
            <Tabs defaultValue="information" className="container flex flex-col items-center min-w-[300px] md:min-w-[950px] max-w-[900px] sm:w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-3 gap-2 mb-4 w-full">
                    <TabsTrigger value="information">Information</TabsTrigger>
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <div className="flex flex-col sm:flex-col md:flex-row gap-8 w-full border border-border rounded-xl p-4 sm:p-6 md:p-8 h-fit">
                    {/* Conteúdo de Informações do QRCode */}
                    <TabsContent value="information" className="w-full sm:w-[800px]">
                        <div className="input-div gap-5 w-full sm:w-3/4">
                            {/* Size */}
                            <div className="input-div">
                                <Label htmlFor="qr-size" className="text-muted-foreground">
                                    <TooltipInfo
                                        label="Size"
                                        tooltip="Size of the QR code in pixels. The downloaded QR code will be twice this size."
                                    />
                                </Label>
                                <Input
                                    id="qr-size"
                                    type="number"
                                    min={100}
                                    className="w-full"
                                    value={imageSize}
                                    max={5000}
                                    onChange={(event) => {
                                        setImageSize(Number(event.target.value))
                                    }}
                                />
                            </div>
                            {/* Error Level */}
                            <div className="input-div">
                                <Label className="text-muted-foreground">
                                    <TooltipInfo label="Error level" tooltip="Eror correction level for the QR code. Low, Medium, Quartile, High." />
                                </Label>
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
                                    <TooltipInfo label="Margin size" tooltip="Margin size for the QR code in pixels." />
                                </Label>
                                <Input
                                    type="number"
                                    id="margin-size"
                                    max={150}
                                    min={0}
                                    value={marginSize}
                                    onChange={(event) => {
                                        setMarginSize(Number(event.target.value))
                                        console.log("a")
                                    }}
                                />
                            </div>
                            {/* Boost Level */}
                            <div className="flex flex-row gap-2 items-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.99 }} className="flex">
                                    <Checkbox
                                        id="boost-level"
                                        checked={boostLevel}
                                        onCheckedChange={(newLevel: boolean) => {
                                            setBoostLevel(newLevel)
                                        }}
                                    />
                                </motion.div>
                                <Label htmlFor="boost-level">
                                    <TooltipInfo
                                        label="Boost level"
                                        tooltip="Boost level for the QR code. This determines the intensity of the QR code's visibility"
                                    />
                                </Label>
                            </div>
                            {/* Content */}
                            <div className="input-div">
                                <Label htmlFor="value-textarea" className="text-muted-foreground">
                                    <TooltipInfo
                                        label="Content"
                                        tooltip="Content for the QR code. Text, a URL, or any other data you want to encode."
                                    />
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
                                    <TooltipInfo label="Background Color" tooltip="Background color for the QR code." />
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
                                    <TooltipInfo label="Foreground Color" tooltip="Foreground color for the QR code." />
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
                                    <TooltipInfo label="Custom image URL" tooltip="URL for a custom image to be used in the QR code." />
                                </Label>
                                <Input id="picture" type="text" value={imageURL} onChange={(event) => setImageURL(event.target.value)} />
                            </div>
                            {
                                // escala da imagem
                            }
                            <div className="flex flex-row gap-2 items-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.99 }} className="flex">
                                    <Checkbox
                                        id="image-scale"
                                        checked={imageScale}
                                        onCheckedChange={(newValue: boolean) => {
                                            setImageScale(newValue)
                                            if (newValue) {
                                                setImageHeight(imageWidth)
                                            }
                                        }}
                                    />
                                </motion.div>
                                <Label htmlFor="image-scale">
                                    <TooltipInfo
                                        label="Maintain image scale"
                                        tooltip="Check this option to maintain the aspect ratio of the image when scaling."
                                    />
                                </Label>
                            </div>
                            <div className="flex flex-row gap-5">
                                <div className="input-div">
                                    <Label htmlFor="image-width" className="text-muted-foreground">
                                        <TooltipInfo label="Width" tooltip="Width of the image in pixels." />
                                    </Label>
                                    <Input
                                        id="image-width"
                                        type="number"
                                        min={0}
                                        value={imageWidth}
                                        max={imageSize}
                                        onChange={(event) => {
                                            if (imageScale) {
                                                setImageWidth(Number(event.target.value))
                                                setImageHeight(Number(event.target.value))
                                            } else {
                                                setImageWidth(Number(event.target.value))
                                            }
                                        }}
                                    />
                                </div>
                                <div className="input-div">
                                    <Label htmlFor="image-height" className="text-muted-foreground">
                                        <TooltipInfo label="Height" tooltip="Height of the image in pixels." />
                                    </Label>
                                    <Input
                                        id="image-height"
                                        type="number"
                                        min={0}
                                        value={imageHeight}
                                        max={imageSize}
                                        onChange={(event) => {
                                            if (imageScale) {
                                                setImageHeight(Number(event.target.value))
                                                setImageWidth(Number(event.target.value))
                                            } else {
                                                setImageHeight(Number(event.target.value))
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 items-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.99 }} className="flex">
                                    <Checkbox
                                        id="center-image"
                                        checked={centerImage}
                                        onCheckedChange={(NewValue: boolean) => {
                                            setCenterImage(NewValue)
                                            if (NewValue) {
                                                setImageX(undefined)
                                                setImageY(undefined)
                                            } else {
                                                setImageX(0)
                                                setImageY(0)
                                            }
                                        }}
                                    />
                                </motion.div>
                                <Label htmlFor="center-image">
                                    <TooltipInfo label="Center image" tooltip="Check this option to center the image within the QR code." />
                                </Label>
                            </div>
                            {centerImage === false && (
                                <div className="flex flex-row gap-5 w-full">
                                    <div className="input-div min-w-[190px]">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="image-height" className="text-muted-foreground">
                                                <TooltipInfo label="Image X" tooltip="Horizontal position of the image within the QR code." />
                                            </Label>
                                            <output className="text-sm font-medium tabular-nums text-right">{imageX}</output>
                                        </div>
                                        <Slider
                                            value={imageX ? [imageX] : [0]}
                                            onValueChange={(value) => setImageX(value[0])}
                                            aria-label="Slider with output"
                                            max={imageSize - imageWidth}
                                        />
                                    </div>
                                    <div className="input-div min-w-[190px]">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="image-height" className="text-muted-foreground">
                                                <TooltipInfo label="Image Y" tooltip="Vertical position of the image within the QR code." />
                                            </Label>
                                            <output className="text-sm font-medium tabular-nums text-right">{imageY}</output>
                                        </div>
                                        <Slider
                                            value={imageY ? [imageY] : [0]}
                                            onValueChange={(value) => setImageY(value[0])}
                                            aria-label="Slider with output"
                                            max={imageSize - imageHeight}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-row gap-2 items-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.99 }} className="flex">
                                    <Checkbox
                                        id="excavate-image"
                                        checked={excavateImage}
                                        onCheckedChange={(newValue: boolean) => setExcavateImage(newValue)}
                                    />
                                </motion.div>
                                <Label htmlFor="excavate-image">
                                    <TooltipInfo label="Excavate" tooltip="Check this option to enable excavation mode for the QR code." />
                                </Label>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Parte direita do QRCode */}
                    <div className="flex items-center justify-end sm:w-full sm:mt-4 md:mt-0">
                        <Separator orientation="vertical" className="mx-10 hidden sm:block lg:block" />

                        <div className="flex flex-col items-center">
                            <Separator orientation="horizontal" className="mx-8 mt-8 mb-4 block sm:hidden md:hidden lg:hidden" />

                            <QRCodeSVG
                                ref={svgRef}
                                value={content}
                                size={imageSize}
                                marginSize={marginSize}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level={errorLevel}
                                boostLevel={boostLevel}
                                imageSettings={{
                                    src: imageURL,
                                    excavate: excavateImage,
                                    height: imageHeight,
                                    width: imageWidth,
                                    x: imageX,
                                    y: imageY,
                                }}
                                className="my-4 h-[250px] w-[250px]"
                            />

                            <QRCodeCanvas
                                ref={canvasRef}
                                value={content}
                                size={imageSize}
                                marginSize={marginSize}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level={errorLevel}
                                boostLevel={boostLevel}
                                imageSettings={{
                                    src: imageURL,
                                    excavate: excavateImage,
                                    height: imageHeight,
                                    width: imageWidth,
                                    x: imageX,
                                    y: imageY,
                                    crossOrigin: "anonymous",
                                }}
                                className="my-4 h-[250px] w-[250px] hidden"
                            />
                            <div className="flex justify-between flex-nowrap w-full flex-row-reverse">
                                <motion.div className="" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.99 }}>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="expandIcon"
                                                className="text-white bg-purple-600 hover:bg-purple-700"
                                                Icon={() => <Bookmark className="h-4 w-4" />}
                                                iconPlacement="right"
                                            >
                                                Favorite
                                            </Button>
                                        </AlertDialogTrigger>
										{session ? (
											<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>Save QR Code</AlertDialogTitle>
    <AlertDialogDescription>
      Are you sure you want to save this QR code? This action will store the QR code in your account.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction>Save</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
                                        ) : (
											<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Not Logged In</AlertDialogTitle>
												<AlertDialogDescription>
													You need to be logged in to perform this action. Please log in to continue.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction asChild>
													<Link href="/login">Login</Link>
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
                                        )}
                                    </AlertDialog>
                                </motion.div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.99 }} className="">
                                            <Button variant="default">Download</Button>
                                        </motion.div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Set a file name</h4>
                                                <p className="text-sm text-muted-foreground">Set a custom file name for the QR Code.</p>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="width">Name</Label>
                                                    <Input
                                                        id="filename"
                                                        value={fileName}
                                                        onChange={(event) => {
                                                            setFileName(event.target.value)
                                                        }}
                                                        className="col-span-2 h-8"
                                                    />
                                                </div>
                                                <div className="flex flex-row items-center gap-2 mt-5 justify-center">
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.99 }} className="">
                                                        <Button onClick={onSVGButtonClick}>SVG</Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.99 }} className="">
                                                        <Button onClick={onCanvasButtonClick}>PNG</Button>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
