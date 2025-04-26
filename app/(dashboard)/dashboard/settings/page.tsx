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
import { Save, Trash2 } from "lucide-react"

const fetchUser = async () => {
    const response = await fetch("../../../api/user")
    const data = (await response.json()) as User
    return data
}

export default function SettingsPage() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const [currentUser, setCurrentUser] = useState<User>()

    useEffect(() => {
        const fetchAndSetUser = async () => {
            const data = await fetchUser()
            setCurrentUser(data)
        }
        fetchAndSetUser()
        console.log(currentUser)
    }, [])

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
                    <div className="flex place-items-center gap-4">
                        <Avatar className="hover:opacity-75 transition size-24">
                            <AvatarImage className=" hover:opacity-75 transition" src={session?.user?.image || undefined} />
                            <AvatarFallback className="bg-sky-900 text-white select-none text-4xl">{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <p className="text-2xl">{session?.user.name}</p>
                    </div>

                    {/* NÃO CONSIGO FAZER A PORRA DO AUTOCOMPLETE OFF fica autocompletando */}
                    <form className="flex flex-col gap-4" autoComplete="off">
                        <div>
                            <Label htmlFor="fullname" className="text-normal">
                                Full Name
                            </Label>
                            <Input id="fullname" name="fullname" />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-normal">
                                Email
                            </Label>
                            <Input id="email" name="email" type="email" />
                        </div>
                        <div>
                            <Label htmlFor="current-password" className="text-normal">
                                Current Password
                            </Label>
                            <Input id="current-password" name="current-password" type="password" />
                        </div>
                        <div>
                            <Label htmlFor="new-password" className="text-normal">
                                New Password
                            </Label>
                            <Input id="new-password" name="new-password" type="password" />
                        </div>
                        <div>
                            <Label htmlFor="confirm-new-password" className="text-normal">
                                Confirm New Password
                            </Label>
                            <Input id="confirm-new-password" name="confirm-new-password" type="password" />
                        </div>
                        <div className="">
                            <Button variant={"expandIcon"} Icon={() => <Save className="h-4 w-4" />} iconPlacement="left" type="button">
                                Save
                            </Button>
                        </div>
                    </form>
                    <div className="">
                        <Button
                            variant={"expandIcon"}
                            className="bg-red-600 text-background  hover:bg-red-700"
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
