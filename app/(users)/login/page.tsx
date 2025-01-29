import SignInFormDemo from "../../../components/forms/signin-form-demo"

export default function Home() {
    return (
        <>
            <div className="relative flex items-center justify-center min-h-full bg-dark px-4 py-8">
                <div className="register-form flex flex-col items-center justify-center w-full md:max-w-lg bg-transparent rounded-2xl px-6 py-8 relative">
                    <h1 className="text-2xl font-bold">Log in</h1>
                    <SignInFormDemo />
                </div>
            </div>
        </>
    )
}
