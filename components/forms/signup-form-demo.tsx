"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

export default function SignupFormDemo() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [pending, setPending] = useState(false)
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json()

        if (res.ok) {

            setPending(false);
            toast.success(data.message)
            router.push("/login")

        } else if (res.status === 400) {

            setError(data.message)
            setPending(false)
        } else if (res.status === 500) {
            setError(data.message)
            setPending(false)

        }
    }

    return (
        <div className="max-w-md w-full mx-auto rounded-2xl md:rounded-2xl p-4 mt-4 md:p-8 shadow-input bg-slate-300 dark:bg-black">
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert />
                    <p>{error}</p>
                </div>
            )}


            <h2 className="font-bold text-xl">Welcome to QRaftHive</h2>
            <p className="text-muted-foreground text-sm max-w-sm mt-2 ">
                Already have an account?{" "}
                <Link href={"/login"} className="text-blue-400">
                    Log In
                </Link>
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="fullName">Full name</Label>
                        <Input id="fullName" name="fullName" disabled={pending} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="ex: John Doe" type="text" required />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" disabled={pending} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@gmail.com" type="email" required />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" disabled={pending} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" type="password" required />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input id="confirm" name="password" disabled={pending} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" type="password" required />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    disabled={pending}
                >
                    {pending ? "Signing up..." : "Sign up →"}
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col space-y-4">
                    <button
                        className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                    >
                        <span className="text-primary text-sm">GitHub</span>
                        <BottomGradient />
                    </button>
                    <button
                        className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                    >
                        <span className="text-primary text-sm">Google</span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
