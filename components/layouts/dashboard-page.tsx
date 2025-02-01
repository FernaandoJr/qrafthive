import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Spinner } from "../ui/spinner"

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return <Spinner size="small" />
    }

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-lg text-muted-foreground">Welcome to your dashboard.</p>
            <p>{session?.user?.name}</p>
        </div>
    )
}
