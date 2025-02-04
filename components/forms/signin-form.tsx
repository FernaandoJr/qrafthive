"use client"
import { Eye, EyeOff, QrCode, TriangleAlert } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"
import { RiGithubFill, RiGoogleFill } from "@remixicon/react"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"

export default function SigninForm() {
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setPending(true)

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if (res?.ok) {
            router.push("/")
            toast.success("Login successful")
        } else if (res?.status == 401) {
            setError("Invalid Credentials")
            setPending(false)
        } else {
            setError("Something went wrong")
            setPending(false)
        }
    }

    const handleProvider = async (event: React.MouseEvent<HTMLButtonElement>, value: "github" | "google") => {
        event.preventDefault()
        signIn(value, { callbackUrl: "/" })
    }

    return (
        <div className="flex flex-col items-center justify-center p-5 border-border border rounded-2xl gap-4">
            {/* CARD TITLE SECTION */}
            <div className="flex flex-col items-center justify-center w-full">
                <QrCode className="mb-2 h-8 w-8" />
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Welcome back!</h4>
                <p className="text-sm text-muted-foreground">Enter your credentials to login to your account.</p>
            </div>

            {/* FORM SECTION */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
                <div className="flex flex-col w-full gap-4">
                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="email@example.com"
                            disabled={pending}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative w-full max-w-sm items-center gap-3">
                        <Label htmlFor="email">Password</Label>
                        <Input
                            id="email"
                            placeholder="Password"
                            type={isVisible ? "text" : "password"}
                            disabled={pending}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute top-6 right-0" onClick={toggleVisibility}>
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {/* REMEMBER ME */}
                    <div className="flex flex-row gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.99 }} className="flex">
                            <Checkbox id="boost-level" onCheckedChange={() => {}} />
                        </motion.div>
                        <div className="flex justify-between w-full">
                            <Label htmlFor="boost-level">Remember me</Label>
                            <Link
                                href={"#"}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-500 underline	"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    {!!error && (
                        <div className="flex items-center gap-1 bg-destructive/15 p-2 rounded-md">
                            <TriangleAlert className="text-red-700 h-4 w-4" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    {/* SIGN IN BUTTON */}
                    <div className="flex flex-col gap-4">
                        <Button type="submit" variant="default" className="w-full" disabled={pending}>
                            {pending ? "Signing in..." : "Sign in"}
                            {pending ? <Spinner className="h-5 w-5 ml-2 text-white dark:text-black" /> : null}
                        </Button>
                        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                            <span className="text-xs text-muted-foreground">Or</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={(e) => handleProvider(e, "google")}
                                className="bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90"
                            >
                                <span className="pointer-events-none me-2 flex-1">
                                    <RiGoogleFill className="opacity-60" size={16} aria-hidden="true" />
                                </span>
                                Login with Google
                            </Button>

                            <Button
                                onClick={(e) => handleProvider(e, "github")}
                                className="bg-[#333333] text-white after:flex-1 hover:bg-[#333333]/90"
                            >
                                <span className="pointer-events-none me-2 flex-1">
                                    <RiGithubFill className="opacity-60" size={16} aria-hidden="true" />
                                </span>
                                Login with GitHub
                            </Button>
                        </div>
                    </div>
                    <div className="">
                        <p className="text-muted-foreground text-sm max-w-sm mt-2 ">
                            Don&apos;t have an account?{" "}
                            <Link href={"/register"} className="text-blue-400">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
