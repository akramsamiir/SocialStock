import { Link, useNavigate } from "react-router-dom"
import { buttonVariants, Button } from "@workspace/ui/components/button"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  ChartLineData01Icon,
  Briefcase01Icon,
  UserGroup02Icon,
  TrendingUpDownIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Logout02Icon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/hooks/useAuth"

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const { isLoggedIn, userName } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    window.dispatchEvent(new Event("auth-change"))
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-3 items-center px-6">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={TrendingUpDownIcon} size={18} className="text-primary" />
          <span className="text-sm font-semibold tracking-tight">SocialStock</span>
        </div>

        <nav className="hidden items-center justify-center gap-6 md:flex">
          <a href="#features" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
        </nav>

        <div className="flex items-center justify-end gap-2">
          {isLoggedIn ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {userName}
              </span>
              <Link to="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5" })}>
                Dashboard
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
                <HugeiconsIcon icon={Logout02Icon} size={14} />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Log in
              </Link>
              <Link to="/register" className={buttonVariants({ size: "sm" })}>
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { isLoggedIn } = useAuth()

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">

      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        Track stocks. Build wealth.{" "}
        <span className="text-muted-foreground">Share insights.</span>
      </h1>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        SocialStock combines real-time market data with a social layer so you can
        discover ideas, manage your portfolio, and learn from the community —
        all in one place.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isLoggedIn ? (
          <Link to="/dashboard" className={buttonVariants({ size: "lg", className: "gap-1.5" })}>
            Go to dashboard
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
        ) : (
          <>
            <Link to="/register" className={buttonVariants({ size: "lg", className: "gap-1.5" })}>
              Start for free
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>
            <Link to="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Log in
            </Link>
          </>
        )}
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

type Feature = {
  icon: IconSvgElement
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: ChartLineData01Icon,
    title: "Stock Discovery",
    description:
      "Search and track thousands of stocks with up-to-date price data, charts, and key metrics in one clean view.",
  },
  {
    icon: Briefcase01Icon,
    title: "Portfolio Management",
    description:
      "Add and remove positions to build a personalised portfolio. Monitor your holdings and performance at a glance.",
  },
  {
    icon: UserGroup02Icon,
    title: "Social Feed",
    description:
      "Read and write comments on any stock. Follow discussions, share your thesis, and learn from other investors.",
  },
]

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
        <HugeiconsIcon icon={icon} size={20} className="text-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Everything you need to invest smarter
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A focused set of tools designed for individual investors.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

const CTA_ITEMS = [
  "Free to join.",
  "Real-time market data",
  "Community-driven insights",
]

function Cta() {
  const { isLoggedIn } = useAuth()

  return (
    <section className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Ready to take control of your investments?
        </h2>

        <ul className="flex flex-col gap-2">
          {CTA_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="shrink-0 text-foreground" />
              {item}
            </li>
          ))}
        </ul>

        {isLoggedIn ? (
          <Link to="/dashboard" className={buttonVariants({ size: "lg", className: "gap-1.5" })}>
            Go to dashboard
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
        ) : (
          <Link to="/register" className={buttonVariants({ size: "lg", className: "gap-1.5" })}>
            Create your account
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
        )}
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={TrendingUpDownIcon} size={16} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">SocialStock</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SocialStock. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

