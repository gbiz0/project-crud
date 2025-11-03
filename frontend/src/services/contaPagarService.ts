import { httpJson } from "@/services/http"
import { getAllFornecedores, type Fornecedor } from "./fornecedorService"

export interface ContaPagar {
  ID: number
  Removido: boolean
  Descricao: string
  DataVencimento: string
  Valor: number
  DataPagamento: string | null
  ValorPago: number | null
  FornecedorID: number
}

interface RawContaPagar {
  ID?: number
  id?: number
  Removido?: boolean
  removido?: boolean
  Descricao?: string
  descricao?: string
  DataVencimento?: string
  datavencimento?: string
  Valor?: number | string
  valor?: number | string
  DataPagamento?: string | null
  datapagamento?: string | null
  ValorPago?: number | string | null
  valorpago?: number | string | null
  FornecedorID?: number
  fornecedorid?: number
}

export function normalizeContaPagar(raw: RawContaPagar): ContaPagar {
  return {
    ID: raw.ID ?? raw.id ?? 0,
    Removido: raw.Removido ?? raw.removido ?? false,
    Descricao: raw.Descricao ?? raw.descricao ?? "",
    DataVencimento: raw.DataVencimento ?? raw.datavencimento ?? "",
    Valor: typeof raw.Valor === "string" ? parseFloat(raw.Valor) : (raw.Valor ?? raw.valor ?? 0),
    DataPagamento: raw.DataPagamento ?? raw.datapagamento ?? null,
    ValorPago: raw.ValorPago !== undefined && raw.ValorPago !== null
      ? (typeof raw.ValorPago === "string" ? parseFloat(raw.ValorPago) : raw.ValorPago)
      : (raw.valorpago !== undefined && raw.valorpago !== null
          ? (typeof raw.valorpago === "string" ? parseFloat(raw.valorpago) : raw.valorpago)
          : null),
    FornecedorID: raw.FornecedorID ?? raw.fornecedorid ?? 0,
  }
}

export interface CreateContaPagarRequest {
  descricao: string
  datavencimento: string
  valor: number
  datapagamento?: string
  valorpago?: number
  fornecedorid: number
}

export interface UpdateContaPagarRequest {
  descricao: string
  datavencimento: string
  valor: number
  datapagamento?: string
  valorpago?: number
  fornecedorid: number
}

export async function getAllContasPagar() {
  const data = await httpJson<RawContaPagar[]>({
    method: "GET",
    path: "contas",
  })
  return data.map(normalizeContaPagar)
}

export async function getContaPagarById(id: number) {
  const data = await httpJson<RawContaPagar>({
    method: "GET",
    path: `contas/${id}`,
  })
  return normalizeContaPagar(data)
}

export async function createContaPagar(data: CreateContaPagarRequest) {
  const result = await httpJson<RawContaPagar>({
    method: "POST",
    path: "contas",
    body: data,
  })
  return normalizeContaPagar(result)
}

export async function updateContaPagar(id: number, data: UpdateContaPagarRequest) {
  const result = await httpJson<RawContaPagar>({
    method: "PUT",
    path: `contas/${id}`,
    body: data,
  })
  return normalizeContaPagar(result)
}

export async function deleteContaPagar(id: number) {
  return httpJson<{ message: string }>({
    method: "DELETE",
    path: `contas/${id}`,
  })
}

// Função auxiliar para buscar fornecedores (para o select)
export async function getFornecedoresForSelect(): Promise<Fornecedor[]> {
  return getAllFornecedores()
}
