export default function CompleteProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br">
            {children}
        </div>
    )
} 