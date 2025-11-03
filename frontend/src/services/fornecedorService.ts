import { httpJson } from "@/services/http"

export interface Fornecedor {
  ID: number
  Removido: boolean
  NomeFantasia: string
  RazaoSocial: string | null
  CNPJ: string | null
}

// Interface para dados brutos do backend (pode vir em diferentes formatos)
interface RawFornecedor {
  ID?: number
  id?: number
  Removido?: boolean
  removido?: boolean
  NomeFantasia?: string
  nomefantasia?: string
  RazaoSocial?: string | null
  razaosocial?: string | null
  CNPJ?: string | null
  cnpj?: string | null
}

// Função para normalizar os dados do backend para o formato esperado
export function normalizeFornecedor(raw: RawFornecedor): Fornecedor {
  return {
    ID: raw.ID ?? raw.id ?? 0,
    Removido: raw.Removido ?? raw.removido ?? false,
    NomeFantasia: raw.NomeFantasia ?? raw.nomefantasia ?? "",
    RazaoSocial: raw.RazaoSocial ?? raw.razaosocial ?? null,
    CNPJ: raw.CNPJ ?? raw.cnpj ?? null,
  }
}

export interface CreateFornecedorRequest {
  nomefantasia: string
  razaosocial?: string
  cnpj?: string
}

export interface UpdateFornecedorRequest {
  nomefantasia: string
  razaosocial?: string
  cnpj?: string
}

export async function getAllFornecedores() {
  const data = await httpJson<RawFornecedor[]>({
    method: "GET",
    path: "fornecedores",
  })
  return data.map(normalizeFornecedor)
}

export async function getFornecedorById(id: number) {
  const data = await httpJson<RawFornecedor>({
    method: "GET",
    path: `fornecedores/${id}`,
  })
  return normalizeFornecedor(data)
}

export async function createFornecedor(data: CreateFornecedorRequest) {
  const result = await httpJson<RawFornecedor>({
    method: "POST",
    path: "fornecedores",
    body: data,
  })
  return normalizeFornecedor(result)
}

export async function updateFornecedor(id: number, data: UpdateFornecedorRequest) {
  const result = await httpJson<RawFornecedor>({
    method: "PUT",
    path: `fornecedores/${id}`,
    body: data,
  })
  return normalizeFornecedor(result)
}

export async function deleteFornecedor(id: number) {
  return httpJson<{ message: string }>({
    method: "DELETE",
    path: `fornecedores/${id}`,
  })
}

