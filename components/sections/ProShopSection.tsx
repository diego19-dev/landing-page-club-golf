'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { SectionId, Product } from '@/types'
import { PRODUCTS } from '@/data/clubData'
import {
  ShoppingBag,
  Plus,
  Check,
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  Filter
} from 'lucide-react'

interface ProShopSectionProps {
  activeSection: SectionId
  cartCount: number
  setCartCount: (count: number) => void
}

export function ProShopSection({ activeSection, cartCount, setCartCount }: ProShopSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [addedItemName, setAddedItemName] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Palos', label: 'Palos & Putters' },
    { id: 'Ropa', label: 'Textil & Ropa' },
    { id: 'Bolas', label: 'Bolas de Torneo' },
    { id: 'Accesorios', label: 'Accesorios' },
  ]

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return PRODUCTS
    return PRODUCTS.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  const handleAddToCart = (productName: string) => {
    setCartCount(cartCount + 1)
    setAddedItemName(productName)
    setTimeout(() => {
      setAddedItemName(null)
    }, 2000)
  }

  return (
    <section
      id="tienda"
      className="border-y dark:border-white/10 border-stone-200 dark:bg-[#071b16] bg-[#f8f6f0] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 dark:text-[#f5f2e9] text-[#122a22] animate-in fade-in duration-300 relative overflow-hidden transition-colors duration-200"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#167052]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#d6b875]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b dark:border-white/10 border-stone-200">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8c6d2d] dark:text-[#d6b875] mb-2 flex items-center gap-1.5">
              <Sparkles size={13} />
              02 · Boutique Oficial
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-light dark:text-[#efe9d8] text-[#122a22] tracking-tight leading-tight">
              Selección <em className="italic text-[#8c6d2d] dark:text-[#d6b875] font-normal">del Club.</em>
            </h2>
            <p className="mt-2 text-xs sm:text-sm dark:text-[#aab8af] text-stone-600 max-w-xl leading-relaxed">
              Equipamiento técnico de alto rendimiento, textil exclusivo con el escudo del club y accesorios oficiales seleccionados por nuestros profesionales de la PGA.
            </p>
          </div>

          {/* Cart Status Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl dark:bg-[#0c2820] bg-white border dark:border-[#d6b875]/30 border-stone-300 shadow-sm dark:shadow-lg dark:shadow-black/40">
              <div className="relative">
                <ShoppingBag size={18} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#d6b875] to-[#c2a159] text-[9px] font-extrabold text-[#071b16] animate-in zoom-in shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider dark:text-stone-400 text-stone-500 font-semibold">
                  Cesta
                </span>
                <span className="font-mono text-xs font-bold dark:text-[#efe9d8] text-[#122a22]">
                  {cartCount} {cartCount === 1 ? 'artículo' : 'artículos'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Added to cart notification toast */}
        {addedItemName && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r dark:from-[#0c2820] dark:to-[#071b16] from-white to-stone-50 border dark:border-[#d6b875]/50 border-stone-300 shadow-2xl dark:shadow-black/80 shadow-stone-900/10 text-xs dark:text-[#efe9d8] text-[#122a22] animate-in slide-in-from-bottom-3 duration-200">
            <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <span className="font-semibold text-[#8c6d2d] dark:text-[#d6b875] block">Añadido a tu cesta</span>
              <span className="text-[11px] dark:text-stone-300 text-stone-600">{addedItemName}</span>
            </div>
          </div>
        )}

        {/* Category Filters Bar */}
        <div className="my-8 flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider dark:text-stone-400 text-stone-600 mr-1 hidden sm:flex items-center gap-1">
              <Filter size={12} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              Catálogo:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id
              const count = cat.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] text-[#071b16] font-bold shadow-md shadow-[#d6b875]/20 scale-[1.02]'
                      : 'dark:bg-[#0c2820]/80 bg-white dark:text-stone-300 text-stone-700 hover:text-stone-950 dark:hover:text-white border dark:border-white/10 border-stone-200 shadow-xs'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-[#071b16]/20 text-[#071b16]' : 'dark:bg-white/5 bg-stone-100 dark:text-stone-400 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <span className="text-xs dark:text-stone-400 text-stone-500 font-mono hidden md:inline shrink-0">
            Mostrando {filteredProducts.length} de {PRODUCTS.length} productos
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.name}
              className="group rounded-3xl border dark:border-white/10 border-stone-200 dark:bg-[#0c2820]/75 bg-white hover:border-[#bfa056] dark:hover:border-[#d6b875]/40 transition-all duration-300 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl dark:shadow-black/40 hover:-translate-y-1"
            >
              <div>
                {/* Product Image Container */}
                <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black/40 border dark:border-white/10 border-stone-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay for subtle text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Category Pill */}
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#efe9d8]">
                    {product.category}
                  </span>

                  {/* Special Tag if present */}
                  {product.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#d6b875] to-[#c2a159] text-[#071b16] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider shadow-md">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Product Metadata */}
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-medium leading-snug dark:text-[#efe9d8] text-[#122a22] group-hover:text-[#8c6d2d] dark:group-hover:text-[#d6b875] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="mt-1 text-xs dark:text-stone-400 text-stone-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Add to Cart Button */}
              <div className="mt-4 pt-3 border-t dark:border-white/10 border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 block tracking-wider">
                    Precio Club
                  </span>
                  <span className="font-mono text-lg font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                    {product.price}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product.name)}
                  aria-label={`Añadir ${product.name} a la cesta`}
                  className="rounded-xl dark:bg-white/5 bg-stone-100 hover:bg-gradient-to-r hover:from-[#d6b875] hover:to-[#c2a159] dark:text-stone-200 text-stone-800 hover:text-[#071b16] border dark:border-white/15 border-stone-300 hover:border-[#d6b875] p-2.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="text-xs font-bold pr-1">Añadir</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Boutique Guarantees Footer */}
        <div className="mt-14 pt-8 border-t dark:border-white/10 border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/5 border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl dark:bg-[#d6b875]/10 bg-amber-50 border dark:border-[#d6b875]/25 border-amber-200 flex items-center justify-center shrink-0 text-[#8c6d2d] dark:text-[#d6b875]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold dark:text-[#efe9d8] text-[#122a22] uppercase tracking-wider">
                Garantía Oficial & Fitting
              </h4>
              <p className="text-[11px] dark:text-stone-400 text-stone-600 mt-0.5 leading-relaxed">
                Ajuste personalizado por profesionales del club con tecnología TrackMan 4 en nuestro campo de prácticas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/5 border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl dark:bg-[#10b981]/10 bg-emerald-50 border dark:border-[#10b981]/25 border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 dark:text-[#10b981]">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold dark:text-[#efe9d8] text-[#122a22] uppercase tracking-wider">
                Recogida en Club House
              </h4>
              <p className="text-[11px] dark:text-stone-400 text-stone-600 mt-0.5 leading-relaxed">
                Listo para retirar antes de tu tee time o preparado directamente en tu buggy asignado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/5 border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl dark:bg-[#d6b875]/10 bg-amber-50 border dark:border-[#d6b875]/25 border-amber-200 flex items-center justify-center shrink-0 text-[#8c6d2d] dark:text-[#d6b875]">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold dark:text-[#efe9d8] text-[#122a22] uppercase tracking-wider">
                Homologación R&A y USGA
              </h4>
              <p className="text-[11px] dark:text-stone-400 text-stone-600 mt-0.5 leading-relaxed">
                Todos los productos de nuestro catálogo cumplen la normativa oficial para competición federada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
