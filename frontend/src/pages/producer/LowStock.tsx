import { useState } from 'react'
import { useGetLowStockProducts } from '../../api/generated/products/products'
import type { Product } from '../../api/generated/schemas'
import StockAdjuster from '../../components/StockAdjuster'

export default function LowStock() {
  const [stockProduct, setStockProduct] = useState<Product | null>(null)

  const { data: products = [], isLoading } = useGetLowStockProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h1>
        <span className="rounded-full bg-red-100 px-3 py-0.5 text-sm font-semibold text-red-700">
          {products.length}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-lg font-medium text-gray-600">All stocked up!</p>
          <p className="text-sm text-gray-400">No products are below their stock threshold.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 rounded-xl border border-red-100 bg-white p-4 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50">
                {product.image ? (
                  <img src={product.image} alt="" className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.category} &middot; {product.sku}</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">Current</p>
                <p className="text-xl font-bold text-red-600">{product.quantity}</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">Threshold</p>
                <p className="text-xl font-bold text-gray-400">{product.lowStockThreshold}</p>
              </div>

              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{ width: `${Math.min(100, (product.quantity / product.lowStockThreshold) * 100)}%` }}
                />
              </div>

              <button
                onClick={() => setStockProduct(product)}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
              >
                Restock
              </button>
            </div>
          ))}
        </div>
      )}

      {stockProduct && (
        <StockAdjuster product={stockProduct} onClose={() => setStockProduct(null)} />
      )}
    </div>
  )
}
