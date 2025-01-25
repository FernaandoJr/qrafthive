import ButtonLink from "@/components/ui/buttonlink"
import Link from "next/link"
import { QrCode } from "lucide-react"
import { ModeToggle } from "@/components/ui/theme-menu"

const navLinks = [
    {
        name: "Login",
        path: "/login",
    },
    {
        name: "QRCode",
        path: "/qrcode",
    },
]

const Navbar = () => {
    return (
        <div className="w-full">
            <header className="flex h-auto w-full flex-row p-4">
                <Link href={"/"} className="my-auto">
                    <QrCode className="h-7 w-7" />
                    <span className="sr-only">Home Icon</span>
                </Link>
                <nav className="ml-auto flex items-center">
                    {navLinks.map((link, index) => (
                        <ButtonLink key={index} path={link.path} name={link.name} />
                    ))}
                    <ModeToggle />
                </nav>
            </header>
        </div>
    )
}

export default Navbar
