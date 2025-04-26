/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    // SidebarFooter
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    Bookmark,
    ChartNoAxesCombined,
    ChevronDown,
    ChevronUp,
    CircleHelp,
    HelpCircle,
    Home,
    LogOut,
    QrCode,
    Search,
    Settings,
    User,
    User2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/react"
import { Spinner } from "../ui/spinner"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"

const items = [
    {
        title: "Overview",
        url: "./",
        icon: Home,
    },
    {
        title: "My QR Codes",
        url: "my-qrcodes",
        icon: Bookmark,
    },
    {
        title: "Analytics",
        url: "analytics",
        icon: ChartNoAxesCombined,
    },
    {
        title: "Settings",
        url: "settings",
        icon: Settings,
    },
]

export function DashboardSidebar() {
    const { data: session, status } = useSession()
    const [userName, setUserName] = useState(session?.user?.name)

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        window.location.href = "/dashboard"
    }

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase()

    return (
        <>
            {session?.user ? (
                <Sidebar collapsible="icon" className="!text-xl h-screen bg-background shadow-md w-[11rem]">
                    <SidebarHeader>
                        <Link href={"/dashboard"}>
                            <SidebarMenuButton>
                                <QrCode />
                                <span>Dashboard</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>QRaftHive</SidebarGroupLabel>
                            <SidebarGroupContent>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title} className="list-none">
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={item.url} // Use o atributo href para redirecionar para a URL correta
                                                className="hover:text-destructive hover:cursor-pointer transition-all ease-in-out duration-200"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}

                                {/* Adicione um item separado para o logout */}
                                <SidebarMenuItem className="list-none">
                                    <SidebarMenuButton asChild>
                                        <a
                                            onClick={handleSignOut} // Apenas o botão de logout deve chamar handleSignOut
                                            className="hover:text-destructive hover:cursor-pointer transition-all ease-in-out duration-200"
                                        >
                                            <LogOut />
                                            <span>Logout</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            ) : (
                <></>
            )}
        </>
    )
}
