'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AnalyticsReservas } from '@/components/admin/AnalyticsReservas'
import { AnalyticsProShop } from '@/components/admin/AnalyticsProShop'
import { RESERVATION_ANALYTICS, PRO_SHOP_ANALYTICS } from '@/data/analyticsData'
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Flag,
  Clock,
  Sparkles,
  ShoppingBag,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react'

interface AdminBooking {
  id: string
  clientName: string
  email: string
  phone: string
  date: string
  time: string
  players: number
  cart: boolean
  totalPrice: number
  status: 'confirmada' | 'pendiente' | 'cancelada'
}

interface StaffUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'starter' | 'socio'
  status: 'activo' | 'inactivo'
  department: string
}

const INITIAL_BOOKINGS: AdminBooking[] = [
  {
    id: 'res-101',
    clientName: 'Fernando Ruiz',
    email: 'fruiz@empresa.es',
    phone: '+34 612 345 678',
    date: '2026-09-24',
    time: '07:45',
    players: 3,
    cart: true,
    totalPrice: 320,
    status: 'confirmada',
  },
  {
    id: 'res-102',
    clientName: 'Ricardo Echeverri',
    email: 'recheverri@invest.com',
    phone: '+34 689 123 456',
    date: '2026-09-24',
    time: '08:00',
    players: 4,
    cart: true,
    totalPrice: 415,
    status: 'confirmada',
  },
  {
    id: 'res-103',
    clientName: 'Valeria Moncada',
    email: 'valeria.m@consultoria.com',
    phone: '+34 655 987 654',
    date: '2026-09-24',
    time: '09:30',
    players: 2,
    cart: false,
    totalPrice: 190,
    status: 'pendiente',
  },
  {
    id: 'res-104',
    clientName: 'Alejandro Morales',
    email: 'morales.golf@gmail.com',
    phone: '+34 644 112 233',
    date: '2026-09-24',
    time: '11:00',
    players: 4,
    cart: true,
    totalPrice: 415,
    status: 'confirmada',
  },
  {
    id: 'res-105',
    clientName: 'Diego Salcedo',
    email: 'diego.s@global.com',
    phone: '+34 677 334 455',
    date: '2026-09-24',
    time: '14:30',
    players: 2,
    cart: true,
    totalPrice: 225,
    status: 'cancelada',
  },
]

const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'stf-1',
    name: 'Carlos Mendoza',
    email: 'admin@monteverde.golf',
    role: 'admin',
    status: 'activo',
    department: 'Gerencia General & Operaciones',
  },
  {
    id: 'stf-2',
    name: 'Mateo Valenzuela',
    email: 'starter@monteverde.golf',
    role: 'starter',
    status: 'activo',
    department: 'Operaciones de Campo (Tee 1 y 10)',
  },
  {
    id: 'stf-3',
    name: 'Raúl Montenegro',
    email: 'caddiemaster@monteverde.golf',
    role: 'starter',
    status: 'activo',
    department: 'Caddie Master & Cuarto de Palos',
  },
  {
    id: 'stf-4',
    name: 'Lucía Santillana',
    email: 'proshop@monteverde.golf',
    role: 'admin',
    status: 'activo',
    department: 'Pro Shop & Boutique Monteverde',
  },
]

export function AdminSection() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<
    'analitica_reservas' | 'analitica_proshop' | 'gestion_reservas' | 'personal' | 'campo'
  >('analitica_reservas')

  const [bookings, setBookings] = useState<AdminBooking[]>(INITIAL_BOOKINGS)
  const [staff, setStaff] = useState<StaffUser[]>(INITIAL_STAFF)
  const [searchBooking, setSearchBooking] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmada' | 'pendiente' | 'cancelada'>('all')

  // Course configuration state
  const [courseStatus, setCourseStatus] = useState<'abierto' | 'cart_path' | 'cerrado'>('abierto')
  const [teeInterval, setTeeInterval] = useState('10')
  const [stimpSpeed, setStimpSpeed] = useState('10.5')
  const [greenFee, setGreenFee] = useState('95')
  const [cartFee, setCartFee] = useState('35')
  const [configSaved, setConfigSaved] = useState(false)

  // Booking actions
  const changeBookingStatus = (id: string, newStatus: AdminBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
  }

  const deleteBooking = (id: string) => {
    if (confirm('¿Deseas eliminar permanentemente esta reserva?')) {
      setBookings((prev) => prev.filter((b) => b.id !== id))
    }
  }

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (searchBooking) {
      const q = searchBooking.toLowerCase()
      const matchName = b.clientName.toLowerCase().includes(q)
      const matchEmail = b.email.toLowerCase().includes(q)
      const matchTime = b.time.includes(q)
      if (!matchName && !matchEmail && !matchTime) return false
    }
    return true
  })

  // Consolidated Business Metrics
  const totalClubRevenue = RESERVATION_ANALYTICS.totalRevenue + PRO_SHOP_ANALYTICS.totalRevenue
  const avgRevenuePerPlayer = Math.round(totalClubRevenue / RESERVATION_ANALYTICS.totalPlayers)

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    setConfigSaved(true)
    setTimeout(() => setConfigSaved(false), 3000)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-10 animate-in fade-in duration-300">
      {/* Admin Header Banner */}
      <div className="rounded-2xl border dark:border-[#d6b875]/40 border-amber-300 dark:bg-gradient-to-r dark:from-[#0c2820] dark:via-[#071b16] dark:to-[#0c2820] bg-white p-6 mb-8 relative overflow-hidden shadow-lg dark:shadow-2xl transition-colors duration-200">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d6b875]/15 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider dark:bg-[#d6b875]/20 dark:text-[#d6b875] bg-amber-100 text-amber-900 border dark:border-[#d6b875]/40 border-amber-300">
                <ShieldCheck size={13} />
                Suite de Inteligencia & Dirección
              </span>
              <span className="text-xs dark:text-stone-400 text-stone-500 font-medium">Monteverde Business Suite</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl dark:text-[#efe9d8] text-[#122a22] font-bold">
              Analítica de Negocio & Operaciones
            </h1>
            <p className="text-xs sm:text-sm dark:text-[#aab8af] text-stone-600 mt-1">
              Sesión ejecutiva activa:{' '}
              <strong className="dark:text-[#efe9d8] text-[#122a22]">{user?.name || 'Carlos Mendoza'}</strong> (
              {user?.title || 'Director General'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl dark:bg-white/5 bg-stone-100 border dark:border-white/10 border-stone-200 text-xs dark:text-stone-300 text-stone-700 font-medium">
              Campo: <strong className="text-emerald-600 dark:text-emerald-400 capitalize">{courseStatus.replace('_', ' ')}</strong>
            </span>
          </div>
        </div>

        {/* Global Executive Cross-Analytics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t dark:border-white/10 border-stone-200">
          <div className="p-3.5 rounded-xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Facturación Total Club</span>
              <DollarSign size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            </div>
            <div className="text-2xl font-bold font-mono dark:text-[#efe9d8] text-[#122a22] mt-1">
              €{totalClubRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] dark:text-emerald-400 text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp size={11} /> +16.8% vs período anterior
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Reservas & Salidas</span>
              <Calendar size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            </div>
            <div className="text-2xl font-bold text-[#8c6d2d] dark:text-[#d6b875] mt-1 font-mono">
              €{RESERVATION_ANALYTICS.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] dark:text-stone-400 text-stone-500 mt-0.5">
              {RESERVATION_ANALYTICS.totalBookings} partidas ({RESERVATION_ANALYTICS.totalPlayers} jugadores)
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Ventas Pro Shop</span>
              <ShoppingBag size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              €{PRO_SHOP_ANALYTICS.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] dark:text-emerald-300 text-emerald-700 font-medium mt-0.5">
              {PRO_SHOP_ANALYTICS.totalUnitsSold} unidades vendidas
            </div>
          </div>

          <div className="p-3.5 rounded-xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Gasto Medio / Golfista</span>
              <Sparkles size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            </div>
            <div className="text-2xl font-bold dark:text-[#efe9d8] text-[#122a22] mt-1 font-mono">
              €{avgRevenuePerPlayer}
            </div>
            <div className="text-[10px] dark:text-stone-400 text-stone-500 mt-0.5">Green Fee + Buggy + Pro Shop</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b dark:border-white/10 border-stone-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('analitica_reservas')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analitica_reservas'
              ? 'border-[#8c6d2d] dark:border-[#d6b875] text-[#8c6d2d] dark:text-[#d6b875]'
              : 'border-transparent dark:text-stone-400 text-stone-600 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 size={15} />
          <span>Analítica de Reservas</span>
        </button>

        <button
          onClick={() => setActiveTab('analitica_proshop')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analitica_proshop'
              ? 'border-[#8c6d2d] dark:border-[#d6b875] text-[#8c6d2d] dark:text-[#d6b875]'
              : 'border-transparent dark:text-stone-400 text-stone-600 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag size={15} />
          <span>Analítica Pro Shop</span>
        </button>

        <button
          onClick={() => setActiveTab('gestion_reservas')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'gestion_reservas'
              ? 'border-[#8c6d2d] dark:border-[#d6b875] text-[#8c6d2d] dark:text-[#d6b875]'
              : 'border-transparent dark:text-stone-400 text-stone-600 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Calendar size={15} />
          <span>Gestión de Salidas ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'personal'
              ? 'border-[#8c6d2d] dark:border-[#d6b875] text-[#8c6d2d] dark:text-[#d6b875]'
              : 'border-transparent dark:text-stone-400 text-stone-600 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Users size={15} />
          <span>Personal & Roles ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campo')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'campo'
              ? 'border-[#8c6d2d] dark:border-[#d6b875] text-[#8c6d2d] dark:text-[#d6b875]'
              : 'border-transparent dark:text-stone-400 text-stone-600 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Settings size={15} />
          <span>Configuración Campo</span>
        </button>
      </div>

      {/* TAB 1: ANALÍTICA DE RESERVAS */}
      {activeTab === 'analitica_reservas' && <AnalyticsReservas />}

      {/* TAB 2: ANALÍTICA PRO SHOP */}
      {activeTab === 'analitica_proshop' && <AnalyticsProShop />}

      {/* TAB 3: GESTIÓN DE SALIDAS & RESERVAS */}
      {activeTab === 'gestion_reservas' && (
        <div>
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 dark:bg-[#0c2820] bg-white p-4 rounded-xl border dark:border-white/10 border-stone-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs dark:text-stone-400 text-stone-600 font-semibold">Estado:</span>
              {(['all', 'confirmada', 'pendiente', 'cancelada'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all capitalize ${
                    statusFilter === st
                      ? 'bg-[#d6b875] text-[#071b16] font-bold shadow-sm'
                      : 'dark:bg-white/5 bg-stone-100 dark:text-stone-300 text-stone-700 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' ? 'Todas' : st}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchBooking}
                onChange={(e) => setSearchBooking(e.target.value)}
                placeholder="Buscar por cliente, email o hora..."
                className="w-full pl-9 pr-3 py-2 rounded-lg dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-xs dark:text-[#efe9d8] text-[#122a22] placeholder-stone-400 focus:outline-none focus:border-[#8c6d2d] dark:focus:border-[#d6b875]"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto rounded-2xl border dark:border-white/10 border-stone-200 dark:bg-[#071d17] bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b dark:border-white/10 border-stone-200 dark:bg-[#0c2820] bg-stone-50 dark:text-stone-400 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Hora / Fecha</th>
                  <th className="py-3 px-4">Golfista Principal</th>
                  <th className="py-3 px-4">Jugadores</th>
                  <th className="py-3 px-4">Buggy</th>
                  <th className="py-3 px-4">Monto</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5 divide-stone-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="dark:hover:bg-white/5 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-sm dark:text-[#efe9d8] text-[#122a22]">{b.time}</div>
                      <div className="text-[10px] dark:text-stone-400 text-stone-500">{b.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold dark:text-[#efe9d8] text-[#122a22]">{b.clientName}</div>
                      <div className="text-[10px] dark:text-stone-400 text-stone-500">{b.email}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono dark:text-stone-200 text-stone-700">
                      {b.players} {b.players === 1 ? 'jugador' : 'jugadores'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {b.cart ? (
                        <span className="px-2 py-0.5 rounded dark:bg-emerald-500/10 bg-emerald-100 dark:text-emerald-400 text-emerald-800 dark:border-emerald-500/20 border-emerald-300 border font-semibold">
                          Sí
                        </span>
                      ) : (
                        <span className="dark:text-stone-500 text-stone-400">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                      €{b.totalPrice}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          b.status === 'confirmada'
                            ? 'dark:bg-emerald-500/20 bg-emerald-100 dark:text-emerald-300 text-emerald-800 dark:border-emerald-500/30 border-emerald-300 border'
                            : b.status === 'pendiente'
                            ? 'dark:bg-amber-500/20 bg-amber-100 dark:text-amber-300 text-amber-800 dark:border-amber-500/30 border-amber-300 border'
                            : 'dark:bg-red-500/20 bg-red-100 dark:text-red-300 text-red-800 dark:border-red-500/30 border-red-300 border'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status !== 'confirmada' && (
                          <button
                            onClick={() => changeBookingStatus(b.id, 'confirmada')}
                            title="Confirmar reserva"
                            className="p-1.5 rounded-lg dark:bg-emerald-500/20 bg-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {b.status !== 'cancelada' && (
                          <button
                            onClick={() => changeBookingStatus(b.id, 'cancelada')}
                            title="Cancelar reserva"
                            className="p-1.5 rounded-lg dark:bg-amber-500/20 bg-amber-100 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 transition-colors cursor-pointer"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(b.id)}
                          title="Eliminar registro"
                          className="p-1.5 rounded-lg dark:bg-red-500/10 bg-red-100 hover:bg-red-200 dark:hover:bg-red-500/25 text-red-700 dark:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PERSONAL & ROLES */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-[#0c2820] bg-white p-4 rounded-xl border dark:border-white/10 border-stone-200 shadow-sm">
            <div>
              <h3 className="font-serif text-lg font-bold dark:text-[#efe9d8] text-[#122a22]">
                Equipo de Gestión y Control de Campo
              </h3>
              <p className="text-xs dark:text-stone-400 text-stone-500">
                Personal autorizado con acceso a las terminales del club.
              </p>
            </div>
            <button
              onClick={() => alert('Para añadir un nuevo miembro contacta al departamento de TI')}
              className="px-3.5 py-2 rounded-xl bg-[#d6b875] hover:bg-[#e4c98a] text-[#071b16] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
            >
              <Plus size={14} />
              <span>Añadir Personal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl border dark:border-white/10 border-stone-200 dark:bg-[#071d17] bg-white flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl dark:bg-gradient-to-b dark:from-[#d6b875]/20 dark:to-[#0c2820] bg-amber-100 border dark:border-white/15 border-amber-200 flex items-center justify-center font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm dark:text-[#efe9d8] text-[#122a22]">{member.name}</h4>
                    <p className="text-xs dark:text-stone-400 text-stone-500">{member.email}</p>
                    <span className="text-[10px] dark:text-[#aab8af] text-stone-500 mt-0.5 block font-medium">{member.department}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      member.role === 'admin'
                        ? 'dark:bg-[#d6b875]/20 dark:text-[#d6b875] dark:border-[#d6b875]/30 bg-amber-100 text-amber-900 border border-amber-300'
                        : 'dark:bg-[#10b981]/20 dark:text-[#6ee7b7] dark:border-[#10b981]/30 bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {member.role === 'admin' ? '🛡️ Admin' : '⛳ Starter'}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Activo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CONFIGURACIÓN DEL CAMPO */}
      {activeTab === 'campo' && (
        <form onSubmit={handleSaveConfig} className="space-y-6 max-w-3xl">
          <div className="p-6 rounded-2xl border dark:border-white/10 border-stone-200 dark:bg-[#071d17] bg-white space-y-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold dark:text-[#efe9d8] text-[#122a22] border-b dark:border-white/10 border-stone-200 pb-3">
              Condición y Regulación del Recorrido
            </h3>

            <div>
              <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-2">
                Estado Actual del Campo (Publicado en la Web)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'abierto', label: 'Campo Abierto (Normal)', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-white' },
                  { id: 'cart_path', label: 'Sólo Camino (Lluvia)', color: 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-white' },
                  { id: 'cerrado', label: 'Campo Cerrado', color: 'border-red-500 bg-red-500/10 text-red-900 dark:text-white' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCourseStatus(item.id as any)}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      courseStatus === item.id
                        ? `${item.color} font-bold shadow-xs`
                        : 'dark:border-white/10 border-stone-200 dark:bg-white/5 bg-stone-50 dark:text-stone-400 text-stone-600 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                  Intervalo entre Salidas de Grupos
                </label>
                <select
                  value={teeInterval}
                  onChange={(e) => setTeeInterval(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] focus:outline-none focus:border-[#8c6d2d] dark:focus:border-[#d6b875]"
                >
                  <option value="8">8 minutos (Ritmo rápido)</option>
                  <option value="10">10 minutos (Estándar recomendado)</option>
                  <option value="12">12 minutos (Torneo / Fin de semana)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                  Velocidad de Greens (Stimpmeter)
                </label>
                <input
                  type="text"
                  value={stimpSpeed}
                  onChange={(e) => setStimpSpeed(e.target.value)}
                  placeholder="Ej: 10.5 ft"
                  className="w-full px-3 py-2.5 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] focus:outline-none focus:border-[#8c6d2d] dark:focus:border-[#d6b875]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t dark:border-white/10 border-stone-200 pt-4">
              <div>
                <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                  Tarifa Green Fee (€)
                </label>
                <input
                  type="number"
                  value={greenFee}
                  onChange={(e) => setGreenFee(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] focus:outline-none focus:border-[#8c6d2d] dark:focus:border-[#d6b875]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                  Tarifa Alquiler Buggy (€)
                </label>
                <input
                  type="number"
                  value={cartFee}
                  onChange={(e) => setCartFee(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] focus:outline-none focus:border-[#8c6d2d] dark:focus:border-[#d6b875]"
                />
              </div>
            </div>

            {configSaved && (
              <div className="p-3 rounded-xl dark:bg-emerald-500/20 bg-emerald-50 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle size={15} />
                <span>Configuración del campo actualizada correctamente.</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#d6b875] hover:bg-[#e4c98a] text-[#071b16] font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
