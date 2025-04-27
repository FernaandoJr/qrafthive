/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import User from "@/models/User"
import { Button } from "@/components/ui/button"
import { Edit, LockKeyhole, RectangleEllipsis, Save, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const fetchUser = async (session: { user: { id: string } }): Promise<User> => {
    const response = await fetch(`../../../api/settings/user?id=${session.user.id}`)
    const data = (await response.json()) as User
    return data
}

export default function SettingsPage() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const [currentUser, setCurrentUser] = useState<User>()

    useEffect(() => {
        if (status === "authenticated") {
            const fetchAndSetUser = async () => {
                const data = (await fetchUser(session)) as User
                setCurrentUser(data)
                console.log("data", data)
            }
            fetchAndSetUser()
        }
    }, [status, session])

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="small" />
            </div>
        )
    }

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase()

    console.log("session", session)

    return (
        <div className="container mx-auto">
            <div className="w-full flex flex-col items-center gap-2">
                <h1 className="text-title">Settings</h1>
                <p className="text-subtitle w-1/2 text-center">
                    Manage your account settings, including profile information, security options, and notification preferences.
                </p>
            </div>
            <div className="mx-36 p-8 border-border border rounded-xl mt-4">
                <div className=" flex flex-col gap-4">
                    <p className="text-xl font-bold">Edit account information</p>
                    <div className="flex place-items-center gap-4">
                        <Avatar className="transition size-24">
                            <AvatarImage className=" transition" src={session?.user?.image || undefined} />
                            <AvatarFallback className="bg-sky-900 text-white select-none text-4xl">{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                            <Label>Upload image</Label>
                            <Input type="file" accept="image/*" placeholder="Change Profile Picture" aria-label="Change Profile Picture" />
                        </div>
                    </div>

                    {/* NÃO CONSIGO FAZER A PORRA DO AUTOCOMPLETE OFF fica autocompletando */}
                    <form className="flex flex-col gap-4" autoComplete="OFF">
                        <div className="flex flex-row justify-between">
                            <Label htmlFor="fullname" className="text-normal">
                                Full Name
                            </Label>
                            <div className="flex flex-row gap-2 place-items-center ">
                                <Label className="text-muted-foreground">{currentUser?.fullName}</Label>
                                <Edit className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <Label htmlFor="fullname" className="text-normal">
                                Email Address
                            </Label>
                            <div className="flex flex-row gap-2 place-items-center ">
                                <Label className="text-muted-foreground">{currentUser?.email}</Label>
                                <Edit className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                            </div>
                        </div>

                        <Separator className="my-4" />
                        {/* PASSWORD */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xl font-bold">Security</p>
                            <Button
                                className="w-fit"
                                variant={"expandIcon"}
                                Icon={() => <LockKeyhole className="h-4 w-4" />}
                                iconPlacement="right"
                                type="button"
                            >
                                Change password
                            </Button>
                        </div>
                    </form>
                    <div className="">
                        <Button
                            variant={"expandIcon"}
                            className="bg-red-600 text-white hover:bg-red-700"
                            Icon={() => <Trash2 className="h-4 w-4" />}
                            iconPlacement="right"
                            type="button"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
