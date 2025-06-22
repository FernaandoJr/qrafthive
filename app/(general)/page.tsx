import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import connectDB from "@/lib/mongoose"
import Examples from "../../components/sections/examples"
import { Hero } from "@/components/sections/hero"
import { StatisticsSection } from "@/components/sections/statistics-trip"
import { Feature } from "@/components/ui/feature-with-advantages"

export default async function Home() {
    const session = await getServerSession()

    // Se o usuário está autenticado, verificar se tem birthDate
    if (session?.user?.email) {
        await connectDB()
        const user = await User.findOne({ email: session.user.email })
        
        // Se não tem birthDate, redirecionar para completar perfil
        if (user && !user.birthDate) {
            redirect("/complete-profile")
        }
    }

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
