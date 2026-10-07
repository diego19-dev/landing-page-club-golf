'use client'

import { useState, useEffect } from 'react'
import { SectionId, UserRole } from '@/types'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ClubLifeSection } from '@/components/sections/ClubLifeSection'
import { ProShopShowcase } from '@/components/sections/ProShopShowcase'
import { EtiquetteShowcase } from '@/components/sections/EtiquetteShowcase'
import { AtmosphericCTA } from '@/components/sections/AtmosphericCTA'
import { AdmissionModal } from '@/components/sections/AdmissionModal'
import { ReservasSection } from '@/components/sections/ReservasSection'
import { ProShopSection } from '@/components/sections/ProShopSection'
import { ReglasSection } from '@/components/sections/ReglasSection'
import { AdminSection } from '@/components/sections/AdminSection'
import { StarterSection } from '@/components/sections/StarterSection'
import { LoginModal } from '@/components/auth/LoginModal'
import { MobileBottomNav, MobileTabId } from '@/components/mobile/MobileBottomNav'
import {
  MobileHeader,
  MobileHomeView,
  MobileReservasView,
  MobileProShopView,
  MobileClubView,
  MobileReglasView
} from '@/components/mobile/MobileViews'
import {
  ArrowLeft,
  CalendarDays,
  ShoppingBag,
  BookOpen,
  CheckCircle2,
  Flag,
  Crown
} from 'lucide-react'

export default function MonteverdeHome() {
  // ─── State ───────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<SectionId>('inicio')
  const [mobileTab, setMobileTab] = useState<MobileTabId>('inicio')
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [cartCount, setCartCount] = useState<number>(0)
  const [admissionModalOpen, setAdmissionModalOpen] = useState<boolean>(false)
  const [quickCartToast, setQuickCartToast] = useState<string | null>(null)
  const { user, isHydrated, openLoginModal } = useAuth()

  // ─── Access Control ───────────────────────────────────────────────────────
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
      if (activeSection === 'admin' || activeSection === 'starter') {
        setActiveSection('inicio')
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
  }, [user, isHydrated, activeSection])

  // ─── Navigation handlers ───────────────────────────────────────────────────
  const handleBackToInicio = () => {
    if (user?.role === 'starter') { setActiveSection('starter'); return }
    if (user?.role === 'admin') { setActiveSection('admin'); return }
    setActiveSection('inicio')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleGoToSection = (section: SectionId) => {
    if (user?.role === 'starter') { setActiveSection('starter'); return }
    if (user?.role === 'admin') { setActiveSection('admin'); return }
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'starter') setActiveSection('starter')
    else if (role === 'admin') setActiveSection('admin')
    else setActiveSection('inicio')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1)
    setQuickCartToast(productName)
    setTimeout(() => setQuickCartToast(null), 2500)
  }

  const isPublicUser = !isHydrated || !user || user.role === 'socio'

  // ─── Shared modals + toasts (rendered once, used by both layouts) ─────────
  const sharedElements = (
    <>
      {quickCartToast && (
        <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[200] animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl dark:bg-[#0c2820] bg-white border dark:border-[#d6b875] border-stone-300 shadow-2xl dark:shadow-black/70 text-xs">
            <CheckCircle2 size={16} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            <div>
              <span className="font-bold dark:text-white text-stone-900">{quickCartToast}</span>
              <span className="text-stone-500 dark:text-stone-400 block text-[10px]">Añadido a tu bolsa del Pro Shop</span>
            </div>
            <button
              onClick={() => { handleGoToSection('tienda'); setMobileTab('tienda') }}
              className="ml-2 px-2.5 py-1 rounded-lg bg-[#d6b875] text-[#071b16] font-bold text-[10px] uppercase cursor-pointer"
            >
              Ver Bolsa
            </button>
          </div>
        </div>
      )}
      <LoginModal onLoginSuccess={handleLoginSuccess} />
      <AdmissionModal isOpen={admissionModalOpen} onClose={() => setAdmissionModalOpen(false)} />
    </>
  )

  return (
    <>
      {sharedElements}

      {/* ====================================================================
          DESKTOP LAYOUT (md+): Scroll editorial clásico, Header + Footer
          ==================================================================== */}
      <div className="hidden md:flex flex-col min-h-screen dark:bg-[#071b16] bg-[#f8f6f0] dark:text-[#f5f2e9] text-[#122a22] selection:bg-[#d6b875] selection:text-[#071b16] transition-colors duration-200">
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        <main className="flex-1 flex flex-col">
          {isHydrated && user?.role === 'starter' && (
            <div className="flex-1 animate-in fade-in duration-300"><StarterSection /></div>
          )}
          {isHydrated && user?.role === 'admin' && (
            <div className="flex-1 animate-in fade-in duration-300"><AdminSection /></div>
          )}
          {isPublicUser && (
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleGoToSection('reservas')} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeSection === 'reservas' ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm' : 'dark:bg-[#0c2820] dark:text-[#d9dfd6] dark:hover:text-[#d6b875] dark:border-white/10 bg-white text-stone-700 hover:text-[#8c6d2d] border border-stone-300/80 shadow-xs'}`}>
                      <CalendarDays size={14} /><span>Tee Time</span>
                    </button>
                    <button onClick={() => handleGoToSection('tienda')} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeSection === 'tienda' ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm' : 'dark:bg-[#0c2820] dark:text-[#d9dfd6] dark:hover:text-[#d6b875] dark:border-white/10 bg-white text-stone-700 hover:text-[#8c6d2d] border border-stone-300/80 shadow-xs'}`}>
                      <ShoppingBag size={14} /><span>Pro Shop ({cartCount})</span>
                    </button>
                    <button onClick={() => handleGoToSection('club')} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeSection === 'club' ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm' : 'dark:bg-[#0c2820] dark:text-[#d9dfd6] dark:hover:text-[#d6b875] dark:border-white/10 bg-white text-stone-700 hover:text-[#8c6d2d] border border-stone-300/80 shadow-xs'}`}>
                      <Crown size={14} /><span>El Club</span>
                    </button>
                    <button onClick={() => handleGoToSection('reglas')} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeSection === 'reglas' ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm' : 'dark:bg-[#0c2820] dark:text-[#d9dfd6] dark:hover:text-[#d6b875] dark:border-white/10 bg-white text-stone-700 hover:text-[#8c6d2d] border border-stone-300/80 shadow-xs'}`}>
                      <BookOpen size={14} /><span>Reglas</span>
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'inicio' && (
                <div className="flex flex-col w-full animate-in fade-in duration-300">
                  <HeroSection activeSection={activeSection} setActiveSection={setActiveSection} onExploreCourse={() => handleGoToSection('reservas')} />
                  <ClubLifeSection onOpenAdmission={() => setAdmissionModalOpen(true)} />
                  <ProShopShowcase onGoToShop={() => handleGoToSection('tienda')} onAddToCart={handleAddToCart} />
                  <EtiquetteShowcase onGoToRules={() => handleGoToSection('reglas')} />
                  <AtmosphericCTA onBookTeeTime={() => handleGoToSection('reservas')} onOpenAdmission={() => setAdmissionModalOpen(true)} />
                </div>
              )}
              {activeSection === 'reservas' && (<div className="flex-1 animate-in fade-in duration-300"><ReservasSection activeSection={activeSection} /></div>)}
              {activeSection === 'tienda' && (<div className="flex-1 animate-in fade-in duration-300"><ProShopSection activeSection={activeSection} cartCount={cartCount} setCartCount={setCartCount} /></div>)}
              {activeSection === 'club' && (<div className="flex-1 animate-in fade-in duration-300"><ClubLifeSection onOpenAdmission={() => setAdmissionModalOpen(true)} /><EtiquetteShowcase onGoToRules={() => handleGoToSection('reglas')} /></div>)}
              {activeSection === 'reglas' && (<div className="flex-1 animate-in fade-in duration-300"><ReglasSection activeSection={activeSection} /></div>)}
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* ====================================================================
          MOBILE LAYOUT (<md): Overlay fixed al viewport — CERO scroll de página
          Estructura: fixed inset-0 → header(56px) + content(flex-1) + dock(auto)
          ==================================================================== */}
      <div className="md:hidden fixed inset-0 overflow-hidden flex flex-col z-10 dark:bg-[#071b16] bg-[#f8f6f0] dark:text-[#f5f2e9] text-[#122a22]">

        {/* Casos especiales: Starter y Admin con scroll interno propio */}
        {isHydrated && user?.role === 'starter' ? (
          <div className="flex-1 overflow-y-auto"><StarterSection /></div>
        ) : isHydrated && user?.role === 'admin' ? (
          <div className="flex-1 overflow-y-auto"><AdminSection /></div>
        ) : (
          <>
            {/* Cabecera compacta fija (56px) */}
            <MobileHeader
              onOpenLogin={() => openLoginModal('socio')}
              currentTab={mobileTab}
              onSelectTab={setMobileTab}
            />

            {/* Zona de contenido — flex-1, overflow hidden en el eje vertical de la página */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
              {mobileTab === 'inicio' && (
                <div key="inicio" className="absolute inset-0 overflow-y-auto overscroll-none animate-in fade-in duration-150">
                  <MobileHomeView onGoToTab={setMobileTab} onOpenAdmission={() => setAdmissionModalOpen(true)} />
                </div>
              )}
              {mobileTab === 'reservas' && (
                <div key="reservas" className="absolute inset-0 overflow-y-auto overscroll-none animate-in fade-in duration-150">
                  <MobileReservasView />
                </div>
              )}
              {mobileTab === 'tienda' && (
                <div key="tienda" className="absolute inset-0 overflow-y-auto overscroll-none animate-in fade-in duration-150">
                  <MobileProShopView onAddToCart={handleAddToCart} />
                </div>
              )}
              {mobileTab === 'club' && (
                <div key="club" className="absolute inset-0 overflow-y-auto overscroll-none animate-in fade-in duration-150">
                  <MobileClubView onOpenAdmission={() => setAdmissionModalOpen(true)} />
                </div>
              )}
              {mobileTab === 'reglas' && (
                <div key="reglas" className="absolute inset-0 overflow-y-auto overscroll-none animate-in fade-in duration-150">
                  <MobileReglasView />
                </div>
              )}
            </div>

            {/* Dock inferior — parte del flex column, NO fixed, al fondo del contenedor fixed */}
            <MobileBottomNav
              currentTab={mobileTab}
              onSelectTab={setMobileTab}
              cartCount={cartCount}
            />
          </>
        )}
      </div>
    </>
  )
}
