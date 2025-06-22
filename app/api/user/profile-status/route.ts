import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import connectDB from "@/lib/mongoose"

export async function GET() {
    try {
        // Verificar se o usuário está autenticado
        const session = await getServerSession()
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            )
        }

        // Conectar ao banco de dados
        await connectDB()

        // Buscar o usuário no banco de dados
        const user = await User.findOne({ email: session.user.email })

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            hasBirthDate: !!user.birthDate,
            birthDate: user.birthDate,
            isProfileComplete: !!user.birthDate
        })

    } catch (error) {
        console.error("Erro ao verificar status do perfil:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
} 