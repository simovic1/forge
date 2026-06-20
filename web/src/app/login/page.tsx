'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiError, login, register } from '@/lib/api'
import { useTranslations } from '@/i18n/client'
import LanguageSwitcher from '@/app/components/LanguageSwitcher'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations()

  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (mode === 'login') {
        // The login route handler sets an httpOnly auth cookie on success;
        // the proxy reads it to gate routes. Nothing to persist client-side.
        await login({ email, password })
        router.push('/dashboard')
        router.refresh()
      } else {
        await register({ email, password, name: name || undefined })
        setMode('login')
        setError(t('login.created'))
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (mode === 'login' && (err.status === 401 || err.status === 404)) {
          setError(t('login.errorInvalid'))
        } else {
          setError(err.message)
        }
      } else {
        setError(t('common.errorGeneric'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            FORGE
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {mode === 'login' ? t('login.titleLogin') : t('login.titleRegister')}
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                {t('login.name')}{' '}
                <span className="text-[var(--color-muted)]">
                  {t('login.nameOptional')}
                </span>
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              {t('login.email')}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={mode === 'register' ? 8 : undefined}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)]/5 px-3 py-2 text-sm text-[var(--color-accent)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting
              ? mode === 'login'
                ? t('login.submittingLogin')
                : t('login.submittingRegister')
              : mode === 'login'
                ? t('login.submitLogin')
                : t('login.submitRegister')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          {mode === 'login' ? (
            <>
              {t('login.noAccount')}{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                {t('login.register')}
              </button>
            </>
          ) : (
            <>
              {t('login.haveAccount')}{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                {t('login.submitLogin')}
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  )
}
