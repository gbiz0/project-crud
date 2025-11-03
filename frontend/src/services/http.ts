import { API_BASE_URL } from "@/config/api"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface RequestOptions<TBody> {
  method?: HttpMethod
  path: string
  body?: TBody
  headers?: Record<string, string>
}

export async function httpJson<TResponse, TBody = unknown>({ method = "GET", path, body, headers = {} }: RequestOptions<TBody>): Promise<TResponse> {
  const url = API_BASE_URL ? new URL(path, API_BASE_URL).toString() : path

  const token = localStorage.getItem("token")
  const authHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers: authHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  // Tenta parsear JSON; se vazio, retorna undefined
  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await response.json()) as TResponse
  }
  return undefined as unknown as TResponse
}


