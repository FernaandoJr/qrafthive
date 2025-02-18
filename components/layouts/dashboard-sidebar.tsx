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

const items = [
    {
        title: "Overview",
        url: "/",
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
                <Sidebar>
                    <SidebarHeader>
                        <SidebarMenuButton>
                            {(session.user.name?.length ?? 0) > 16 ? session.user.name?.substring(0, 16).trimEnd() + "..." : session.user.name}
                        </SidebarMenuButton>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>QRaftHive</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <a
                                                    onClick={handleSignOut}
                                                    className="hover:text-destructive hover:cursor-pointer transition-all ease-in-out duration-200"
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
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
