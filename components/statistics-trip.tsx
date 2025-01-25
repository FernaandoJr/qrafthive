interface Stat {
    value: string;
    label: string;
}

interface StatisticsTripProps {
    stats: Stat[];
}

export function StatisticsTrip({ stats }: StatisticsTripProps) {
    return (
        <div className="class p-4 md:p-6 mt-6 text-white bg-zinc-300 dark:bg-zinc-900 w-[110%] overflow-hidden">
            <div className="flex flex-wrap justify-around items-center">
                {stats.map((stat, index) => (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/4 py-8">
                        <div
                            className={`px-12 ${index !== stats.length - 1
                                ? 'lg:border-r md:border-r border-slate-900 dark:border-gray-200'
                                : ''
                                }`}
                        >
                            <h2 className="text-4xl text-slate-600 dark:text-slate-500 md:text-5xl font-semibold text-center">
                                {stat.value}
                            </h2>
                            <p className="mb-2 text-gray-950 dark:text-zinc-300 text-center">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
