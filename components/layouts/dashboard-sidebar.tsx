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
} from "@/components/ui/sidebar"
import { Bookmark, ChartNoAxesCombined, ChevronDown, HelpCircle, Home, LogOut, Search, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DropdownMenuItem } from "../ui/dropdown-menu"

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
    return (
        <Sidebar>
            <SidebarHeader>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                            Username
                            <ChevronDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-popper-anchor-width] bg-background">
                        <DropdownMenuItem>
                            <span>Account</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>QRaftHive</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
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
    )
}
