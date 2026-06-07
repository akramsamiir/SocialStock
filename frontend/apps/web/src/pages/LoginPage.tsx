import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { TrendingUpDownIcon, Loading03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { login } from "@/services/authService"
import { ApiError } from "@/lib/api"
import { loginSchema, type LoginFormValues } from "@/schemas/loginSchema"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  async function onSubmit(values: LoginFormValues) {
    setServerError(null)
    try {
      const { token, userName } = await login(values.username, values.password)
      localStorage.setItem("token", token)
      localStorage.setItem("userName", userName)
      window.dispatchEvent(new Event("auth-change"))
      navigate("/dashboard")
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message)
      } else {
        setServerError("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal header */}
      <header className="flex h-14 items-center border-b border-border/60 px-6">
        <Link to="/" className="flex items-center gap-2">
          <HugeiconsIcon icon={TrendingUpDownIcon} size={18} className="text-primary" />
          <span className="text-sm font-semibold tracking-tight">SocialStock</span>
        </Link>
      </header>

      {/* Form card */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-foreground underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="username"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {serverError && (
              <p
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                {serverError}
              </p>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full gap-1.5">
              {isSubmitting && (
                <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
              )}
              {isSubmitting ? "Logging in…" : "Log in"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
