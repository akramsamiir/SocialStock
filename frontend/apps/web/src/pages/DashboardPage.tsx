import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TrendingUpDownIcon,
  Search01Icon,
  PlusSignIcon,
  Delete02Icon,
  Loading03Icon,
  Logout02Icon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { searchStocks, type Stock } from "@/services/stockService"
import { getPortfolio, addToPortfolio, removeFromPortfolio } from "@/services/portfolioService"
import { ApiError } from "@/lib/api"
import { CommentPanel } from "@/components/CommentPanel"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem("token")
}

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(1)}T`
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  return `$${value.toLocaleString()}`
}

// ─── Stock Row ────────────────────────────────────────────────────────────────

interface StockRowProps {
  stock: Stock
  inPortfolio: boolean
  onAdd: (symbol: string) => void
  onRemove: (symbol: string) => void
  actionLoading: boolean
  onCommentClick: (stock: Stock) => void
}

function StockRow({ stock, inPortfolio, onAdd, onRemove, actionLoading, onCommentClick }: StockRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-foreground">
          {stock.symbol.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-foreground">{stock.companyName}</p>
          <p className="text-xs text-muted-foreground">{stock.symbol} · {stock.industry}</p>
        </div>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-xs font-medium text-foreground">{formatMarketCap(stock.marketCap)}</p>
        <p className="text-xs text-muted-foreground">Market cap</p>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onCommentClick(stock)}
        aria-label={`Comments for ${stock.symbol}`}
        className="text-muted-foreground"
      >
        <HugeiconsIcon icon={MessageMultiple01Icon} size={14} />
      </Button>

      <Button
        variant={inPortfolio ? "destructive" : "outline"}
        size="icon-sm"
        disabled={actionLoading}
        onClick={() => inPortfolio ? onRemove(stock.symbol) : onAdd(stock.symbol)}
        aria-label={inPortfolio ? `Remove ${stock.symbol}` : `Add ${stock.symbol}`}
      >
        {actionLoading
          ? <HugeiconsIcon icon={Loading03Icon} size={12} className="animate-spin" />
          : inPortfolio
            ? <HugeiconsIcon icon={Delete02Icon} size={12} />
            : <HugeiconsIcon icon={PlusSignIcon} size={12} />
        }
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate()
  const token = getToken()

  // ── Portfolio state ───────────────────────────────────────────────────────
  const [portfolio, setPortfolio] = useState<Stock[]>([])
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)

  // ── Local search state (not shared, so stays local) ──────────────────────
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!token) navigate("/login")
  }, [token, navigate])

  // Load portfolio on mount
  useEffect(() => {
    if (!token) return
    setPortfolioLoading(true)
    setPortfolioError(null)
    getPortfolio(token)
      .then(setPortfolio)
      .catch((err) => setPortfolioError(err instanceof ApiError ? err.message : "Failed to load portfolio."))
      .finally(() => setPortfolioLoading(false))
  }, [token])

  // Fetch top-5 popular stocks (no query — backend sorts by MarketCap desc)
  const loadPopular = useCallback(async () => {
    if (!token) return
    setSearchLoading(true)
    setSearchError(null)
    try {
      const results = await searchStocks({ pageSize: 5 }, token)
      setSearchResults(results)
    } catch (err) {
      if (err instanceof ApiError) setSearchError(err.message)
    } finally {
      setSearchLoading(false)
    }
  }, [token])

  // Debounced search
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      // Show popular stocks again when input is cleared
      loadPopular()
      return
    }
    debounceRef.current = setTimeout(async () => {
      if (!token) return
      setSearchLoading(true)
      setSearchError(null)
      try {
        const results = await searchStocks(
          { search: value.trim(), pageSize: 10 },
          token,
        )
        setSearchResults(results)
      } catch (err) {
        if (err instanceof ApiError) setSearchError(err.message)
      } finally {
        setSearchLoading(false)
      }
    }, 400)
  }, [token, loadPopular])

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true)
    if (!query.trim()) loadPopular()
  }, [query, loadPopular])

  const handleSearchBlur = useCallback(() => {
    // Small delay so clicks on results register before hiding
    setTimeout(() => setSearchFocused(false), 150)
  }, [])

  const handleAdd = useCallback(async (symbol: string) => {
    if (!token) return
    setActionLoading(symbol)
    setPortfolioError(null)
    try {
      await addToPortfolio(symbol, token)
      const updated = await getPortfolio(token)
      setPortfolio(updated)
    } catch (err) {
      setPortfolioError(err instanceof ApiError ? err.message : "Failed to add stock.")
    } finally {
      setActionLoading(null)
    }
  }, [token])

  const handleRemove = useCallback(async (symbol: string) => {
    if (!token) return
    setActionLoading(symbol)
    setPortfolioError(null)
    try {
      await removeFromPortfolio(symbol, token)
      const updated = await getPortfolio(token)
      setPortfolio(updated)
    } catch (err) {
      setPortfolioError(err instanceof ApiError ? err.message : "Failed to remove stock.")
    } finally {
      setActionLoading(null)
    }
  }, [token])

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    window.dispatchEvent(new Event("auth-change"))
    navigate("/")
  }

  const portfolioSymbols = new Set(portfolio.map((s) => s.symbol))
  const error = portfolioError ?? searchError

  // ── Comment panel ──────────────────────────────────────────────────────
  const [activeCommentStock, setActiveCommentStock] = useState<Stock | null>(null)
  const currentUsername = localStorage.getItem("userName")

  const handleCommentClick = useCallback((stock: Stock) => {
    setActiveCommentStock(stock)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <HugeiconsIcon icon={TrendingUpDownIcon} size={18} className="text-primary" />
            <span className="text-sm font-semibold tracking-tight">SocialStock</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
            <HugeiconsIcon icon={Logout02Icon} size={14} />
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
          My Portfolio
        </h1>

        {/* Search */}
        <section className="mb-10">
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Search stocks
          </p>
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search by company name or ticker…"
              className="pl-8"
            />
          </div>

          {/* Search results */}
          {searchFocused && (searchLoading || searchResults.length > 0) && (
            <div className="mt-3 flex flex-col gap-2">
              {searchLoading
                ? <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
                    <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
                    Searching…
                  </div>
                : searchResults.map((stock) => (
                    <StockRow
                      key={stock.id}
                      stock={stock}
                      inPortfolio={portfolioSymbols.has(stock.symbol)}
                      onAdd={handleAdd}
                      onRemove={handleRemove}
                      actionLoading={actionLoading === stock.symbol}
                      onCommentClick={handleCommentClick}
                    />
                  ))
              }
            </div>
          )}
        </section>

        {/* Error banner */}
        {error && (
          <p
            role="alert"
            className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            {error}
          </p>
        )}

        {/* Portfolio list */}
        <section>
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Portfolio · {portfolio.length} {portfolio.length === 1 ? "stock" : "stocks"}
          </p>

          {portfolioLoading
            ? <div className="flex items-center gap-2 py-8 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
                Loading portfolio…
              </div>
            : portfolio.length === 0
              ? <div className="rounded-lg border border-dashed border-border py-12 text-center">
                  <p className="text-xs text-muted-foreground">
                    No stocks in your portfolio yet. Search above to add some.
                  </p>
                </div>
              : <div className="flex flex-col gap-2">
                  {portfolio.map((stock) => (
                    <StockRow
                      key={stock.id}
                      stock={stock}
                      inPortfolio
                      onAdd={handleAdd}
                      onRemove={handleRemove}
                      actionLoading={actionLoading === stock.symbol}
                      onCommentClick={handleCommentClick}
                    />
                  ))}
                </div>
          }
        </section>
      </main>

      {/* Comment side panel */}
      {activeCommentStock && token && (
        <CommentPanel
          stockId={activeCommentStock.id}
          stockName={activeCommentStock.companyName}
          token={token}
          currentUsername={currentUsername}
          onClose={() => setActiveCommentStock(null)}
        />
      )}
    </div>
  )
}
