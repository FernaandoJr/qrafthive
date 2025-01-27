import Examples from "../components/examples";
import { Hero } from "../components/hero";
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
                <Hero />
                <StatisticsTrip stats={stats} />
                <Examples />
                <Feature />
            </div>
        </>
    )
}
