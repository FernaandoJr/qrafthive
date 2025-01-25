import Link from 'next/link';
import { BackgroundBeams } from "../components/ui/background-beams"

export function Hero() {
    return (
        <div className="h-600px flex md:min-h-[80vh] flex-col w-full gap-4 items-center justify-center px-4">
            <div className="text-3xl md:text-7xl mx-60 font-bold dark:text-white text-center">
                Unlock Infinite Possibilities with a custom <span className="text-slate-600 dark:text-slate-500">QR Code</span>.
            </div>
            <div className="font-extralight text-center md:text-4xl dark:text-neutral-200 py-4">
                Create, share, and connect seamlessly in seconds.
            </div>
            <Link href="/qrcode" className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                Generate Now  &rarr;
            </Link>
            <BackgroundBeams />

        </div>
    )
}
