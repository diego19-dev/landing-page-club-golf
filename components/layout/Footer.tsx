'use client'

import { MapPin, ShieldCheck, Flag, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function Footer() {
  const { user, isHydrated, openLoginModal, logout } = useAuth()

  // Dedicated footer when logged in as staff (Starter or Admin)
  if (isHydrated && (user?.role === 'starter' || user?.role === 'admin')) {
    return (
      <footer className="border-t dark:border-white/10 border-stone-200 px-4 sm:px-6 py-4 lg:px-10 dark:bg-[#051410] bg-[#eae5d8] text-xs transition-colors duration-200">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 dark:text-stone-400 text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-serif tracking-[.14em] dark:text-[#efe9d8] text-[#122a22] font-bold">
              MONTEVERDE
            </span>
            <span className="dark:text-white/20 text-stone-300">|</span>
            <span className="flex items-center gap-1.5 text-[11px] dark:text-[#d6b875] text-[#8c6d2d] font-semibold">
              {user.role === 'admin' ? (
                <>
                  <ShieldCheck size={12} /> Portal Administrativo
                </>
              ) : (
                <>
                  <Flag size={12} /> Terminal Starter Tee 1/10
                </>
              )}
            </span>
            <span className="dark:text-white/20 text-stone-300 hidden sm:inline">|</span>
            <span className="text-[11px] hidden sm:inline dark:text-stone-500 text-stone-600 font-medium">
              Operador: {user.name} ({user.title})
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => logout()}
              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              <span>Cerrar Sesión</span>
            </button>
            <span className="dark:text-white/20 text-stone-300">|</span>
            <span className="dark:text-stone-500 text-stone-600">v2.4 Operations</span>
          </div>
        </div>
      </footer>
    )
  }

  // Public visitor / member footer
  return (
    <footer className="border-t dark:border-white/10 border-stone-200 px-4 sm:px-6 transition-colors duration-200 py-6 lg:px-10 dark:bg-[#071b16] bg-[#eae5d8]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-serif text-lg tracking-[.16em] dark:text-[#efe9d8] text-[#122a22] font-semibold">MONTEVERDE</p>
            <span className="dark:text-white/20 text-stone-300">|</span>
            <p className="flex items-center gap-1.5 text-xs dark:text-[#aab8af] text-stone-600 font-medium">
              <MapPin size={12} className="text-[#8c6d2d] dark:text-[#d6b875]" /> Camino del Roble 18 · Madrid
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest dark:text-[#aab8af] text-stone-600 font-medium">
            <a href="#inicio" aria-label="Instagram" className="hover:text-[#8c6d2d] dark:hover:text-[#d6b875] transition-colors">
              Instagram
            </a>
            <a href="#inicio" aria-label="X" className="hover:text-[#8c6d2d] dark:hover:text-[#d6b875] transition-colors">
              X
            </a>
            <span className="dark:text-white/20 text-stone-300">|</span>
            <button
              onClick={() => openLoginModal()}
              className="hover:text-[#8c6d2d] dark:hover:text-[#d6b875] transition-colors cursor-pointer text-[#8c6d2d] dark:text-[#d6b875] font-semibold"
            >
              Acceso Staff
            </button>
            <span className="dark:text-white/20 text-stone-300">|</span>
            <span className="text-[11px] dark:text-[#64746a] text-stone-500">© 2026 Monteverde</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
