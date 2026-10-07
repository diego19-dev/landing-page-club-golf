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
  Moon,
  Menu,
  X,
  CalendarDays,
  ShoppingBag,
  BookOpen,
  Compass,
  Crown
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface HeaderProps {
  activeSection?: SectionId
  setActiveSection: (section: SectionId) => void
  menuOpen?: boolean
  setMenuOpen?: (open: boolean) => void
}

export function Header({
  activeSection = 'inicio',
  setActiveSection,
  menuOpen: controlledMenuOpen,
  setMenuOpen: controlledSetMenuOpen
}: HeaderProps) {
  const { user, isAuthenticated, isHydrated, openLoginModal, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [internalMenuOpen, setInternalMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const menuOpen = controlledMenuOpen !== undefined ? controlledMenuOpen : internalMenuOpen
  const setMenuOpen = controlledSetMenuOpen !== undefined ? controlledSetMenuOpen : setInternalMenuOpen

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

  const navigateTo = (section: SectionId, anchorId?: string) => {
    setMenuOpen(false)
    if (user?.role === 'starter') {
      setActiveSection('starter')
      return
    }
    if (user?.role === 'admin') {
      setActiveSection('admin')
      return
    }

    if (section === 'inicio') {
      setActiveSection('inicio')
      if (anchorId) {
        setTimeout(() => {
          const el = document.getElementById(anchorId)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    } else {
      setActiveSection(section)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b dark:border-white/10 border-stone-200/80 dark:bg-[#071b16]/95 bg-[#f8f6f0]/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Brand Logo with Monogram */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full border dark:border-[#d6b875]/40 border-[#8c6d2d]/30 dark:bg-[#0c2820] bg-white flex items-center justify-center shadow-xs group-hover:border-[#d6b875] transition-colors">
            <span className="font-serif text-xs font-bold text-[#8c6d2d] dark:text-[#d6b875]">M</span>
          </div>
          <div>
            <span className="font-serif text-base sm:text-xl tracking-[.18em] sm:tracking-[.22em] dark:text-[#efe9d8] text-[#122a22] group-hover:text-[#bfa056] dark:group-hover:text-[#d6b875] transition-colors block leading-none">
              MONTEVERDE
            </span>
            <span className="text-[9px] uppercase tracking-[.25em] dark:text-[#d6b875]/80 text-[#8c6d2d] font-semibold block mt-0.5">
              Golf Club · 1987
            </span>
          </div>

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

        {(!isHydrated || !user || user.role === 'socio') && (
          <Separator orientation="vertical" className="h-5 bg-stone-300/80 dark:bg-white/15 hidden xl:block" />
        )}

        {/* Public Desktop Navigation Links */}
        {(!isHydrated || !user || user.role === 'socio') && (
          <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium">
            <button
              onClick={() => navigateTo('reservas')}
              className={`transition-colors cursor-pointer hover:text-[#8c6d2d] dark:hover:text-[#d6b875] ${
                activeSection === 'reservas' ? 'dark:text-[#d6b875] text-[#8c6d2d] font-semibold' : 'dark:text-stone-300 text-stone-600'
              }`}
            >
              Tee Times
            </button>

            <button
              onClick={() => navigateTo('inicio', 'el-club')}
              className="dark:text-stone-300 text-stone-600 hover:text-[#8c6d2d] dark:hover:text-[#d6b875] transition-colors cursor-pointer"
            >
              El Club
            </button>

            <button
              onClick={() => navigateTo('tienda')}
              className={`transition-colors cursor-pointer hover:text-[#8c6d2d] dark:hover:text-[#d6b875] ${
                activeSection === 'tienda' ? 'dark:text-[#d6b875] text-[#8c6d2d] font-semibold' : 'dark:text-stone-300 text-stone-600'
              }`}
            >
              Pro Shop
            </button>

            <button
              onClick={() => navigateTo('reglas')}
              className={`transition-colors cursor-pointer hover:text-[#8c6d2d] dark:hover:text-[#d6b875] ${
                activeSection === 'reglas' ? 'dark:text-[#d6b875] text-[#8c6d2d] font-semibold' : 'dark:text-stone-300 text-stone-600'
              }`}
            >
              Código & Reglas
            </button>
          </nav>
        )}

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Book CTA on desktop */}
          {(!isHydrated || !user || user.role === 'socio') && activeSection !== 'reservas' && (
            <>
              <button
                onClick={() => navigateTo('reservas')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] hover:from-[#dfc68b] text-[#071b16] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <CalendarDays size={13} />
                <span>Reservar Ronda</span>
              </button>
              <Separator orientation="vertical" className="h-4 bg-stone-300/80 dark:bg-white/15 hidden sm:block" />
            </>
          )}

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            className="flex items-center p-1 rounded-full border dark:border-white/15 border-stone-300/80 dark:bg-[#04140f]/90 bg-stone-200/70 hover:border-[#bfa056] dark:hover:border-[#d6b875]/60 transition-all cursor-pointer shadow-sm group"
          >
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-white text-[#8c6d2d] shadow-sm scale-105'
                  : 'text-stone-400 opacity-60 hover:opacity-100'
              }`}
            >
              <Sun size={13} strokeWidth={2.4} />
            </div>

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

          <Separator orientation="vertical" className="h-4 bg-stone-300/80 dark:bg-white/15 hidden min-[420px]:block" />

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
                  <div className="p-3">
                    <div className="font-semibold text-xs dark:text-[#efe9d8] text-[#122a22]">{user.name}</div>
                    <div className="text-[10px] dark:text-stone-400 text-stone-500 truncate">{user.email}</div>
                    <div className="mt-1.5 inline-block text-[10px] font-semibold dark:text-[#d6b875] text-[#8c6d2d] dark:bg-[#d6b875]/10 bg-amber-50 px-2 py-0.5 rounded-md border dark:border-transparent border-amber-200">
                      {user.title}
                    </div>
                  </div>

                  <Separator className="bg-stone-200 dark:bg-white/10 my-1" />

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
              className="relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full dark:bg-white/10 bg-stone-200/80 hover:bg-white dark:hover:bg-white/20 text-xs font-semibold dark:text-[#f5f2e9] text-[#122a22] transition-all cursor-pointer"
            >
              <Lock size={12} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              <span className="hidden min-[420px]:inline">Acceso Staff</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          {(!isHydrated || !user || user.role === 'socio') && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white text-stone-700 dark:text-stone-200 cursor-pointer"
              aria-label="Abrir Menú"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (!isHydrated || !user || user.role === 'socio') && (
        <div className="lg:hidden border-t dark:border-white/10 border-stone-200 dark:bg-[#071b16] bg-[#f8f6f0] px-4 py-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-2">

            <button
              onClick={() => navigateTo('reservas')}
              className="w-full text-left px-4 py-3 rounded-2xl dark:bg-[#d6b875]/20 bg-amber-50 border border-[#d6b875]/40 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875]"
            >
              <CalendarDays size={16} />
              <span>Tee Times (Reservas)</span>
            </button>

            <button
              onClick={() => navigateTo('inicio', 'el-club')}
              className="w-full text-left px-4 py-3 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/5 border-stone-200 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#122a22] dark:text-white"
            >
              <Crown size={16} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              <span>El Club & Membresía</span>
            </button>

            <Separator className="bg-stone-200 dark:bg-white/10 my-1" />

            <button
              onClick={() => navigateTo('tienda')}
              className="w-full text-left px-4 py-3 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/5 border-stone-200 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#122a22] dark:text-white"
            >
              <ShoppingBag size={16} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              <span>Pro Shop Boutique</span>
            </button>

            <button
              onClick={() => navigateTo('reglas')}
              className="w-full text-left px-4 py-3 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/5 border-stone-200 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#122a22] dark:text-white"
            >
              <BookOpen size={16} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              <span>Código & Reglas</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
