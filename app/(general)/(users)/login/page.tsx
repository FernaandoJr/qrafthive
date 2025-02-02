import SigninForm from "@/components/forms/signin-form"

export default function Home() {
    return (
        <>
            <div className="relative flex items-center justify-center min-h-full bg-dark px-4 py-8">
                <div className="register-form flex flex-col items-center justify-center w-full md:max-w-lg bg-transparent rounded-2xl px-6 py-8 relative">
                    <SigninForm />
                </div>
            </div>
        </>
    )
}
