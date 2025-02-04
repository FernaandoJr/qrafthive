import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"

export const UserButton = () => {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <Spinner size="small" />
    }

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        window.location.href = "/"
    }

    return (
        <div className="flex items-center">
            {session ? (
                <DropdownMenu modal={true}>
                    <DropdownMenuTrigger className="outline-none relative flex items-center gap-2">
                        <Avatar className="hover:opacity-75 transition">
                            <AvatarImage className="size-10 hover:opacity-75 transition" src={session.user?.image || undefined} />
                            <AvatarFallback className="bg-sky-900 text-white select-none">{avatarFallback}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" side="bottom" className="p-4 flex flex-col items-center gap-2">
                        <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                        <Avatar className="transition size-16">
                            <AvatarImage className="size-20 transition" src={session.user?.image || undefined} />
                            <AvatarFallback className="bg-sky-900 text-3xl select-none text-white">{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <p className="scroll-m-20 text-xl font-semibold tracking-tight">Hi, {session.user?.name}!</p>
                        <Button className="w-full rounded-full h-fit border-border border" variant="ghost">
                            <Link href="/dashboard">Manage Account</Link>
                        </Button>
                        <Button onClick={handleSignOut} className="h-fit w-full rounded-full" variant="destructive">
                            Sign out
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex justify-end p-4 gap-4">
                    <Button onClick={() => router.push("/login")}>Sign in</Button>
                </div>
            )}
        </div>
    )
}
