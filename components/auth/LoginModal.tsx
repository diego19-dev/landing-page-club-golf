'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/types'
import { X, ShieldCheck, Flag, User, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

interface LoginModalProps {
  onLoginSuccess?: (role: UserRole) => void
}

export function LoginModal({ onLoginSuccess }: LoginModalProps = {}) {
  const { isLoginModalOpen, closeLoginModal, login, loginAsDemo, selectedModalRole } = useAuth()
  const [activeRole, setActiveRole] = useState<UserRole>(selectedModalRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setActiveRole(selectedModalRole)
    if (selectedModalRole === 'admin') {
      setEmail('admin@monteverde.golf')
      setPassword('admin123')
    } else if (selectedModalRole === 'starter') {
      setEmail('starter@monteverde.golf')
      setPassword('starter123')
    } else {
      setEmail('socio@monteverde.golf')
      setPassword('socio123')
    }
    setErrorMessage('')
  }, [selectedModalRole, isLoginModalOpen])

  if (!isLoginModalOpen) return null

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role)
    setErrorMessage('')
    if (role === 'admin') {
      setEmail('admin@monteverde.golf')
      setPassword('admin123')
    } else if (role === 'starter') {
      setEmail('starter@monteverde.golf')
      setPassword('starter123')
    } else {
      setEmail('socio@monteverde.golf')
      setPassword('socio123')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    if (!email) {
      setErrorMessage('Por favor ingresa un correo electrónico')
      setIsLoading(false)
      return
    }

    try {
      const res = await login(email, password, activeRole)
      if (res.success) {
        onLoginSuccess?.(activeRole)
      }
    } catch {
      setErrorMessage('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = () => {
    loginAsDemo(activeRole)
    onLoginSuccess?.(activeRole)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLoginModal()
      }}
    >
      <div className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl border border-[#d6b875]/30 bg-[#071b16] p-5 sm:p-6 shadow-2xl shadow-black/90 overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Subtle ambient glow */}
        <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#d6b875]/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#167052]/20 blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={closeLoginModal}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Minimalist Brand Header */}
        <div className="text-center mb-4 pt-1">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-b from-[#d6b875]/25 to-[#0c2820] border border-[#d6b875]/40 mb-2 text-[#d6b875] shadow-inner">
            {activeRole === 'starter' ? (
              <Flag size={16} className="text-[#6ee7b7]" />
            ) : activeRole === 'admin' ? (
              <ShieldCheck size={16} className="text-[#d6b875]" />
            ) : (
              <User size={16} className="text-[#d6b875]" />
            )}
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold tracking-[0.16em] text-[#efe9d8]">
            MONTEVERDE
          </h2>
          <p className="text-[11px] text-[#aab8af]">
            Acceso a Terminal del Club
          </p>
        </div>

        {/* Compact Segmented Role Selector */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#04100d] border border-white/10">
            <button
              type="button"
              onClick={() => handleRoleSelect('starter')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeRole === 'starter'
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-[#071b16] font-bold shadow-md shadow-[#10b981]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <Flag size={12} className={activeRole === 'starter' ? 'text-[#071b16]' : 'text-[#6ee7b7]'} />
              <span>Starter</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeRole === 'admin'
                  ? 'bg-gradient-to-r from-[#d6b875] to-[#c2a159] text-[#071b16] font-bold shadow-md shadow-[#d6b875]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <ShieldCheck size={12} className={activeRole === 'admin' ? 'text-[#071b16]' : 'text-[#d6b875]'} />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('socio')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeRole === 'socio'
                  ? 'bg-stone-700 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <User size={12} className={activeRole === 'socio' ? 'text-white' : 'text-stone-400'} />
              <span>Socio</span>
            </button>
          </div>
        </div>

        {/* Minimalist Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMessage && (
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1 font-semibold">
              Usuario / Correo
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@monteverde.golf"
                required
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#04100d] border border-white/10 text-xs sm:text-sm text-[#efe9d8] placeholder-stone-600 focus:outline-none focus:border-[#d6b875] focus:ring-1 focus:ring-[#d6b875]/40 transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1 font-semibold">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-8 pr-9 py-2 rounded-xl bg-[#04100d] border border-white/10 text-xs sm:text-sm text-[#efe9d8] placeholder-stone-600 focus:outline-none focus:border-[#d6b875] focus:ring-1 focus:ring-[#d6b875]/40 transition-all shadow-inner font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1 cursor-pointer transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] hover:from-[#dfc68b] hover:via-[#f0dda9] hover:to-[#cca960] text-[#071b16] font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#d6b875]/20 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 border border-[#fff2cb]/60"
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-[#071b16] border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>
                    Ingresar como {activeRole === 'admin' ? 'Administrador' : activeRole === 'starter' ? 'Starter' : 'Socio'}
                  </span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </>
              )}
            </button>

            {/* 1-Click Fast Fill & Entry Helper */}
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-1.5 text-center text-[11px] text-stone-400 hover:text-[#d6b875] transition-colors cursor-pointer flex items-center justify-center gap-1.5 group"
            >
              <Sparkles size={11} className="text-[#d6b875] group-hover:rotate-12 transition-transform" />
              <span>Acceso directo demo con 1 clic</span>
            </button>
          </div>
        </form>

        <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center text-[10px] text-stone-500">
          <span>Monteverde Golf Suite</span>
          <span className="text-[#d6b875]/70">v2.4 Pro</span>
        </div>
      </div>
    </div>
  )
}
