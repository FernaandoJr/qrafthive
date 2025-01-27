import Image from "next/image";

export default function Examples() {
    return (
        <section className="rounded-md flex justify-center text-gray-600 body-font">
            <div className="container max-w-screen-lg py-4 flex items-center justify-around flex-wrap lg:flex-nowrap ">
                <div className="lg:w-1/2 flex flex-col lg:items-start items-center justify-center text-center lg:text-left md:mx-6 max-w-lg">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium font-bold text-slate-600 dark:text-gray-200">
                        See the Power of Custom
                        <br className="hidden lg:inline-block" /> QR Codes in Action
                    </h1>
                    <p className="mb-8 leading-relaxed ">
                        Personalize every detail to make your QR codes stand out. Perfect for your business, events, or personal touch.
                    </p>
                    <div className="flex justify-center lg:justify-start">
                        <button className="inline-flex text-white bg-slate-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                            Customize Yours Now
                        </button>
                    </div>
                </div>

                <div className="h-[26rem] w-full flex items-center justify-center ">
                    <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                        <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-600 dark:text-gray-200">
                            Your Custom QR Code
                        </h3>
                        <div className="text-base !m-0 !p-0 font-normal">
                            <p>
                                Customize with your logo and share with style.
                            </p>
                        </div>
                        <Image
                            src="/image.jpg"
                            width={400}
                            height={400}
                            alt="QR Code Example"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    )

}