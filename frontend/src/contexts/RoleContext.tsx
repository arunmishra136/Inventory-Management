import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export type Role = 'user' | 'producer' | null

interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
  logout: () => void
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('role') as Role) ?? null
  })

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole)
    if (newRole) {
      localStorage.setItem('role', newRole)
    } else {
      localStorage.removeItem('role')
    }
  }, [])

  const navigate = useNavigate()

  const logout = useCallback(() => {
    setRole(null)
    navigate('/')
  }, [setRole, navigate])

  return (
    <RoleContext.Provider value={{ role, setRole, logout }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
