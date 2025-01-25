import Link from 'next/link';
import Examples from '../components/examples'
import { BackgroundBeams } from "../components/ui/background-beams"
import { StatisticsTrip } from '@/components/statistics-trip';

export default function Home() {

  const stats = [
    { value: "1,000+", label: "Shared Links" },
    { value: "10,000+", label: "QR Codes possibilities" },
    { value: "350+", label: "Satisfied users" },
  ];

  return (
    <div className="my-10 min-h-full flex md:min-h-[120vh] flex-col w-full gap-4 items-center justify-center px-4 overflow-x-hidden">
      <div className="text-3xl md:text-7xl mx-60 font-bold dark:text-white text-center">
        Unlock Infinite Possibilities with a custom <span className="text-slate-500">QR Code</span>.
      </div>
      <div className="font-extralight text-center md:text-4xl dark:text-neutral-200 py-4">
        Create, share, and connect seamlessly in seconds.
      </div>
      <Link href="/qrcode" className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
        Generate Now  &rarr;
      </Link>
      <BackgroundBeams />

      <StatisticsTrip stats={stats} />
      <Examples />
    </div>
  );
}
