import { Hero } from "@/components/hero";
import Examples from "../components/examples";
import { StatisticsTrip } from "@/components/statistics-trip";
import { Feature } from "@/components/ui/feature-with-advantages";

export default function Home() {
    const stats = [
        { value: "1,000+", label: "Shared Links" },
        { value: "10,000+", label: "QR Codes possibilities" },
        { value: "350+", label: "Satisfied users" },
    ]

    return (
        <>
            <div className="overflow-x-hidden">
                <Hero
                    pill={{
                        text: "New! PrismUI Components",
                        href: "/docs",
                        // icon: <Icons.logo className="h-4 w-4" />,
                        variant: "default",
                        size: "md",
                    }}
                    content={{
                        title: "Unlock Infinite Possibilities with a custom",
                        titleHighlight: "QR Code",
                        description:
                            "Create, share, and connect seamlessly in seconds.",
                        primaryAction: {
                            href: "/docs/getting-started",
                            text: "Get Started",
                            // icon: <Icons.logo className="h-4 w-4" />,
                        },
                        secondaryAction: {
                            href: "/qrcode",
                            text: "Create Your Codes"
                            // icon: <Icons.component className="h-4 w-4" />,
                        },
                    }}
                />
                <StatisticsTrip stats={stats} />
                <Examples />
                <Feature />
            </div>
        </>
    )
}
