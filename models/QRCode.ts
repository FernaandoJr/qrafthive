import mongoose, { Document, Model, ObjectId, Schema } from "mongoose"

type ErrorLevel = "L" | "M" | "Q" | "H"

interface QRCode extends Document {
    owner: ObjectId
    attributes: {
        content: string
        size: number
        marginSize: number
        fgColor: string
        bgColor: string
        errorlevel: ErrorLevel
        boostLevel: boolean
        imageSettings: {
            src: string
            excavate: boolean
            height: number
            width: number
            x: number | null
            y: number | null
        }
    }
}

const QRCodeSchema: Schema<QRCode> = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, required: true },
    attributes: {
        content: { type: String, required: true },
        size: { type: Number, required: true },
        errorLevel: { type: String, enum: ["L", "M", "Q", "H"], required: true },
        marginSize: { type: Number, required: true },
        boostLevel: { type: Boolean, required: true },
        fgColor: { type: String, required: true },
        bgColor: { type: String, required: true },
        imageSettings: {
            src: { type: String, required: true },
            excavate: { type: Boolean, required: true },
            height: { type: Number, required: true },
            width: { type: Number, required: true },
            x: { type: Number, default: null },
            y: { type: Number, default: null },
        },
    },
})

const QRCode: Model<QRCode> = mongoose.models.QRCode || mongoose.model<QRCode>("QRCode", QRCodeSchema)

export default QRCode
