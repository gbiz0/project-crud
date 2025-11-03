import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { login, saveToken } from "@/services/auth"
import { toast } from "sonner"


export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await login({ login: email, senha: password })
            await saveToken(res.token)
            toast.success("Login realizado com sucesso")
            navigate("/")
        } catch (err: any) {
            const generic = "Ocorreu um erro durante a solicitação"
            let message = generic
            try {
                const parsed = JSON.parse(err?.message || "{}")
                if (parsed && typeof parsed.message === "string" && parsed.message.trim().length > 0) {
                    message = parsed.message
                }
            } catch {}
            setError(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 overflow-hidden flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Entrar</CardTitle>
                    <CardDescription>Acesse sua conta para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block w-full text-left">Login</Label>
                            <Input id="email" type="text" placeholder="seu_login" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                            </div>
                            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Enviando..." : "Entrar"}</Button>
                    </form>

                    {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Não tem conta? <Link to="/register" className="underline">Criar uma</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}