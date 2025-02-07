import { Separator } from "../ui/separator"
import { NumberTicker } from "../ui/number-ticker"

export function StatisticsSection() {
    return (
        // <div className="container class p-4 md:p-6 mx-auto mt-6 text-white overflow-hidden w-full">
        //     <div className="flex flex-wrap justify-around items-center gap-8">
        //         <div className={`px-12 lg:border-r md:border-r border-slate-900 dark:border-gray-200`}>
        //             <h2 className="text-4xl text-slate-600 dark:text-slate-500 md:text-5xl font-semibold text-center">
        //                 <NumberTicker className="text-slate-600 dark:text-slate-500" value={1000} decimalPlaces={0} delay={0.1} /> +
        //             </h2>
        //             <p className="mb-2 text-gray-950 dark:text-zinc-300 text-center">{"Shared Links"}</p>
        //         </div>

        //         <div className={`px-12 lg:border-r md:border-r border-slate-900 dark:border-gray-200`}>
        //             <h2 className="text-4xl text-slate-600 dark:text-slate-500 md:text-5xl font-semibold text-center">
        //                 <NumberTicker className="text-slate-600 dark:text-slate-500" value={10000} decimalPlaces={0} delay={0.1} />+
        //             </h2>
        //             <p className="mb-2 text-gray-950 dark:text-zinc-300 text-center">{"QR Codes possibilities"}</p>
        //         </div>

        //         <div className={`px-12 lg:border-r md:border-r border-slate-900 dark:border-gray-200`}>
        //             <h2 className="text-4xl text-slate-600 dark:text-slate-500 md:text-5xl font-semibold text-center">
        //                 <NumberTicker className="text-slate-600 dark:text-slate-500" value={350} decimalPlaces={0} delay={0.1} />+
        //             </h2>
        //             <p className="mb-2 text-gray-950 dark:text-zinc-300 text-center">{"Satisfied Users"}</p>
        //         </div>
        //     </div>
        // </div>
        <div className="container grid lg:grid-cols-5 gap-4 md:grid md:grid-cols-1">
            <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-bold flex flex-col items-center justify-center">
                    <NumberTicker value={1000} />
                    <p className="text-xl text-muted-foreground">Total Downloads</p>
                </span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Separator orientation="vertical" className="h-12" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-bold flex flex-col items-center justify-center">
                    <NumberTicker value={150} />
                    <p className="text-xl text-muted-foreground">Unique users</p>
                </span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Separator orientation="vertical" className="h-12" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-bold flex flex-col items-center justify-center">
                    <NumberTicker value={2000} />
                    <p className="text-xl text-muted-foreground">Total Scans</p>
                </span>
            </div>
        </div>
    )
}
