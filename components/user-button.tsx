import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Spinner } from "./ui/spinner"

export const UserButton = () => {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <Spinner size="small" />
    }

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push("/login")
    }

    return (
        <div className="flex items-center">
            {session ? (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="outline-none relative flex items-center gap-2">
                        <Avatar className="hover:opacity-75 transition">
                            <AvatarImage className="size-10 hover:opacity-75 transition" src={session.user?.image || undefined} />
                            <AvatarFallback className="bg-sky-900 text-white">{avatarFallback}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" side="bottom" className="w-48">
                        <DropdownMenuItem className="h-10" onClick={handleSignOut}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex justify-end p-4 gap-4">
                    <Button>
                        <Link href="/login">Sign in</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
