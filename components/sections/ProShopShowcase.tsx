'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { PRODUCTS } from '@/data/clubData'
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  ShieldCheck,
  Eye
} from 'lucide-react'

interface ProShopShowcaseProps {
  onGoToShop: () => void
  onAddToCart: (productName: string) => void
}

export function ProShopShowcase({ onGoToShop, onAddToCart }: ProShopShowcaseProps) {
  const [addedItem, setAddedItem] = useState<string | null>(null)

  // Curated spotlight selection: Driver, Putter, Polo, and Titleist balls
  const spotlightProducts = [
    PRODUCTS[0], // Driver Apex Pro
    PRODUCTS[1], // Putter Odyssey White Hot
    PRODUCTS[4], // Polo Club Heritage
    PRODUCTS[7], // Bolas Titleist Pro V1
  ].filter(Boolean)

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product.name)
    setAddedItem(product.name)
    setTimeout(() => {
      setAddedItem(null)
    }, 2000)
  }

  return (
    <section id="pro-shop-preview" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-10 dark:bg-[#071b16] bg-[#f8f6f0] border-t dark:border-white/10 border-stone-200 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-2 mb-3">
              <ShoppingBag size={14} />
              03 · Boutique & Guarnicionería
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light dark:text-[#f5f2e9] text-[#122a22] tracking-tight leading-[1.08]">
              Equipamiento <br />
              <em className="italic font-normal text-[#8c6d2d] dark:text-[#d6b875]">de alta escuela.</em>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="max-w-md text-sm sm:text-base font-light dark:text-[#aab8af] text-stone-600 leading-relaxed">
              Material técnico de competición, textil confeccionado a medida y accesorios con el blasón oficial de Monteverde.
            </p>
            <button
              onClick={onGoToShop}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full dark:bg-[#0c2820] bg-white border dark:border-[#d6b875]/30 border-stone-300 text-xs font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875] hover:border-[#8c6d2d] transition-all cursor-pointer shadow-sm shrink-0"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Feature Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
          {/* Craftmanship Visual Banner */}
          <div className="lg:col-span-5 relative h-96 sm:h-[480px] rounded-3xl overflow-hidden border dark:border-white/10 border-stone-200 shadow-xl group">
            <Image
              src="/proshop-craft.jpg"
              alt="Bespoke luxury golf gear and leather bag"
              fill
              className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t dark:from-[#071b16] from-[#122a22]/85 via-transparent to-black/30" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d6b875] text-[#071b16] inline-block mb-2 shadow-sm">
                Colección Artesanal
              </span>
              <h3 className="font-serif text-2xl text-white font-light">
                Piel noble & Forja clásica
              </h3>
              <p className="text-xs text-stone-300 font-light mt-1">
                Bolsas de piel vacuna tratada a mano y hierros forjados en Japón con tolerancias de precisión milimétrica.
              </p>
            </div>
          </div>

          {/* Curated 4-Product Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {spotlightProducts.map((product) => {
              const isAdded = addedItem === product.name
              return (
                <div
                  key={product.id}
                  onClick={onGoToShop}
                  className="p-5 rounded-3xl dark:bg-[#0c2820] bg-white border dark:border-white/10 border-stone-200 hover:border-[#8c6d2d] dark:hover:border-[#d6b875]/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-lg"
                >
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-stone-100 dark:bg-black/30">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875]">
                        {product.category}
                      </span>
                      <span className="font-serif text-base font-semibold dark:text-[#d6b875] text-[#8c6d2d]">
                        {product.price}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-medium dark:text-[#f5f2e9] text-[#122a22] line-clamp-1 group-hover:text-[#8c6d2d] dark:group-hover:text-[#d6b875] transition-colors">
                      {product.name}
                    </h4>

                    <p className="text-xs dark:text-stone-400 text-stone-500 line-clamp-2 mt-1 mb-4 font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'dark:bg-white/10 bg-stone-100 dark:text-white text-stone-800 hover:bg-[#d6b875] hover:text-[#071b16]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>Añadido a la Bolsa</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Añadir a la Bolsa</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
