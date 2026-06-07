import { apiFetch } from "@/lib/api"

export interface Comment {
  id: number
  title: string
  content: string
  createdOn: string
  stockId: number
  createdByUsername: string
}

export interface CreateCommentRequest {
  title: string
  content: string
}

export function getCommentsByStock(stockId: number, token: string): Promise<Comment[]> {
  return apiFetch<Comment[]>(`/api/comment/stock/${stockId}`, { token })
}

export function createComment(
  stockId: number,
  data: CreateCommentRequest,
  token: string,
): Promise<Comment> {
  return apiFetch<Comment>(`/api/comment/${stockId}`, {
    method: "POST",
    body: data,
    token,
  })
}

export function deleteComment(commentId: number, token: string): Promise<void> {
  return apiFetch<void>(`/api/comment/${commentId}`, { method: "DELETE", token })
}
