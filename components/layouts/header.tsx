"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, MoveRight, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/theme-menu"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

function Header() {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
            description: "",
        },
        {
            title: "Generators",
            description: "Browse for all of our code generators.",
            items: [
                {
                    title: "QR Code",
                    href: "/qrcode",
                },
                {
                    title: "Barcode",
                    href: "/barcode",
                },
                {
                    title: "Explore all",
                    href: "/explore",
                },
            ],
        },
        {
            title: "Project",
            description: "Our project is a web app for creating and customizing QR codes, barcodes, and more.",
            items: [
                {
                    title: "About us",
                    href: "/about",
                },
                {
                    title: "Team",
                    href: "/team",
                },
                {
                    title: "Contact us",
                    href: "/contact",
                },
            ],
        },
    ]

    const [isOpen, setOpen] = useState(false)
    return (
        <header className="w-full z-40 sticky top-0 left-0 bg-background">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center ">
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <>
                                            <NavigationMenuLink href={item.href}>
                                                <Button variant="ghost">{item.title}</Button>
                                            </NavigationMenuLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger className="font-medium text-sm">{item.title}</NavigationMenuTrigger>
                                            <NavigationMenuContent className="!w-[450px] p-4">
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-base">{item.title}</p>
                                                            <p className="text-muted-foreground text-sm">{item.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-end">
                                                        {item.items?.map((subItem) => (
                                                            <NavigationMenuLink
                                                                href={subItem.href}
                                                                key={subItem.title}
                                                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                                                            >
                                                                <span>{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex lg:justify-center">
                    <p className="font-semibold">QRaftHive</p>
                </div>
                <div className="flex justify-end w-full gap-4">
                    <Button
                        onClick={() => {
                            window.location.href = "/login"
                        }}
                        variant="outline"
                    >
                        Sign in
                    </Button>
                    <ModeToggle />
                </div>
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 mt-2 border flex flex-col w-full right-0 bg-background shadow-lg p-4 container border-border rounded-lg gap-5 ">
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            <Link href={item.href} className="flex justify-between items-center">
                                                <span className="text-lg">{item.title}</span>
                                                <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground " />
                                            </Link>
                                        ) : (
                                            <motion.div
                                                whileHover={{
                                                    scale: 1.05,
                                                    zIndex: 1,
                                                }}
                                                className="w-fit"
                                            >
                                                <p className="text-lg">{item.title}</p>
                                            </motion.div>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link key={subItem.title} href={subItem.href} className="flex justify-between items-center">
                                                    <motion.div
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        whileHover={{
                                                            scale: 1.05,
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <span className="text-muted-foreground">{subItem.title}</span>
                                                    </motion.div>
                                                    <motion.div
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        whileHover={{
                                                            scale: 1.1,
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <MoveRight className="w-4 h-4 stroke-1" />
                                                    </motion.div>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export { Header }
