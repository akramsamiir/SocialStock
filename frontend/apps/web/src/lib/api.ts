const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5067"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  token?: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json()
      if (typeof data === "string") message = data
      else if (data?.title) message = data.title
      else if (data?.errors) {
        const first = Object.values(data.errors as Record<string, string[]>)[0]
        if (first?.[0]) message = first[0]
      }
    } catch {
      // keep statusText
    }
    throw new ApiError(response.status, message)
  }

  // No body: 204 No Content, or any response without a JSON content-type
  // (e.g. ASP.NET Core's Created() = 201 with empty body, Ok() = 200 with empty body)
  const contentType = response.headers.get("content-type")
  if (!contentType?.includes("application/json")) return undefined as T

  return response.json() as Promise<T>
}
