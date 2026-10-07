'use client'

import { MapPin, ShieldCheck, Flag, LogOut, Phone, Mail, Clock, Lock } from 'lucide-react'
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

  // Public visitor / member editorial footer
  return (
    <footer className="border-t dark:border-white/10 border-stone-300 transition-colors duration-200 pt-16 pb-12 px-4 sm:px-6 lg:px-10 dark:bg-[#040e0b] bg-[#eae5d8]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b dark:border-white/10 border-stone-300/80">
          {/* Brand & Heritage Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border dark:border-[#d6b875]/40 border-[#8c6d2d]/30 dark:bg-[#0c2820] bg-white flex items-center justify-center">
                <span className="font-serif text-sm font-bold text-[#8c6d2d] dark:text-[#d6b875]">M</span>
              </div>
              <div>
                <p className="font-serif text-xl tracking-[.18em] dark:text-[#efe9d8] text-[#122a22] font-medium leading-none">
                  MONTEVERDE
                </p>
                <span className="text-[9px] uppercase tracking-[.25em] dark:text-[#d6b875] text-[#8c6d2d] font-semibold block mt-1">
                  Golf Club · Est. 1987
                </span>
              </div>
            </div>

            <p className="text-xs dark:text-stone-400 text-stone-600 font-light leading-relaxed max-w-sm">
              Campo de golf privado de 18 hoyos de campeonato homologado por la RFEG y el R&A. Una dehesa protegida consagrada a la tradición y el juego puro.
            </p>

            <div className="pt-2 text-xs dark:text-stone-400 text-stone-600 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-[#8c6d2d] dark:text-[#d6b875] shrink-0" />
                <span>Camino del Roble 18 · 28260 Madrid, España</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={13} className="text-[#8c6d2d] dark:text-[#d6b875] shrink-0" />
                <span>Horario: Martes a Domingo · 07:30 a Crepúsculo</span>
              </p>
            </div>
          </div>

          {/* Links: El Campo */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm uppercase tracking-wider dark:text-[#efe9d8] text-[#122a22] font-semibold">
              El Recorrido
            </h4>
            <ul className="space-y-2 dark:text-stone-400 text-stone-600">
              <li>18 Hoyos Championship</li>
              <li>Diseño Javier Arana</li>
              <li>Greens Agrostis A-4</li>
              <li>Driving Range 300m</li>
              <li>Putting Green 1.200m²</li>
            </ul>
          </div>

          {/* Links: Servicios & Club */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm uppercase tracking-wider dark:text-[#efe9d8] text-[#122a22] font-semibold">
              Experiencia Club
            </h4>
            <ul className="space-y-2 dark:text-stone-400 text-stone-600">
              <li>Restaurante La Encomienda</li>
              <li>TrackMan Performance Lab</li>
              <li>Boutique Pro Shop Oficial</li>
              <li>Taquillas & Sala de Socios</li>
              <li>Torneos & Circuito Social</li>
            </ul>
          </div>

          {/* Links: Secretaría & Acceso */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm uppercase tracking-wider dark:text-[#efe9d8] text-[#122a22] font-semibold">
              Secretaría
            </h4>
            <ul className="space-y-2 dark:text-stone-400 text-stone-600">
              <li className="flex items-center gap-1.5">
                <Phone size={12} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                <span>+34 91 845 22 00</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail size={12} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                <span>info@monteverdegolf.es</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => openLoginModal()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl dark:bg-white/5 bg-stone-200/90 dark:text-[#d6b875] text-[#8c6d2d] font-semibold text-[11px] uppercase tracking-wider hover:bg-[#d6b875] hover:text-[#071b16] transition-all cursor-pointer"
                >
                  <Lock size={11} />
                  <span>Terminal de Personal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs dark:text-stone-500 text-stone-600 font-light">
          <div>
            © {new Date().getFullYear()} Real Club de Golf Monteverde. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#8c6d2d] dark:hover:text-[#d6b875] transition-colors cursor-pointer">
              Privacidad & Aviso Legal
            </span>
            <span>·</span>
            <span className="hover:text-[#8c6d2d] dark:hover:text-[#d6b875] transition-colors cursor-pointer">
              Protocolo de Juego R&A
            </span>
            <span>·</span>
            <span className="hover:text-[#8c6d2d] dark:hover:text-[#d6b875] transition-colors cursor-pointer">
              Federación Española
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
