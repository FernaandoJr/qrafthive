"use client"

import { Spinner } from "@/components/ui/spinner"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation" // Updated import

export default function Dashboard() {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <Spinner size="small" />
    }

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push("/login")
    }

    return (
        <div className="">
            {session ? (
                <p>
                    logged
                    <p onClick={handleSignOut}>deslogar</p>
                </p>
            ) : (
                <div className="flex justify-end p-4 gap-4">
                    <p>não logado vai logar</p>
                </div>
            )}
        </div>
    )
}
