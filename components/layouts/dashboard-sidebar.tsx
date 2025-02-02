/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import {
    Sidebar,
    SidebarContent,
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
import { Bookmark, ChartNoAxesCombined, ChevronDown, HelpCircle, Home, LogOut, QrCode, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Spinner } from "../ui/spinner"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "My QR Codes",
        url: "#",
        icon: Bookmark,
    },
    {
        title: "Analytics",
        url: "#",
        icon: ChartNoAxesCombined,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
    {
        title: "Profile",
        url: "#",
        icon: Search,
    },
    {
        title: "Help",
        url: "#",
        icon: HelpCircle,
    },
    {
        title: "Logout",
        url: "#",
        icon: LogOut,
    },
]

export function DashboardSidebar() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <Spinner size="small" />
    }

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase()

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenuButton>Hi, {session?.user?.name}!</SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>QRaftHive</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Collapsible defaultOpen className="group/collapsible">
                                <SidebarGroup>
                                    <SidebarGroupLabel asChild>
                                        <CollapsibleTrigger>
                                            Help
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                    </SidebarGroupLabel>
                                    <CollapsibleContent>
                                        <SidebarGroupContent>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild>
                                                    <a href="">
                                                        <QrCode />
                                                        FAQ
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton>Contact Support</SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton>User Guide</SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton>Video Tutorials</SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </SidebarGroupContent>
                                    </CollapsibleContent>
                                </SidebarGroup>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
