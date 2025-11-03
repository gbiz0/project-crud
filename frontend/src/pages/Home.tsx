import { useEffect, useState } from "react"
import NavHeader from "@/components/NavHeader"
import { Card } from "@/components/ui/card"
import { getAllFornecedores } from "@/services/fornecedorService"
import { getAllContasPagar } from "@/services/contaPagarService"

export default function Home() {
  const [fornecedoresCount, setFornecedoresCount] = useState(0)
  const [contasPagarCount, setContasPagarCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fornecedores = await getAllFornecedores()
        const contasPagar = await getAllContasPagar()
        setFornecedoresCount(fornecedores.length)
        setContasPagarCount(contasPagar.length)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <NavHeader />
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Sistema!</h1>
          <p className="text-gray-600">Gerencie seus fornecedores e contas a pagar em um só lugar.</p>
        </div>
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-2">Total de Fornecedores</h2>
            <p className="text-3xl font-bold">{fornecedoresCount}</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-2">Total de Contas a Pagar</h2>
            <p className="text-3xl font-bold">{contasPagarCount}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}


