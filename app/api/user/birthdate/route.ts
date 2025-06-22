import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import connectDB from "@/lib/mongoose"

export async function POST(request: NextRequest) {
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

        // Obter os dados do corpo da requisição
        const { birthDate } = await request.json()

        if (!birthDate) {
            return NextResponse.json(
                { error: "Data de nascimento é obrigatória" },
                { status: 400 }
            )
        }

        // Validar se a data é válida
        const date = new Date(birthDate)
        if (isNaN(date.getTime())) {
            return NextResponse.json(
                { error: "Data de nascimento inválida" },
                { status: 400 }
            )
        }

        // Verificar se a data não é no futuro
        if (date > new Date()) {
            return NextResponse.json(
                { error: "Data de nascimento não pode ser no futuro" },
                { status: 400 }
            )
        }

        // Atualizar o usuário no banco de dados
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { birthDate: date },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { 
                message: "Data de nascimento atualizada com sucesso",
                birthDate: updatedUser.birthDate 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Erro ao atualizar data de nascimento:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
} 