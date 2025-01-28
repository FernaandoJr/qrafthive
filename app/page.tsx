import Examples from "../components/examples"
import { Hero } from "@/components/hero"
import { StatisticsTrip } from "@/components/statistics-trip"
import { Feature } from "@/components/ui/feature-with-advantages"

export default function Home() {

    return (
        <>
            <div className="overflow-x-hidden">
                <Hero
                    content={{
                        title: "Unlock Infinite Possibilities with a custom",
                        titleHighlight: "QR Code",
                        description: "Create, share, and connect seamlessly in seconds.",
                        primaryAction: {
                            href: "/docs/getting-started",
                            text: "Get Started",
                        },
                        secondaryAction: {
                            href: "/qrcode",
                            text: "Create Your Codes",
                        },
                    }}
                />
                <StatisticsTrip />
                <Examples />
                <Feature />
            </div>
        </>
    )
}
