import { useCallback, useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Delete02Icon,
  Loading03Icon,
  SentIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import {
  getCommentsByStock,
  createComment,
  deleteComment,
  type Comment,
} from "@/services/commentService"
import { ApiError } from "@/lib/api"

interface CommentPanelProps {
  stockId: number
  stockName: string
  token: string
  currentUsername: string | null
  onClose: () => void
}

export function CommentPanel({
  stockId,
  stockName,
  token,
  currentUsername,
  onClose,
}: CommentPanelProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCommentsByStock(stockId, token)
      setComments(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load comments.")
    } finally {
      setLoading(false)
    }
  }, [stockId, token])

  useEffect(() => { load() }, [load])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  function validate(): boolean {
    let ok = true
    if (title.trim().length < 5) {
      setTitleError("Title must be at least 5 characters.")
      ok = false
    } else setTitleError(null)
    if (content.trim().length < 5) {
      setContentError("Content must be at least 5 characters.")
      ok = false
    } else setContentError(null)
    return ok
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setError(null)
    try {
      const created = await createComment(stockId, { title: title.trim(), content: content.trim() }, token)
      setComments((prev) => [created, ...prev])
      setTitle("")
      setContent("")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to post comment.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(commentId: number) {
    setDeletingId(commentId)
    try {
      await deleteComment(commentId, token)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete comment.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label={`Comments for ${stockName}`}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-background shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{stockName}</p>
            <p className="text-xs text-muted-foreground">Community comments</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close panel">
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </Button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center gap-2 py-8 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
              Loading comments…
            </div>
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground">{c.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        @{c.createdByUsername} · {new Date(c.createdOn).toLocaleDateString()}
                      </p>
                    </div>
                    {c.createdByUsername === currentUsername && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={deletingId === c.id}
                        onClick={() => handleDelete(c.id)}
                        aria-label="Delete comment"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        {deletingId === c.id
                          ? <HugeiconsIcon icon={Loading03Icon} size={12} className="animate-spin" />
                          : <HugeiconsIcon icon={Delete02Icon} size={12} />
                        }
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-foreground">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </p>
          )}
        </div>

        {/* Post form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-border px-5 py-4"
        >
          <p className="mb-3 text-xs font-medium text-foreground">Post a comment</p>
          <div className="flex flex-col gap-3">
            <Field>
              <FieldLabel className="text-xs">Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bullish on Q3 earnings"
                disabled={submitting}
              />
              {titleError && <FieldError>{titleError}</FieldError>}
            </Field>

            <Field>
              <FieldLabel className="text-xs">Content</FieldLabel>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts…"
                disabled={submitting}
              />
              {contentError && <FieldError>{contentError}</FieldError>}
            </Field>

            <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
              {submitting
                ? <HugeiconsIcon icon={Loading03Icon} size={12} className="animate-spin" />
                : <HugeiconsIcon icon={SentIcon} size={12} />
              }
              Post
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
