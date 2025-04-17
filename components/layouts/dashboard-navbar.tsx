"use client"
import { Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
//import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SidebarTrigger } from "../ui/sidebar"
import { UserButton } from "../user-button"
/* eslint-disable @typescript-eslint/no-unused-vars */

export default function DashboardNavbar() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        window.location.href = "/"
    }

    return (
        <header className="w-full flex justify-between items-center p-4 h-fit top-0 left-0 shadow-md">
            <div className="flex items-center">
                <SidebarTrigger>
                    <Menu className="cursor-pointer" />
                </SidebarTrigger>
            </div>
            <p>Dashboard</p>
            <div className="hidden lg:flex">
                <UserButton />
            </div>
        </header>
    )
}
