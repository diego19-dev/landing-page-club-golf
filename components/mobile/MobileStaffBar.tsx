'use client'

import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Radio,
  LogOut,
  Sun,
  Moon,
  Clock,
  X
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'

interface MobileStaffBarProps {
  role: 'starter' | 'admin'
}

export function MobileStaffBar({ role }: MobileStaffBarProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [currentTime, setCurrentTime] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
  }

  return (
    <>
      <header className="shrink-0 px-3 pt-[env(safe-area-inset-top,0px)] h-[calc(3.5rem+env(safe-area-inset-top,0px))] flex items-center justify-between border-b dark:border-white/10 border-stone-200/90 dark:bg-[#071b16] bg-[#f8f6f0] z-40 transition-colors duration-200">
        {/* Role badge and title */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs shrink-0 ${
              role === 'starter'
                ? 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white'
                : 'bg-gradient-to-br from-[#d6b875] to-[#8c6d2d] text-[#071b16]'
            }`}
          >
            {role === 'starter' ? <Radio size={16} className="animate-pulse" /> : <ShieldCheck size={18} />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-serif tracking-wider text-xs font-bold dark:text-white text-stone-900 truncate">
                {role === 'starter' ? 'PUESTO STARTER' : 'DIRECCIÓN CLUB'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            </div>
            <span className="text-[9px] dark:text-stone-400 text-stone-500 block truncate leading-none mt-0.5">
              {user?.name || (role === 'starter' ? 'Mateo Valenzuela' : 'Carlos Mendoza')}
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Clock ticker */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg dark:bg-white/5 bg-stone-200/60 font-mono text-[11px] font-bold dark:text-[#efe9d8] text-stone-800">
            <Clock size={11} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            <span>{currentTime || '08:00'}</span>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="p-2 rounded-xl dark:bg-white/5 bg-stone-200/70 dark:text-[#d6b875] text-[#8c6d2d] active:scale-95 transition-transform cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-[11px] font-bold text-rose-700 dark:text-rose-400 active:scale-95 transition-transform cursor-pointer"
          >
            <LogOut size={13} />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Luxury Custom Logout Confirmation Dialog */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl dark:bg-[#0c2820] bg-white border dark:border-[#d6b875]/40 border-stone-300 p-6 shadow-2xl text-center overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top gold accent line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d6b875] to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full dark:bg-white/5 bg-stone-100 dark:text-stone-400 text-stone-500 hover:text-stone-800 dark:hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto mb-3.5 shadow-inner">
              <LogOut size={26} strokeWidth={2.2} />
            </div>

            {/* Eyebrow */}
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8c6d2d] dark:text-[#d6b875] block mb-1">
              Monteverde Golf Club
            </span>

            {/* Title */}
            <h3 className="font-serif text-lg font-bold dark:text-[#efe9d8] text-stone-900 leading-snug">
              ¿Cerrar Sesión Operativa?
            </h3>

            {/* Description */}
            <p className="text-xs dark:text-stone-300 text-stone-600 mt-2 leading-relaxed">
              Saldrás del puesto oficial de{' '}
              <strong className="dark:text-[#d6b875] text-[#8c6d2d]">
                {role === 'starter' ? 'Starter Jefe de Salidas' : 'Dirección & Operaciones'}
              </strong>{' '}
              y regresarás a la vista general pública del club.
            </p>

            {/* Actions */}
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-white/5 bg-stone-100 text-xs font-bold dark:text-stone-300 text-stone-700 cursor-pointer active:scale-95 transition-all hover:bg-stone-200 dark:hover:bg-white/10"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-900/30 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
