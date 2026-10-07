'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserRole } from '@/types'

export const DEMO_USERS: Record<UserRole, User> = {
  admin: {
    id: 'usr-admin-1',
    name: 'Carlos Mendoza',
    email: 'admin@monteverde.golf',
    role: 'admin',
    title: 'Director de Operaciones & Gerencia',
    avatar: '/avatars/admin.jpg',
  },
  starter: {
    id: 'usr-starter-1',
    name: 'Mateo Valenzuela',
    email: 'starter@monteverde.golf',
    role: 'starter',
    title: 'Starter Jefe de Campo - Hoyos 1 y 10',
    avatar: '/avatars/starter.jpg',
  },
  socio: {
    id: 'usr-socio-1',
    name: 'Javier Arango',
    email: 'socio@monteverde.golf',
    role: 'socio',
    title: 'Socio Activo #320',
    handicap: 8.4,
    avatar: '/avatars/socio.jpg',
  },
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  isLoginModalOpen: boolean
  selectedModalRole: UserRole
  openLoginModal: (role?: UserRole) => void
  closeLoginModal: () => void
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>
  loginAsDemo: (role: UserRole) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'monteverde_auth_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [selectedModalRole, setSelectedModalRole] = useState<UserRole>('starter')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Error loading stored user:', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const persistUser = (newUser: User | null) => {
    setUser(newUser)
    try {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Error storing user session:', e)
    }
  }

  const openLoginModal = (role?: UserRole) => {
    if (role) setSelectedModalRole(role)
    setIsLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const loginAsDemo = (role: UserRole) => {
    const demo = DEMO_USERS[role]
    persistUser(demo)
    closeLoginModal()
  }

  const login = async (
    email: string,
    password?: string,
    fallbackRole: UserRole = 'starter'
  ): Promise<{ success: boolean; error?: string }> => {
    const normalized = email.trim().toLowerCase()

    // Match known demo users
    if (normalized.includes('admin')) {
      persistUser(DEMO_USERS.admin)
      closeLoginModal()
      return { success: true }
    }

    if (normalized.includes('starter')) {
      persistUser(DEMO_USERS.starter)
      closeLoginModal()
      return { success: true }
    }

    if (normalized.includes('socio') || normalized.includes('member')) {
      persistUser(DEMO_USERS.socio)
      closeLoginModal()
      return { success: true }
    }

    // Generic login with fallback role
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: normalized,
      role: fallbackRole,
      title: fallbackRole === 'admin' ? 'Administrador' : fallbackRole === 'starter' ? 'Starter de Campo' : 'Socio Golfista',
    }

    persistUser(newUser)
    closeLoginModal()
    return { success: true }
  }

  const logout = () => {
    persistUser(null)
  }

  const switchRole = (role: UserRole) => {
    if (DEMO_USERS[role]) {
      persistUser(DEMO_USERS[role])
    } else if (user) {
      persistUser({
        ...user,
        role,
        title: role === 'admin' ? 'Administrador' : role === 'starter' ? 'Starter de Campo' : 'Socio Golfista',
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isHydrated,
        isLoginModalOpen,
        selectedModalRole,
        openLoginModal,
        closeLoginModal,
        login,
        loginAsDemo,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
