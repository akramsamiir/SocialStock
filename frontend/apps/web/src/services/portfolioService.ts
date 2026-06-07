import { apiFetch } from "@/lib/api"
import type { Stock } from "@/services/stockService"

export async function getPortfolio(token: string): Promise<Stock[]> {
  return apiFetch<Stock[]>("/api/portfolio", { token })
}

export async function addToPortfolio(symbol: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/portfolio?symbol=${encodeURIComponent(symbol)}`, {
    method: "POST",
    token,
  })
}

export async function removeFromPortfolio(symbol: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/portfolio?symbol=${encodeURIComponent(symbol)}`, {
    method: "DELETE",
    token,
  })
}
