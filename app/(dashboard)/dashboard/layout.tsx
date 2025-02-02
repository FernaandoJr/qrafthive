/* eslint-disable @typescript-eslint/no-unused-vars */

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar"
import ClientProvider from "@/components/ClientProvider"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Inter } from "next/font/google"
import { Header } from "@/components/layouts/header"

const inter = Inter({ subsets: ["latin"] })

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
                <ClientProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <SidebarProvider>
                            <DashboardSidebar />
                            <div className="">{children}</div>
                        </SidebarProvider>
                    </ThemeProvider>
                </ClientProvider>
            </body>
        </html>
    )
}
