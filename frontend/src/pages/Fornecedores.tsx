import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  getAllFornecedores,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
  type Fornecedor,
  type CreateFornecedorRequest,
} from "@/services/fornecedorService"
import { toast } from "sonner"

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null)
  const [formData, setFormData] = useState({
    nomefantasia: "",
    razaosocial: "",
    cnpj: "",
  })

  useEffect(() => {
    loadFornecedores()
  }, [])

  function formatCNPJ(value: string): string {
    const digits = value.replace(/\D/g, "")
    
    const limitedDigits = digits.slice(0, 14)
    
    if (limitedDigits.length <= 2) {
      return limitedDigits
    } else if (limitedDigits.length <= 5) {
      return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(2)}`
    } else if (limitedDigits.length <= 8) {
      return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(2, 5)}.${limitedDigits.slice(5)}`
    } else if (limitedDigits.length <= 12) {
      return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(2, 5)}.${limitedDigits.slice(5, 8)}/${limitedDigits.slice(8)}`
    } else {
      return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(2, 5)}.${limitedDigits.slice(5, 8)}/${limitedDigits.slice(8, 12)}-${limitedDigits.slice(12)}`
    }
  }

  async function loadFornecedores() {
    try {
      setLoading(true)
      const data = await getAllFornecedores()
      setFornecedores(data)
    } catch (err: any) {
      const generic = "Ocorreu um erro ao carregar fornecedores"
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

  function handleOpenDialog(fornecedor?: Fornecedor) {
    if (fornecedor) {
      setEditingFornecedor(fornecedor)
      setFormData({
        nomefantasia: fornecedor.NomeFantasia,
        razaosocial: fornecedor.RazaoSocial || "",
        cnpj: fornecedor.CNPJ || "",
      })
    } else {
      setEditingFornecedor(null)
      setFormData({
        nomefantasia: "",
        razaosocial: "",
        cnpj: "",
      })
    }
    setIsDialogOpen(true)
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
    setEditingFornecedor(null)
    setFormData({
      nomefantasia: "",
      razaosocial: "",
      cnpj: "",
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.nomefantasia.trim()) {
      toast.error("Nome fantasia é obrigatório")
      return
    }

    try {
      const payload: CreateFornecedorRequest = {
        nomefantasia: formData.nomefantasia.trim(),
        razaosocial: formData.razaosocial.trim() || undefined,
        cnpj: formData.cnpj.trim() || undefined,
      }

      if (editingFornecedor) {
        await updateFornecedor(editingFornecedor.ID, payload)
        toast.success("Fornecedor atualizado com sucesso")
      } else {
        await createFornecedor(payload)
        toast.success("Fornecedor criado com sucesso")
      }

      handleCloseDialog()
      loadFornecedores()
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
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) {
      return
    }

    try {
      await deleteFornecedor(id)
      toast.success("Fornecedor excluído com sucesso")
      loadFornecedores()
    } catch (err: any) {
      const generic = "Ocorreu um erro ao excluir fornecedor"
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

  return (
    <div>
      <NavHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Fornecedores</h1>
            <p className="text-muted-foreground">Gerencie seus fornecedores</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>Novo Fornecedor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingFornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
                </DialogTitle>
                <DialogDescription>
                  {editingFornecedor
                    ? "Atualize as informações do fornecedor"
                    : "Preencha os dados para criar um novo fornecedor"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomefantasia">Nome Fantasia *</Label>
                    <Input
                      id="nomefantasia"
                      value={formData.nomefantasia}
                      onChange={(e) =>
                        setFormData({ ...formData, nomefantasia: e.target.value })
                      }
                      placeholder="Nome fantasia"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razaosocial">Razão Social</Label>
                    <Input
                      id="razaosocial"
                      value={formData.razaosocial}
                      onChange={(e) =>
                        setFormData({ ...formData, razaosocial: e.target.value })
                      }
                      placeholder="Razão social"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => {
                        const formatted = formatCNPJ(e.target.value)
                        setFormData({ ...formData, cnpj: formatted })
                      }}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingFornecedor ? "Atualizar" : "Criar"}
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
        ) : fornecedores.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum fornecedor cadastrado
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome Fantasia</TableHead>
                  <TableHead>Razão Social</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedores.map((fornecedor, index) => (
                  <TableRow key={fornecedor.ID || `fornecedor-${index}`}>
                    <TableCell>{fornecedor.ID}</TableCell>
                    <TableCell className="font-medium">
                      {fornecedor.NomeFantasia}
                    </TableCell>
                    <TableCell>{fornecedor.RazaoSocial || "-"}</TableCell>
                    <TableCell>{fornecedor.CNPJ || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenDialog(fornecedor)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(fornecedor.ID)}
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

