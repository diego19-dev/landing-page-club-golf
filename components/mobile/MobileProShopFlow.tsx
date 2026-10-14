'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Search,
  Filter,
  X,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Trash2,
  PackageCheck
} from 'lucide-react'
import { PRODUCTS } from '@/data/clubData'
import { Product } from '@/types'

export interface CartItem {
  product: Product
  quantity: number
  selectedOption?: string
}

interface MobileProShopFlowProps {
  onAddToCart?: (name: string) => void
  cartCount?: number
}

export function MobileProShopFlow({ onAddToCart, cartCount = 0 }: MobileProShopFlowProps) {
  const [selectedCat, setSelectedCat] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productOption, setProductOption] = useState<string>('Estándar')

  // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Categories
  const categories = [
    { id: 'Todos', label: 'Todos' },
    { id: 'Palos', label: 'Palos & Putters' },
    { id: 'Ropa', label: 'Ropa & Textil' },
    { id: 'Bolas', label: 'Bolas de Torneo' },
    { id: 'Accesorios', label: 'Accesorios' }
  ]

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCat === 'Todos' || p.category === selectedCat
      const matchSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [selectedCat, searchQuery])

  // Parse numeric price from string like "€489"
  const parsePrice = (priceStr: string): number => {
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10)
    return isNaN(num) ? 0 : num
  }

  // Add to cart helper
  const handleAddProduct = (product: Product, option: string = 'Estándar') => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.name === product.name && item.selectedOption === option)
      if (existing) {
        return prev.map((item) =>
          item.product.name === product.name && item.selectedOption === option
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1, selectedOption: option }]
    })

    if (onAddToCart) {
      onAddToCart(product.name)
    }
  }

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const copy = [...prev]
      const newQty = copy[index].quantity + delta
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== index)
      }
      copy[index] = { ...copy[index], quantity: newQty }
      return copy
    })
  }

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + parsePrice(item.product.price) * item.quantity
    }, 0)
  }, [cartItems])

  const totalItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [cartItems])

  const effectiveCartBadge = totalItemCount > 0 ? totalItemCount : cartCount

  return (
    <div className="min-h-full flex flex-col p-3.5 gap-3 dark:bg-[#071b16] bg-[#f8f6f0] relative">
      {/* Header bar */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-1.5">
            <Sparkles size={12} />
            Boutique Oficial Monteverde
          </span>
          <h2 className="text-base font-serif font-light dark:text-white text-[#071b16]">
            Catálogo &amp; Equipamiento
          </h2>
        </div>

        {/* View Cart Button */}
        <button
          type="button"
          onClick={() => {
            setOrderPlaced(false)
            setIsCartOpen(true)
          }}
          className="relative px-3 py-1.5 rounded-xl border dark:border-[#d6b875]/40 border-stone-300 dark:bg-[#0c2820] bg-white flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-transform"
        >
          <ShoppingBag size={15} className="text-[#8c6d2d] dark:text-[#d6b875]" />
          <span className="text-xs font-bold dark:text-[#d6b875] text-[#8c6d2d]">Bolsa</span>
          {effectiveCartBadge > 0 && (
            <span className="bg-[#8c6d2d] dark:bg-[#d6b875] text-white dark:text-[#071b16] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
              {effectiveCartBadge}
            </span>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar palos, textil, bolas o accesorios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8.5 pr-8 py-2 rounded-xl text-xs border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white dark:text-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#d6b875]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Pills (horizontal scroll) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
        {categories.map((cat) => {
          const isSelected = selectedCat === cat.id
          const count = cat.id === 'Todos' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat.id).length
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#8c6d2d] dark:bg-[#d6b875] text-white dark:text-[#071b16] shadow-sm font-bold'
                  : 'dark:bg-white/5 bg-stone-200/80 dark:text-stone-300 text-stone-700 hover:bg-stone-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-1 opacity-70 text-[10px]">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Product Grid (2 columns on mobile) */}
      <div className="flex-1 overflow-y-auto pr-0.5 pb-2">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-500 dark:text-stone-400">
            No se encontraron productos para tu búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.name}
                className="rounded-2xl overflow-hidden border dark:border-white/10 border-stone-200/90 dark:bg-[#0c2820] bg-white shadow-sm flex flex-col transition-all active:scale-[0.99]"
              >
                {/* Image & tag */}
                <div
                  className="relative h-32 w-full bg-stone-900 cursor-pointer overflow-hidden"
                  onClick={() => {
                    setSelectedProduct(prod)
                    setProductOption(prod.category === 'Ropa' ? 'Talla M' : 'Estándar')
                  }}
                >
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  {prod.tag && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#8c6d2d] dark:bg-[#d6b875] text-white dark:text-[#071b16] text-[8px] font-extrabold uppercase tracking-wider shadow-xs">
                      {prod.tag}
                    </span>
                  )}
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-baseline justify-between text-white">
                    <span className="font-serif font-bold text-xs text-[#d6b875]">{prod.price}</span>
                    <span className="text-[8px] text-[#10b981] font-semibold bg-black/60 px-1 rounded">En Stock</span>
                  </div>
                </div>

                {/* Info & action */}
                <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(prod)
                      setProductOption(prod.category === 'Ropa' ? 'Talla M' : 'Estándar')
                    }}
                  >
                    <span className="text-[8px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-bold block">
                      {prod.category}
                    </span>
                    <h3 className="font-serif text-[11px] font-bold dark:text-white text-stone-900 line-clamp-1 leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddProduct(prod)}
                      className="w-full py-2 px-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-[#d6b875] dark:hover:bg-[#d6b875] text-[#8c6d2d] dark:text-[#d6b875] hover:text-[#071b16] dark:hover:text-[#071b16] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                      <span>Añadir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          PRODUCT DETAIL QUICK VIEW MODAL / SHEET
          ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl dark:bg-[#0c2820] bg-white border dark:border-white/10 border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-6 duration-200">
            {/* Modal header image */}
            <div className="relative h-48 w-full shrink-0">
              <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer active:scale-95"
              >
                <X size={16} />
              </button>
              {selectedProduct.tag && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#d6b875] text-[#071b16] text-[9px] font-bold uppercase tracking-wider">
                  {selectedProduct.tag}
                </span>
              )}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d6b875]">
                  {selectedProduct.category}
                </span>
                <h3 className="font-serif text-lg font-bold leading-tight">{selectedProduct.name}</h3>
                <span className="font-serif text-xl font-bold text-[#d6b875]">{selectedProduct.price}</span>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
              <p className="text-xs dark:text-stone-300 text-stone-600 leading-relaxed">
                {selectedProduct.description ||
                  'Artículo oficial disponible en la Boutique del Club con sello de calidad Monteverde.'}
              </p>

              {/* Selector de opciones según categoría */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600 block mb-1.5">
                  {selectedProduct.category === 'Ropa'
                    ? 'Seleccionar Talla:'
                    : selectedProduct.category === 'Palos'
                    ? 'Flex / Especificación:'
                    : 'Presentación:'}
                </span>
                <div className="flex gap-2">
                  {(selectedProduct.category === 'Ropa'
                    ? ['Talla S', 'Talla M', 'Talla L', 'Talla XL']
                    : selectedProduct.category === 'Palos'
                    ? ['Regular Flex', 'Stiff Flex']
                    : ['Unidad Oficial']
                  ).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProductOption(opt)}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        productOption === opt
                          ? 'border-[#8c6d2d] dark:border-[#d6b875] bg-[#d6b875]/15 text-[#8c6d2d] dark:text-[#d6b875] font-bold'
                          : 'border-stone-200 dark:border-white/10 dark:bg-white/5 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Club perks */}
              <div className="p-2.5 rounded-xl dark:bg-[#071b16] bg-stone-100 border dark:border-white/10 border-stone-200 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                  <Truck size={13} className="text-[#10b981]" />
                  <span>Entrega inmediata en taquilla de socio o secretaría</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                  <ShieldCheck size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                  <span>Garantía oficial y fitting gratuito con Pro de la PGA</span>
                </div>
              </div>

              {/* Action buttons */}
              <button
                type="button"
                onClick={() => {
                  handleAddProduct(selectedProduct, productOption)
                  setSelectedProduct(null)
                }}
                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#8c6d2d] via-[#d6b875] to-[#8c6d2d] text-[#071b16] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Añadir a la Bolsa · {selectedProduct.price}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CART DRAWER / SHEET
          ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl dark:bg-[#0c2820] bg-white border dark:border-white/10 border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="p-4 border-b dark:border-white/10 border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#d6b875]/20 flex items-center justify-center text-[#8c6d2d] dark:text-[#d6b875]">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold dark:text-white text-stone-900 leading-none">
                    Tu Bolsa de Pro Shop
                  </h3>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    {totalItemCount} {totalItemCount === 1 ? 'artículo' : 'artículos'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full dark:bg-white/10 bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cart content */}
            <div className="p-4 flex-1 overflow-y-auto">
              {orderPlaced ? (
                <div className="py-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] text-[#10b981] flex items-center justify-center mx-auto mb-3">
                    <PackageCheck size={32} />
                  </div>
                  <h4 className="font-serif text-base font-bold dark:text-white text-stone-900">
                    ¡Pedido Registrado con Éxito!
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                    Los artículos han sido reservados para tu taquilla con el ref.{' '}
                    <strong className="text-[#8c6d2d] dark:text-[#d6b875]">PS-2026-99</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCartItems([])
                      setIsCartOpen(false)
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-[#d6b875] text-[#071b16] font-bold text-xs uppercase cursor-pointer"
                  >
                    Cerrar Bolsa
                  </button>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag size={36} className="mx-auto text-stone-400 mb-2 opacity-50" />
                  <p className="text-xs font-semibold dark:text-white text-stone-800">Tu bolsa está vacía</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Explora el catálogo y añade artículos oficiales.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.product.name}-${item.selectedOption}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl dark:bg-[#071b16] bg-stone-50 border dark:border-white/10 border-stone-200"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-bold dark:text-white text-stone-900 truncate">
                          {item.product.name}
                        </h5>
                        <span className="text-[10px] text-stone-400 block">{item.selectedOption}</span>
                        <span className="font-mono text-xs font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                          {item.product.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(index, -1)}
                          className="w-6 h-6 rounded-md bg-stone-200 dark:bg-white/10 flex items-center justify-center text-xs"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(index, 1)}
                          className="w-6 h-6 rounded-md bg-stone-200 dark:bg-white/10 flex items-center justify-center text-xs"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="ml-1 text-stone-400 hover:text-rose-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {!orderPlaced && cartItems.length > 0 && (
              <div className="p-4 border-t dark:border-white/10 border-stone-200 dark:bg-[#071b16]/70 bg-stone-50 shrink-0">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xs text-stone-500">Total Pedido:</span>
                  <span className="font-serif text-lg font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                    €{totalCartPrice}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderPlaced(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8c6d2d] via-[#d6b875] to-[#8c6d2d] text-[#071b16] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  <PackageCheck size={16} />
                  <span>Tramitar Recogida en Club</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
