// app/welcome/page.tsx
export default function WelcomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">🎉 Bem-vindo!</h1>
                <p className="text-gray-700 mb-6">
                    Seu e‑mail foi confirmado com sucesso. Agora você já pode começar a usar a aplicação.
                </p>
                <a
                    href="/dashboard"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Ir para o Dashboard
                </a>
            </div>
        </main>
    )
}