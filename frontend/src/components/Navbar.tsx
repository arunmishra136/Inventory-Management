import { Link } from 'react-router-dom'
import { useRole } from '../contexts/RoleContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const { role, logout } = useRole()
  const { totalItems } = useCart()

  if (!role) return null

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-6">
        <Link to={role === 'user' ? '/products' : '/producer/products'} className="text-lg font-semibold text-gray-900">
          Inventory Manager
        </Link>

        {role === 'user' && (
          <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Products
          </Link>
        )}

        {role === 'producer' && (
          <>
            <Link to="/producer/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link to="/producer/low-stock" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Low Stock
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 uppercase">
          {role}
        </span>

        {role === 'user' && (
          <Link
            to="/cart"
            className="relative flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        <button
          onClick={logout}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
