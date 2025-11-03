import { Button } from "@/components/ui/button"
import { logout } from "@/services/auth"
import { Link, useNavigate } from "react-router-dom"

export default function NavHeader() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-semibold text-lg">
              App
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/fornecedores" className="text-muted-foreground hover:text-foreground transition-colors">
              Fornecedores
            </Link>
            <Link to="/contas-pagar" className="text-muted-foreground hover:text-foreground transition-colors">
              Contas a Pagar
            </Link>
          </nav>
          <Button variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}

