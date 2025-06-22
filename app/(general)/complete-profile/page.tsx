"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function CompleteProfile() {
    const [birthDate, setBirthDate] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!birthDate) {
            toast.error("Por favor, informe sua data de nascimento")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/user/birthdate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ birthDate }),
            })

            if (!response.ok) {
                throw new Error("Erro ao salvar data de nascimento")
            }

            toast.success("Perfil completado com sucesso!")
            router.push("/")
        } catch (error) {
            console.error("Erro:", error)
            toast.error("Erro ao salvar data de nascimento. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Complete seu perfil
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Para continuar, precisamos de algumas informações adicionais
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                                Data de Nascimento
                            </Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                                className="w-full"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Salvando..." : "Completar Perfil"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 