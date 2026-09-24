'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PRO_SHOP_ANALYTICS } from '@/data/analyticsData'
import {
  ShoppingBag,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Tag,
  ArrowUpRight,
  Sparkles,
  Receipt,
  UserCheck
} from 'lucide-react'

export function AnalyticsProShop() {
  const data = PRO_SHOP_ANALYTICS
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const criticalStockItems = data.topProducts.filter(
    (p) => p.stockStatus === 'critico' || p.stockStatus === 'bajo'
  )

  const filteredProducts = data.topProducts.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c2820] p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#efe9d8] flex items-center gap-2">
            <span>Analítica Comercial Pro Shop & Boutique</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/30">
              VENTAS DEL MES
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Rendimiento del catálogo, rotación de artículos y control de existencias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Margen estimado:</span>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
            {data.estimatedMargin}% Margen Bruto
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17]">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Facturación Pro Shop</span>
            <DollarSign size={16} className="text-[#d6b875]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#efe9d8]">
            €{data.totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1">
            <TrendingUp size={13} />
            <span>+{data.growthPercentage}% vs mes anterior</span>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-stone-400">
            Objetivo mensual: €18,000 (82.7% cumplido)
          </div>
        </div>

        {/* Units Sold */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17]">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Unidades Vendidas</span>
            <Package size={16} className="text-[#d6b875]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#efe9d8]">
            {data.totalUnitsSold} <span className="text-sm font-normal text-stone-400">artículos</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Promedio diario: 10.4 unidades
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-stone-400">
            Categoría líder: Bolas & Guantes
          </div>
        </div>

        {/* Average Ticket */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17]">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Ticket Promedio</span>
            <Receipt size={16} className="text-[#d6b875]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#d6b875]">
            €{data.averageTicket.toFixed(2)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Gasto medio por transacción
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-stone-400">
            Socios: €138.00 · Visitantes: €82.50
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17]">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Alertas de Stock</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {criticalStockItems.length} <span className="text-sm font-normal text-stone-400">artículos</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            1 producto en nivel crítico
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-stone-400">
            Pedido a proveedor sugerido
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner if any */}
      {criticalStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-amber-200">Aviso de Reabastecimiento Urgente:</strong>
            <p className="text-stone-300 mt-0.5">
              Los artículos <strong>Titleist Pro V1 (2 docenas restantes)</strong> y <strong>Driver Apex Pro (4 unidades restantes)</strong> están por debajo del punto de pedido. Se recomienda generar orden de compra para el fin de semana.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Sales by Category & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Category */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#071d17] space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-[#efe9d8]">Ventas por Categoría</h4>
            <p className="text-[11px] text-stone-400">Distribución de ingresos en tienda</p>
          </div>

          <div className="space-y-4 pt-2">
            {data.salesByCategory.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#efe9d8] flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[#d6b875]">€{cat.revenue.toLocaleString()}</span>
                    <span className="text-stone-400">({cat.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
                <div className="text-[10px] text-stone-500 text-right">
                  {cat.units} unidades vendidas
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-stone-400">
            Los palos y material técnico representan el 48.8% de los ingresos totales del Pro Shop.
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/10 bg-[#071d17] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-semibold text-sm text-[#efe9d8]">
                Top Productos Más Vendidos (Ranking)
              </h4>
              <p className="text-[11px] text-stone-400">Rendimiento por producto y control de stock</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['all', 'Palos', 'Ropa', 'Bolas', 'Accesorios'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${filterCategory === cat
                      ? 'bg-[#d6b875] text-[#071b16]'
                      : 'bg-white/5 text-stone-400 hover:text-white'
                    }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-400">
                  <th className="py-2.5 px-3">Producto</th>
                  <th className="py-2.5 px-3">Precio</th>
                  <th className="py-2.5 px-3 text-center">Uds. Vendidas</th>
                  <th className="py-2.5 px-3">Facturado</th>
                  <th className="py-2.5 px-3 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/10">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-[#efe9d8]">{p.name}</div>
                          <span className="text-[10px] text-stone-400">{p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#efe9d8]">
                      €{p.price}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-stone-300">
                      {p.unitsSold}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#d6b875]">
                      €{p.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.stockStatus === 'critico'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : p.stockStatus === 'bajo'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                      >
                        {p.currentStock} uds ({p.stockStatus})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Purchases Feed */}
      <div className="p-5 rounded-2xl border border-white/10 bg-[#071d17]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-sm text-[#efe9d8] flex items-center gap-2">
            <Receipt size={15} className="text-[#d6b875]" />
            <span>Últimos Tickets Emitidos en Caja</span>
          </h4>
          <span className="text-xs text-stone-400">Terminal TPV Pro Shop 1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-xl border border-white/10 bg-[#051410] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                  <span className="font-mono">{tx.id}</span>
                  <span>{tx.date}</span>
                </div>
                <div className="text-xs font-semibold text-[#efe9d8] flex items-center gap-1.5">
                  <span>{tx.customerName}</span>
                  {tx.isMember && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#d6b875]/20 text-[#d6b875]">
                      Socio
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                  {tx.items}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-stone-500">Total cobrado:</span>
                <span className="font-mono font-bold text-sm text-[#d6b875]">
                  €{tx.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
