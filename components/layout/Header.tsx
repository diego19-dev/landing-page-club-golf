'use client'

import { useState, useRef, useEffect } from 'react'
import { SectionId } from '@/types'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import {
  ShieldCheck,
  Flag,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Lock,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react'

interface HeaderProps {
  activeSection?: SectionId
  setActiveSection: (section: SectionId) => void
  menuOpen?: boolean
  setMenuOpen?: (open: boolean) => void
}

export function Header({ activeSection, setActiveSection }: HeaderProps) {
  const { user, isAuthenticated, isHydrated, openLoginModal, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogoClick = () => {
    if (user?.role === 'starter') {
      setActiveSection('starter')
    } else if (user?.role === 'admin') {
      setActiveSection('admin')
    } else {
      setActiveSection('inicio')
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    setActiveSection('inicio')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <header className="sticky top-0 z-50 border-b dark:border-white/10 border-stone-200/80 dark:bg-[#071b16]/95 bg-[#f8f6f0]/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Brand Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <span className="font-serif text-base sm:text-xl tracking-[.18em] sm:tracking-[.22em] dark:text-[#efe9d8] text-[#122a22] group-hover:text-[#bfa056] dark:group-hover:text-[#d6b875] transition-colors">
            MONTEVERDE
          </span>
          <span className="hidden min-[360px]:inline-block h-3 w-px dark:bg-white/20 bg-stone-300" />
          <span className="hidden min-[360px]:inline-block text-[9px] sm:text-[10px] uppercase tracking-[.22em] sm:tracking-[.25em] dark:text-[#d6b875]/80 text-[#8c6d2d] font-semibold">
            Golf Club
          </span>

          {/* Dedicated role badge in header when logged in */}
          {isHydrated && user?.role === 'starter' && (
            <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider dark:bg-[#10b981]/20 dark:text-[#6ee7b7] dark:border-[#10b981]/40 bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <Flag size={11} />
              <span>Terminal Starter</span>
            </span>
          )}

          {isHydrated && user?.role === 'admin' && (
            <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider dark:bg-[#d6b875]/20 dark:text-[#d6b875] dark:border-[#d6b875]/40 bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
              <ShieldCheck size={11} />
              <span>Suite Admin</span>
            </span>
          )}
        </button>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            className="flex items-center p-1 rounded-full border dark:border-white/15 border-stone-300/80 dark:bg-[#04140f]/90 bg-stone-200/70 hover:border-[#bfa056] dark:hover:border-[#d6b875]/60 transition-all cursor-pointer shadow-sm group"
          >
            {/* Sun indicator */}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-white text-[#8c6d2d] shadow-sm scale-105'
                  : 'text-stone-400 opacity-60 hover:opacity-100'
              }`}
            >
              <Sun size={13} strokeWidth={2.4} />
            </div>

            {/* Moon indicator */}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#0f3328] text-[#d6b875] shadow-sm scale-105'
                  : 'text-stone-400 opacity-60 hover:opacity-100'
              }`}
            >
              <Moon size={13} strokeWidth={2.4} />
            </div>
          </button>

          {/* Auth Controls */}
          {isHydrated && isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full dark:bg-[#04140f]/90 bg-white border dark:border-[#d6b875]/40 border-stone-300 hover:border-[#d6b875] shadow-sm transition-all cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#d6b875] to-[#f5f2e9] text-[#071b16] flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                  {user.role === 'admin' ? 'A' : user.role === 'starter' ? 'S' : 'J'}
                </div>
                <span className="text-xs font-semibold dark:text-[#efe9d8] text-[#122a22] max-w-[90px] sm:max-w-[130px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    user.role === 'admin'
                      ? 'dark:bg-[#d6b875]/20 dark:text-[#d6b875] dark:border-[#d6b875]/30 bg-amber-100 text-amber-800 border border-amber-300'
                      : user.role === 'starter'
                      ? 'dark:bg-[#10b981]/20 dark:text-[#6ee7b7] dark:border-[#10b981]/30 bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'dark:bg-white/10 dark:text-stone-300 bg-stone-100 text-stone-700'
                  }`}
                >
                  {user.role}
                </span>
                <ChevronDown size={13} className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-white transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl dark:bg-[#071b16] bg-white border dark:border-[#d6b875]/30 border-stone-200 p-2 shadow-2xl dark:shadow-black/80 shadow-stone-400/20 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3 border-b dark:border-white/10 border-stone-100 mb-2">
                    <div className="font-semibold text-xs dark:text-[#efe9d8] text-[#122a22]">{user.name}</div>
                    <div className="text-[10px] dark:text-stone-400 text-stone-500 truncate">{user.email}</div>
                    <div className="mt-1.5 inline-block text-[10px] font-semibold dark:text-[#d6b875] text-[#8c6d2d] dark:bg-[#d6b875]/10 bg-amber-50 px-2 py-0.5 rounded-md border dark:border-transparent border-amber-200">
                      {user.title}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openLoginModal()}
              className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] hover:from-[#dfc68b] hover:via-[#f0dda9] hover:to-[#cca960] text-[#071b16] font-bold text-xs tracking-wide shadow-lg shadow-[#d6b875]/25 hover:shadow-[#d6b875]/40 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] border border-[#fff2cb]/70 group"
            >
              <div className="w-4 h-4 rounded-full bg-[#071b16]/15 flex items-center justify-center">
                <Lock size={11} strokeWidth={2.6} className="text-[#071b16] group-hover:rotate-[-10deg] transition-transform duration-200" />
              </div>
              <span className="font-semibold">Acceso Club</span>
              <span className="text-[10px] font-bold text-[#071b16]/70 group-hover:translate-x-0.5 transition-transform duration-200">
                →
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

