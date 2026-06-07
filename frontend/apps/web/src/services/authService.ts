import { apiFetch } from "@/lib/api"

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  userName: string
  email: string
  token: string
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/account/register", {
    method: "POST",
    body: data,
  })
}

export async function login(
  username: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/account/login", {
    method: "POST",
    body: { username, password },
  })
}
