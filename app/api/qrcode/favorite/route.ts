import connectToDatabase from "@/lib/mongoose"
import QRCode from "@/models/QRCode"

export async function POST(req: Request) {
    await connectToDatabase()

    const body = (await req.json()) as QRCode

    QRCode.create({ ...body, collection: "qrcodes" })

    return new Response(JSON.stringify({ message: "QRCode created" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    })
}
