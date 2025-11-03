import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { register } from "@/services/auth"
import { toast } from "sonner"


export default function Register() {
    const navigate = useNavigate()
    const [loginValue, setLoginValue] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await register({ login: loginValue, senha: password })
            toast.success("Conta criada com sucesso")
            navigate("/login")
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
                    <CardTitle>Criar conta</CardTitle>
                    <CardDescription>Cadastre-se para acessar o sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="login" className="block w-full text-left">Login</Label>
                            <Input id="login" type="text" placeholder="seu_login" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="block w-full text-left">Senha</Label>
                            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Enviando..." : "Criar conta"}</Button>
                    </form>

                    {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Já tem conta? <Link to="/login" className="underline">Entrar</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}


