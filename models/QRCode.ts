import mongoose, { Document, Model, ObjectId, Schema } from "mongoose"

interface QRCode extends Document {
    owner: ObjectId
    attributes: {
        content: string
        size: number
        marginSize: number
        fgColor: string
        bgColor: string
        level: "L" | "M" | "Q" | "H"
        boostLevel: boolean
        imageSettings: {
            src: string
            excavate: boolean
            height: number
            width: number
            x: number
            y: number
        }
    }
}

const QRCodeSchema: Schema<QRCode> = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, required: true },
    attributes: {
        content: { type: String, required: true },
        size: { type: Number, required: true },
        marginSize: { type: Number, required: true },
        fgColor: { type: String, required: true },
        bgColor: { type: String, required: true },
        level: { type: String, enum: ["L", "M", "Q", "H"], required: true },
        boostLevel: { type: Boolean, required: true },
        imageSettings: {
            src: { type: String, required: true },
            excavate: { type: Boolean, required: true },
            height: { type: Number, required: true },
            width: { type: Number, required: true },
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
    },
})

const QRCode: Model<QRCode> = mongoose.models.QRCode || mongoose.model<QRCode>("QRCode", QRCodeSchema)
