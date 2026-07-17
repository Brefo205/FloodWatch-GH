'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Droplets, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              FloodWatch <span className="text-teal">GH</span>
            </span>
          </Link>

          <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setMode('login')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('register')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Register
            </button>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Sign in to submit and track flood reports.'
              : 'Join FloodWatch GH to report floods in your community.'}
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {mode === 'register' && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" placeholder="Ama Boateng" className="pl-9" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                  className="pl-9"
                />
              </div>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href="/report">
                {mode === 'login' ? 'Sign in' : 'Create account'}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already registered? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-primary hover:underline"
            >
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-[#0b1220] lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal/20" />
        <div className="relative flex h-full flex-col justify-center px-12 text-white">
          <ShieldCheck className="size-10 text-teal" />
          <h2 className="mt-6 max-w-md text-balance text-3xl font-bold leading-tight">
            Every report helps protect a community.
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-slate-300">
            FloodWatch GH connects residents, local assemblies and NADMO
            officers on one live map — so floods get spotted, predicted and
            responded to faster.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-200">
            <li className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-teal" /> Report from your
              phone in under a minute
            </li>
            <li className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-teal" /> Instant severity
              prediction for every report
            </li>
            <li className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-teal" /> Trusted by
              disaster response officers
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
