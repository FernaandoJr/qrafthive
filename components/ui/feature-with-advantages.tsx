import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const featuresList = [
    {
        title: "Effortlessly Simple",
        description: "Designed for ease, with an intuitive interface that anyone can navigate, making complex tasks feel like a breeze.",
    },
    {
        title: "Fast and Reliable",
        description: "Enjoy instant responsiveness and unwavering reliability, delivering consistent performance every time.",
    },
    {
        title: "Beautiful and Modern",
        description: "A sleek, stylish design that enhances usability while providing a visually stunning experience.",
    },
    {
        title: "Manage Your QR Codes",
        description: "Easily view, edit, delete, and organize your saved QR codes. Track analytics, and download or share with a simple click.",
    },
    {
        title: "Robust Security",
        description: "Your data is stored and managed with the utmost care, protected by a robust OAuth system for secure access and privacy.",
    },
    {
        title: "All-Inclusive Code Generator",
        description: "Create any type of code with ease QR codes, Aztec, barcodes, and more offering versatile solutions for every need.",
    },
]

function Feature() {
    return (
        <div className="container mx-auto px-5">
            <div className="container mx-auto">
                <div className="flex gap-4 py-10 flex-col items-start container">
                    <div>
                        <Badge>Features</Badge>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">Your modern QR code solution!</h2>
                        <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">Working with QR codes can be tricky. QRaftHive makes it easy.</p>
                    </div>
                    <div className="flex gap-10 pt-8 flex-col w-full">
                        <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
                            {featuresList.map((feature, index) => (
                                <div key={index} className="flex flex-row gap-6 w-full items-start">
                                    <Check className="w-8 h-8 mt-2 text-primary" />
                                    <div className="flex flex-col gap-1">
                                        <p>{feature.title}</p>
                                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Feature }
