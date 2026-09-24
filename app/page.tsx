'use client'

import { useState, useEffect } from 'react'
import { SectionId, UserRole } from '@/types'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ReservasSection } from '@/components/sections/ReservasSection'
import { ProShopSection } from '@/components/sections/ProShopSection'
import { ReglasSection } from '@/components/sections/ReglasSection'
import { AdminSection } from '@/components/sections/AdminSection'
import { StarterSection } from '@/components/sections/StarterSection'
import { LoginModal } from '@/components/auth/LoginModal'
import {
  ArrowLeft,
  CalendarDays,
  ShoppingBag,
  BookOpen
} from 'lucide-react'

export default function MonteverdeHome() {
  const [activeSection, setActiveSection] = useState<SectionId>('inicio')
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [cartCount, setCartCount] = useState<number>(0)
  const { user, isHydrated } = useAuth()

  // STRICT ACCESS CONTROL & IMMEDIATE REDIRECT:
  // - Starter -> directly and exclusively in 'starter'
  // - Admin   -> directly and exclusively in 'admin'
  // - Visitor/Socio -> restricted from 'admin' and 'starter'
  useEffect(() => {
    if (!isHydrated) return

    if (user?.role === 'starter') {
      if (activeSection !== 'starter') {
        setActiveSection('starter')
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    } else if (user?.role === 'admin') {
      if (activeSection !== 'admin') {
        setActiveSection('admin')
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    } else {
      // Unauthenticated or regular socio: prevent staying on admin or starter
      if (activeSection === 'admin' || activeSection === 'starter') {
        setActiveSection('inicio')
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
  }, [user, isHydrated, activeSection])

  const handleBackToInicio = () => {
    if (user?.role === 'starter') {
      setActiveSection('starter')
      return
    }
    if (user?.role === 'admin') {
      setActiveSection('admin')
      return
    }
    setActiveSection('inicio')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleGoToSection = (section: SectionId) => {
    // Prohibit cross-section navigation if user is Starter or Admin
    if (user?.role === 'starter') {
      setActiveSection('starter')
      return
    }
    if (user?.role === 'admin') {
      setActiveSection('admin')
      return
    }
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'starter') {
      setActiveSection('starter')
    } else if (role === 'admin') {
      setActiveSection('admin')
    } else {
      setActiveSection('inicio')
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className="dark:bg-[#071b16] bg-[#f8f6f0] dark:text-[#f5f2e9] text-[#122a22] flex flex-col min-h-screen selection:bg-[#d6b875] selection:text-[#071b16] transition-colors duration-200">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main className="flex-1 flex flex-col">
        {/* CASE 1: STARTER ROLE -> DIRECT & EXCLUSIVE ACCESS TO STARTER CONTROL */}
        {isHydrated && user?.role === 'starter' && (
          <div className="flex-1 animate-in fade-in duration-300">
            <StarterSection />
          </div>
        )}

        {/* CASE 2: ADMIN ROLE -> DIRECT & EXCLUSIVE ACCESS TO ADMIN SUITE */}
        {isHydrated && user?.role === 'admin' && (
          <div className="flex-1 animate-in fade-in duration-300">
            <AdminSection />
          </div>
        )}

        {/* CASE 3: PUBLIC / SOCIO -> PUBLIC CLUB EXPERIENCE */}
        {(!isHydrated || !user || user.role === 'socio') && (
          <>
            {activeSection !== 'inicio' && (
              <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-10 flex items-center justify-between flex-wrap gap-2.5 border-b dark:border-white/10 border-stone-200 pb-3">
                <button
                  onClick={handleBackToInicio}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8c6d2d] hover:text-[#5a4313] dark:text-[#d6b875] dark:hover:text-[#ead49a] cursor-pointer transition-colors"
                >
                  <ArrowLeft size={15} />
                  <span>Volver a Inicio</span>
                </button>

                {/* Botones de navegación en el body entre secciones públicas */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleGoToSection('reservas')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeSection === 'reservas'
                        ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm'
                        : 'dark:bg-[#0c2820] dark:text-[#d9dfd6] dark:hover:text-[#d6b875] dark:border-white/10 bg-white text-stone-700 hover:text-[#8c6d2d] border border-stone-300/80 shadow-xs'
                    }`}
                  >
                    <CalendarDays size={14} />
                    <span>Tee Time</span>
                  </button>

                  <button
                    onClick={() => handleGoToSection('tienda')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeSection === 'tienda'
                        ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm'
                        : 'dark:bg-[#0c2820] dark:text-[#d9dfd6] dark:hover:text-[#d6b875] dark:border-white/10 bg-white text-stone-700 hover:text-[#8c6d2d] border border-stone-300/80 shadow-xs'
                    }`}
                  >
                    <ShoppingBag size={14} />
                    <span>Pro Shop</span>
                  </button>

                  <button
                    onClick={() => handleGoToSection('reglas')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeSection === 'reglas'
                        ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm'
                        : 'dark:bg-[#0c2820] dark:text-[#d9dfd6] dark:hover:text-[#d6b875] dark:border-white/10 bg-white text-stone-700 hover:text-[#8c6d2d] border border-stone-300/80 shadow-xs'
                    }`}
                  >
                    <BookOpen size={14} />
                    <span>Reglas</span>
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'inicio' && (
              <HeroSection activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {activeSection === 'reservas' && (
              <div className="flex-1 animate-in fade-in duration-300">
                <ReservasSection activeSection={activeSection} />
              </div>
            )}
            {activeSection === 'tienda' && (
              <div className="flex-1 animate-in fade-in duration-300">
                <ProShopSection activeSection={activeSection} cartCount={cartCount} setCartCount={setCartCount} />
              </div>
            )}
            {activeSection === 'reglas' && (
              <div className="flex-1 animate-in fade-in duration-300">
                <ReglasSection activeSection={activeSection} />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <LoginModal onLoginSuccess={handleLoginSuccess} />
    </div>
  )
}
