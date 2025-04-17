/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Spinner } from "@/components/ui/spinner";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <Spinner size="small" />;
    }

    if (!session) {
        // Redireciona para a página de login se o usuário não estiver autenticado
        router.push("/login");
        return null;
    }

    return (
        <div>
            <p>Bem-vindo, {session.user?.name || "Usuário"}!</p>
        </div>
    );
}