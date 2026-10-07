'use client'

import {
  Compass,
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
    { id: 'reservas' as MobileTabId, label: 'Tee Time', icon: CalendarDays },
    { id: 'tienda' as MobileTabId, label: 'Pro Shop', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'club' as MobileTabId, label: 'El Club', icon: Crown },
    { id: 'reglas' as MobileTabId, label: 'Reglas', icon: BookOpen }
  ]

  return (
    <nav
      aria-label="Navegación móvil"
      className="shrink-0 dark:bg-[#071b16]/98 bg-white/98 backdrop-blur-xl border-t dark:border-[#d6b875]/20 border-stone-200/90 shadow-[0_-6px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl cursor-pointer focus:outline-none active:scale-95 transition-transform group"
            >
              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={`transition-colors ${isActive ? 'text-[#8c6d2d] dark:text-[#d6b875]' : 'text-stone-400 dark:text-stone-500'}`}
                />
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

