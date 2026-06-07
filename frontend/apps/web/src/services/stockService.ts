import { apiFetch } from "@/lib/api"

export interface Stock {
  id: number
  symbol: string
  companyName: string
  purchase: number
  lastDiv: number
  industry: string
  marketCap: number
}

export interface StockQuery {
  search?: string
  symbol?: string
  companyName?: string
  sortBy?: string
  isDescending?: boolean
  pageNumber?: number
  pageSize?: number
}

function buildQuery(params: StockQuery): string {
  const qs = new URLSearchParams()
  if (params.search) qs.set("search", params.search)
  if (params.symbol) qs.set("symbol", params.symbol)
  if (params.companyName) qs.set("companyName", params.companyName)
  if (params.sortBy) qs.set("sortBy", params.sortBy)
  if (params.isDescending) qs.set("isDescending", "true")
  if (params.pageNumber) qs.set("pageNumber", String(params.pageNumber))
  if (params.pageSize) qs.set("pageSize", String(params.pageSize))
  const str = qs.toString()
  return str ? `?${str}` : ""
}

export async function searchStocks(query: StockQuery, token: string): Promise<Stock[]> {
  return apiFetch<Stock[]>(`/api/stock${buildQuery(query)}`, { token })
}
