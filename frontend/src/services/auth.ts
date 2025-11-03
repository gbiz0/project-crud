import { httpJson } from "@/services/http"

export interface RegisterRequest {
  login: string
  senha: string
}

export interface LoginRequest {
  login: string
  senha: string
}

export interface LoginResponse {
  token: string
}

export interface ErrrorLoginResponse {
  message: string
}

export interface RegisterResponse {
  // Ajuste conforme a API real; temporariamente tipagem frouxa
  [key: string]: unknown
}

export async function register(data: RegisterRequest) {
  return httpJson<RegisterResponse, RegisterRequest>({
    method: "POST",
    path: "auth/register",
    body: data,
  })
}

export async function login(data: LoginRequest) {
  return httpJson<LoginResponse, LoginRequest>({
    method: "POST",
    path: "auth/login",
    body: data,
  })
}

export async function saveToken(token : string) {
  localStorage.setItem("token", token)
  localStorage.setItem("expiresAt", new Date(Date.now() + 1000 * 60 * 60).toISOString())
}

export async function isTokenExpired() {
  const expiresAt = localStorage.getItem("expiresAt")

  if (!expiresAt) return true

  const expiresAtMs = Date.parse(expiresAt)
  if (Number.isNaN(expiresAtMs)) return true

  return Date.now() >= expiresAtMs
}


export function isAuthenticated() {
  const token = localStorage.getItem("token")
  if (!token) return false

  const expiresAt = localStorage.getItem("expiresAt")
  if (!expiresAt) return false

  const expiresAtMs = Date.parse(expiresAt)
  if (Number.isNaN(expiresAtMs)) return false

  return Date.now() < expiresAtMs
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("expiresAt")
}

