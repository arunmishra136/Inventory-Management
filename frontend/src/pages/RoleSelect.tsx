import { useNavigate } from 'react-router-dom'
import { useRole } from '../contexts/RoleContext'

export default function RoleSelect() {
  const { setRole } = useRole()
  const navigate = useNavigate()

  const pick = (role: 'user' | 'producer') => {
    setRole(role)
    navigate(role === 'user' ? '/products' : '/producer/products')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Manager</h1>
          <p className="mt-2 text-gray-500">Select your role to continue</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => pick('user')}
            className="flex flex-1 flex-col items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">User</span>
            <span className="text-sm text-gray-500">Browse products & place orders</span>
          </button>

          <button
            onClick={() => pick('producer')}
            className="flex flex-1 flex-col items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">Producer</span>
            <span className="text-sm text-gray-500">Manage inventory & stock</span>
          </button>
        </div>
      </div>
    </div>
  )
}
