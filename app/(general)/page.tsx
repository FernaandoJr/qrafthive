"use client"

import Examples from "../../components/sections/examples"
import { Hero } from "@/components/sections/hero"
import { StatisticsSection } from "@/components/sections/statistics-trip"
import { Feature } from "@/components/ui/feature-with-advantages"

export default function Home() {
    return (
        <div className="overflow-x-hidden container flex flex-col align-center mx-auto">
            <Hero
                content={{
                    title: "Unlock Infinite Possibilities with a custom",
                    titleHighlight: "QR Code",
                    description: "Create, share, and connect seamlessly in seconds.",
                    primaryAction: {
                        href: "/register",
                        text: "Get Started",
                    },
                    secondaryAction: {
                        href: "/qrcode",
                        text: "Create Your Codes",
                    },
                }}
            />
            <StatisticsSection />
            <Examples />
            <Feature />
        </div>
    )
}
