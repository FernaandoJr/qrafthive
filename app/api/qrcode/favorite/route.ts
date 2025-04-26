import connectToDatabase from "@/lib/mongoose"
import QRCode from "@/models/QRCode"

export async function POST(req: Request) {
    await connectToDatabase()
        .then(() => {
            console.log("Connected to MongoDB")
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error)
            throw new Response(JSON.stringify({ message: "Database connection error" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        })

    const body = (await req.json()) as QRCode

    const existingQRCode = await QRCode.exists({
        owner: body.owner,
        "attributes.content": body.attributes.content,
        "attributes.size": body.attributes.size,
        "attributes.marginSize": body.attributes.marginSize,
        "attributes.fgColor": body.attributes.fgColor,
        "attributes.bgColor": body.attributes.bgColor,
        "attributes.errorLevel": body.attributes.errorLevel,
        "attributes.boostLevel": body.attributes.boostLevel,
        "attributes.imageSettings.src": body.attributes.imageSettings.src,
        "attributes.imageSettings.excavate": body.attributes.imageSettings.excavate,
        "attributes.imageSettings.height": body.attributes.imageSettings.height,
        "attributes.imageSettings.width": body.attributes.imageSettings.width,
        "attributes.imageSettings.x": body.attributes.imageSettings.x,
        "attributes.imageSettings.y": body.attributes.imageSettings.y,
    })
    if (existingQRCode) {
        console.log("Existing QRCode found:", existingQRCode)
        return new Response(JSON.stringify({ message: "QRCode already exists" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    await QRCode.create({ ...body, collection: "qrcodes" })

    return new Response(JSON.stringify({ message: "QRCode created" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    })
}
