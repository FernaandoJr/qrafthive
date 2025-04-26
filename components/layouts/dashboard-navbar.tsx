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
        <header className="flex justify-between items-center p-4 h-20  shadow-md">
            <div className="flex items-center">
                <SidebarTrigger>
                    <Menu className="cursor-pointer" />
                </SidebarTrigger>
            </div>
            <div className=" lg:flex">
                <UserButton />
            </div>
        </header>
    )
}
