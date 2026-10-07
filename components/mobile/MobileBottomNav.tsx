'use client'

import {
  Compass,
  Flag,
  CalendarDays,
  ShoppingBag,
  Crown,
  BookOpen
} from 'lucide-react'

export type MobileTabId = 'inicio' | 'reservas' | 'tienda' | 'club' | 'reglas'

interface MobileBottomNavProps {
  currentTab: MobileTabId
  onSelectTab: (tab: MobileTabId) => void
  cartCount?: number
}

export function MobileBottomNav({
  currentTab,
  onSelectTab,
  cartCount = 0
}: MobileBottomNavProps) {
  const tabs = [
    { id: 'inicio' as MobileTabId, label: 'Inicio', icon: Compass },
    { id: 'reservas' as MobileTabId, label: 'Tee Time', icon: CalendarDays, isPrimary: true },
    { id: 'tienda' as MobileTabId, label: 'Pro Shop', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'club' as MobileTabId, label: 'El Club', icon: Crown },
    { id: 'reglas' as MobileTabId, label: 'Reglas', icon: BookOpen }
  ]

  return (
    /* shrink-0: NO es fixed, vive al final del flex column del overlay fixed parent */
    <nav
      aria-label="Navegación móvil"
      className="shrink-0 dark:bg-[#071b16]/98 bg-white/98 backdrop-blur-xl border-t dark:border-[#d6b875]/20 border-stone-200/90 shadow-[0_-6px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          const Icon = tab.icon

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className="relative flex flex-col items-center justify-end py-1 px-2 cursor-pointer focus:outline-none active:scale-95 transition-transform"
              >
                <div className="absolute -top-7">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-2 ${isActive
                      ? 'bg-gradient-to-tr from-[#8c6d2d] via-[#d6b875] to-[#f4e2b0] text-[#071b16] border-white/40 ring-4 ring-[#d6b875]/25 scale-105'
                      : 'dark:bg-gradient-to-tr dark:from-[#0c2820] dark:to-[#164336] bg-gradient-to-tr from-[#122a22] to-[#1e4539] text-[#d6b875] border-[#d6b875]/35'
                    }`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                </div>
                {/* Spacer invisible para que el flex tome espacio adecuado en altura sin romper el layout */}
                <div className="h-6 w-full" />
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isActive ? 'text-[#8c6d2d] dark:text-[#d6b875]' : 'text-stone-500 dark:text-stone-400'}`}>
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl cursor-pointer focus:outline-none active:scale-95 transition-transform group"
            >
              <div className="relative">
                <Icon size={21} strokeWidth={isActive ? 2.4 : 1.8} className={`transition-colors ${isActive ? 'text-[#8c6d2d] dark:text-[#d6b875]' : 'text-stone-400 dark:text-stone-500'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-[#d6b875] text-[#071b16] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${isActive ? 'text-[#8c6d2d] dark:text-[#d6b875]' : 'text-stone-400 dark:text-stone-500'}`}>
                {tab.label}
              </span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#8c6d2d] dark:bg-[#d6b875]" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
