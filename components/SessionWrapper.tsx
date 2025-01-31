"use client" // Necessário para usar React Context

import { SessionProvider } from "next-auth/react"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
}
