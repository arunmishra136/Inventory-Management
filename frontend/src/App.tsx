import { Routes, Route, Navigate } from 'react-router-dom'
import { useRole } from './contexts/RoleContext'
import Layout from './components/Layout'
import RoleSelect from './pages/RoleSelect'
import ProductListing from './pages/user/ProductListing'
import Cart from './pages/user/Cart'
import ProductManagement from './pages/producer/ProductManagement'
import LowStock from './pages/producer/LowStock'

function RequireRole({ allowed, children }: { allowed: string; children: React.ReactNode }) {
  const { role } = useRole()
  if (!role) return <Navigate to="/" replace />
  if (role !== allowed) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />

      <Route element={<Layout />}>
        {/* User routes */}
        <Route path="/products" element={<RequireRole allowed="user"><ProductListing /></RequireRole>} />
        <Route path="/cart" element={<RequireRole allowed="user"><Cart /></RequireRole>} />

        {/* Producer routes */}
        <Route path="/producer/products" element={<RequireRole allowed="producer"><ProductManagement /></RequireRole>} />
        <Route path="/producer/low-stock" element={<RequireRole allowed="producer"><LowStock /></RequireRole>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
