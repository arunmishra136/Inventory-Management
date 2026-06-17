import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateStock, getGetProductsQueryKey, getGetLowStockProductsQueryKey } from '../api/generated/products/products'
import type { Product } from '../api/generated/schemas'

interface Props {
  product: Product
  onClose: () => void
}

export default function StockAdjuster({ product, onClose }: Props) {
  const queryClient = useQueryClient()
  const [adjustment, setAdjustment] = useState(0)

  const newQuantity = product.quantity + adjustment

  const mutation = useUpdateStock({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetLowStockProductsQueryKey() })
        onClose()
      },
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Adjust Stock</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600">{product.name}</p>

        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Current Stock</p>
            <p className="text-3xl font-bold text-gray-900">{product.quantity}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdjustment((a) => a - 1)}
              disabled={newQuantity <= 0}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 text-lg font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(+e.target.value)}
              className="w-20 rounded-lg border border-gray-300 text-center text-lg font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => setAdjustment((a) => a + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 text-lg font-bold"
            >
              +
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">New Stock</p>
            <p className={`text-3xl font-bold ${newQuantity < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {newQuantity}
            </p>
          </div>
        </div>

        {newQuantity < 0 && (
          <p className="mt-3 text-center text-sm text-red-600">Stock cannot be negative.</p>
        )}

        {mutation.isError && (
          <p className="mt-3 text-center text-sm text-red-600">
            {(mutation.error as Error).message || 'Failed to update stock.'}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate({ id: product._id, data: { adjustment } })}
            disabled={adjustment === 0 || newQuantity < 0 || mutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {mutation.isPending ? 'Updating...' : 'Update Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
