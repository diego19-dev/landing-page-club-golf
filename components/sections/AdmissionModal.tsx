'use client'

import React, { useState } from 'react'
import { X, Check, Crown, Mail, Phone, User, Send, Sparkles } from 'lucide-react'

interface AdmissionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdmissionModal({ isOpen, onClose }: AdmissionModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    handicap: '',
    tipoInteres: 'propietario'
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl dark:bg-[#071b16] bg-[#fbf9f4] border dark:border-[#d6b875]/30 border-stone-300 p-6 sm:p-8 shadow-2xl dark:shadow-black/90 text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full dark:bg-white/5 bg-stone-200 text-stone-500 hover:text-stone-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Check size={28} />
            </div>
            <h3 className="font-serif text-2xl dark:text-[#f5f2e9] text-[#122a22]">
              Solicitud Recibida
            </h3>
            <p className="text-xs sm:text-sm dark:text-[#aab8af] text-stone-600 max-w-sm mx-auto leading-relaxed">
              El Comité de Admisiones de Monteverde Golf Club se pondrá en contacto con usted en un plazo máximo de 48 horas para remitirle el dossier confidencial.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-1.5 mb-2">
                <Crown size={13} />
                Comité de Admisiones
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl dark:text-[#f5f2e9] text-[#122a22] font-light">
                Solicitud de <em className="italic font-normal text-[#8c6d2d] dark:text-[#d6b875]">Membresía.</em>
              </h3>
              <p className="mt-1.5 text-xs dark:text-[#aab8af] text-stone-600 font-light leading-relaxed">
                Complete el formulario para recibir información sobre los requisitos de ingreso, títulos de socio y proceso de avales.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    required
                    type="text"
                    placeholder="Ej. Rodrigo Fernández de Córdoba"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white text-xs dark:text-white text-stone-900 focus:outline-none focus:border-[#d6b875]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      required
                      type="email"
                      placeholder="rodrigo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white text-xs dark:text-white text-stone-900 focus:outline-none focus:border-[#d6b875]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      required
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white text-xs dark:text-white text-stone-900 focus:outline-none focus:border-[#d6b875]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Hándicap Actual (RFEG/WHS)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 9.4 (Opcional)"
                    value={formData.handicap}
                    onChange={(e) => setFormData({ ...formData, handicap: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white text-xs dark:text-white text-stone-900 focus:outline-none focus:border-[#d6b875]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Modalidad Deseada
                  </label>
                  <select
                    value={formData.tipoInteres}
                    onChange={(e) => setFormData({ ...formData, tipoInteres: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white text-xs dark:text-white text-stone-900 focus:outline-none focus:border-[#d6b875]"
                  >
                    <option value="propietario">Socio Propietario (Pleno)</option>
                    <option value="anual">Abonado Anual</option>
                    <option value="junior">Junior & Academia</option>
                    <option value="corporativo">Membresía Corporativa</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] text-[#071b16] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>Solicitar Dossier Confidencial</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-stone-400 dark:text-stone-500">
                Sus datos serán tratados con estricta confidencialidad por el Comité de Admisiones de Monteverde.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
