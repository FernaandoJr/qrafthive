import SignInFormDemo from "../../components/signin-form-demo";
import SignupFormDemo from "../../components/signup-form-demo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import { BackgroundBeams } from "../../components/ui/background-beams";

export default function Home() {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-dark px-4 py-8">
            <div className="register-form flex flex-col items-center justify-center w-full md:max-w-lg bg-transparent rounded-2xl px-6 py-8">
                <Tabs defaultValue="login" className="container flex flex-col items-center w-full">
                    <TabsList className="grid grid-cols-2 gap-4 mb-6 w-full">
                        <TabsTrigger value="login" className="text-center" aria-label="Login">
                            Login
                        </TabsTrigger>
                        <TabsTrigger value="register" className="text-center" aria-label="Register">
                            Register
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="w-full">
                        <SignInFormDemo />
                    </TabsContent>
                    <TabsContent value="register" className="w-full">
                        <SignupFormDemo />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
