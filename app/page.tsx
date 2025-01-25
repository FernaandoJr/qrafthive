import Examples from "../components/examples"

export default function Home() {
    return (
        <div className="mt-16 flex md:h-full flex-col w-full gap-4 items-center justify-center px-4">
            <div className="text-3xl md:text-7xl mx-60 font-bold dark:text-white text-center">
                Unlock Infinite Possibilities with a custom <span className="text-slate-500">QR Code</span>.
            </div>
            <div className="font-extralight text-center md:text-4xl dark:text-neutral-200 py-4">Create, share, and connect seamlessly in seconds.</div>
            <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">Generate Now &rarr;</button>

            <section className="section-2 w-full my-16 min-h-screen bg-zinc-900 bg-[linear-gradient(to_bottom,_#082740_1px,_transparent_1px),_linear-gradient(to_right,_#082740_1px,_transparent_1px)] [background-size:30px_30px] bg-center overflow-x-hidden animate-bgmove">
                <Examples />
            </section>
        </div>
    )
}
