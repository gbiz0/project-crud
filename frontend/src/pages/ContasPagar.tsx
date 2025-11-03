import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NavHeader from "@/components/NavHeader"
import {
  getAllContasPagar,
  createContaPagar,
  updateContaPagar,
  deleteContaPagar,
  getFornecedoresForSelect,
  type ContaPagar,
  type CreateContaPagarRequest,
} from "@/services/contaPagarService"
import { type Fornecedor } from "@/services/fornecedorService"
import { toast } from "sonner"

export default function ContasPagar() {
  const [contas, setContas] = useState<ContaPagar[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConta, setEditingConta] = useState<ContaPagar | null>(null)
  const [formData, setFormData] = useState({
    descricao: "",
    datavencimento: "",
    valor: "",
    datapagamento: "",
    valorpago: "",
    fornecedorid: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [contasData, fornecedoresData] = await Promise.all([
        getAllContasPagar(),
        getFornecedoresForSelect(),
      ])
      setContas(contasData)
      setFornecedores(fornecedoresData)
    } catch (err: any) {
      const generic = "Ocorreu um erro ao carregar dados"
      let message = generic
      try {
        const parsed = JSON.parse(err?.message || "{}")
        if (parsed && typeof parsed.message === "string" && parsed.message.trim().length > 0) {
          message = parsed.message
        }
      } catch {}
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenDialog(conta?: ContaPagar) {
    if (conta) {
      setEditingConta(conta)
      setFormData({
        descricao: conta.Descricao,
        datavencimento: conta.DataVencimento.split("T")[0],
        valor: conta.Valor.toString(),
        datapagamento: conta.DataPagamento ? conta.DataPagamento.split("T")[0] : "",
        valorpago: conta.ValorPago ? conta.ValorPago.toString() : "",
        fornecedorid: conta.FornecedorID.toString(),
      })
    } else {
      setEditingConta(null)
      setFormData({
        descricao: "",
        datavencimento: "",
        valor: "",
        datapagamento: "",
        valorpago: "",
        fornecedorid: "",
      })
    }
    setIsDialogOpen(true)
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
    setEditingConta(null)
    setFormData({
      descricao: "",
      datavencimento: "",
      valor: "",
      datapagamento: "",
      valorpago: "",
      fornecedorid: "",
    })
  }

  function formatCurrency(value: string): string {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) return ""
    const number = parseFloat(numbers) / 100
    return number.toFixed(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.descricao.trim()) {
      toast.error("Descrição é obrigatória")
      return
    }
    if (!formData.datavencimento) {
      toast.error("Data de vencimento é obrigatória")
      return
    }
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast.error("Valor é obrigatório e deve ser maior que zero")
      return
    }
    if (!formData.fornecedorid) {
      toast.error("Fornecedor é obrigatório")
      return
    }

    try {
      const payload: CreateContaPagarRequest = {
        descricao: formData.descricao.trim(),
        datavencimento: formData.datavencimento,
        valor: parseFloat(formData.valor),
        datapagamento: formData.datapagamento.trim() || undefined,
        valorpago: formData.valorpago.trim() ? parseFloat(formData.valorpago) : undefined,
        fornecedorid: parseInt(formData.fornecedorid),
      }

      if (editingConta) {
        await updateContaPagar(editingConta.ID, payload)
        toast.success("Conta a pagar atualizada com sucesso")
      } else {
        await createContaPagar(payload)
        toast.success("Conta a pagar criada com sucesso")
      }

      handleCloseDialog()
      loadData()
    } catch (err: any) {
      const generic = "Ocorreu um erro durante a solicitação"
      let message = generic
      try {
        const parsed = JSON.parse(err?.message || "{}")
        if (parsed && typeof parsed.message === "string" && parsed.message.trim().length > 0) {
          message = parsed.message
        }
      } catch {}
      toast.error(message)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta conta a pagar?")) {
      return
    }

    try {
      await deleteContaPagar(id)
      toast.success("Conta a pagar excluída com sucesso")
      loadData()
    } catch (err: any) {
      const generic = "Ocorreu um erro ao excluir conta a pagar"
      let message = generic
      try {
        const parsed = JSON.parse(err?.message || "{}")
        if (parsed && typeof parsed.message === "string" && parsed.message.trim().length > 0) {
          message = parsed.message
        }
      } catch {}
      toast.error(message)
    }
  }

  function formatDate(dateString: string): string {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  function formatMoney(value: number | null): string {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  function getFornecedorNome(id: number): string {
    const fornecedor = fornecedores.find((f) => f.ID === id)
    return fornecedor?.NomeFantasia || "-"
  }

  return (
    <div>
      <NavHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-left">Contas a Pagar</h1>
            <p className="text-muted-foreground">Gerencie suas contas a pagar</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>Nova Conta</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingConta ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}
                </DialogTitle>
                <DialogDescription>
                  {editingConta
                    ? "Atualize as informações da conta a pagar"
                    : "Preencha os dados para criar uma nova conta a pagar"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Input
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) =>
                        setFormData({ ...formData, descricao: e.target.value })
                      }
                      placeholder="Descrição da conta"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="datavencimento">Data de Vencimento *</Label>
                      <Input
                        id="datavencimento"
                        type="date"
                        value={formData.datavencimento}
                        onChange={(e) =>
                          setFormData({ ...formData, datavencimento: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor *</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.valor}
                        onChange={(e) =>
                          setFormData({ ...formData, valor: e.target.value })
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fornecedorid">Fornecedor *</Label>
                    <Select
                      value={formData.fornecedorid}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fornecedorid: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {fornecedores.map((fornecedor) => (
                          <SelectItem key={fornecedor.ID} value={fornecedor.ID.toString()}>
                            {fornecedor.NomeFantasia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="datapagamento">Data de Pagamento</Label>
                      <Input
                        id="datapagamento"
                        type="date"
                        value={formData.datapagamento}
                        onChange={(e) =>
                          setFormData({ ...formData, datapagamento: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorpago">Valor Pago</Label>
                      <Input
                        id="valorpago"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.valorpago}
                        onChange={(e) =>
                          setFormData({ ...formData, valorpago: e.target.value })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingConta ? "Atualizar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando...
          </div>
        ) : contas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma conta a pagar cadastrada
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contas.map((conta, index) => (
                  <TableRow key={conta.ID || `conta-${index}`}>
                    <TableCell>{conta.ID}</TableCell>
                    <TableCell className="font-medium">{conta.Descricao}</TableCell>
                    <TableCell>{getFornecedorNome(conta.FornecedorID)}</TableCell>
                    <TableCell>{formatDate(conta.DataVencimento)}</TableCell>
                    <TableCell>{formatMoney(conta.Valor)}</TableCell>
                    <TableCell>{formatDate(conta.DataPagamento || "")}</TableCell>
                    <TableCell>{formatMoney(conta.ValorPago)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenDialog(conta)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(conta.ID)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

