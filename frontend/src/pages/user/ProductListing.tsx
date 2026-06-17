import { useState } from 'react'
import { useGetProducts } from '../../api/generated/products/products'
import type { Product } from '../../api/generated/schemas'
import { useCart } from '../../contexts/CartContext'

export default function ProductListing() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const params = {
    ...(search && { search }),
    ...(category && { category }),
  }

  const { data: products = [], isLoading } = useGetProducts(
    Object.keys(params).length > 0 ? params : undefined,
  )

  const categories = [...new Set(products.map((p) => p.category))].sort()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Products</h1>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
        </div>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const outOfStock = product.quantity === 0

  const handleAdd = () => {
    addItem(
      { productId: product._id, name: product.name, price: product.price, image: product.image },
      qty,
    )
    setQty(1)
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex h-40 items-center justify-center rounded-t-xl bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full rounded-t-xl object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <span className="whitespace-nowrap text-lg font-bold text-indigo-600">
            ₹{product.price.toFixed(2)}
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-500">{product.category} &middot; {product.sku}</p>
        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs font-medium ${outOfStock ? 'text-red-600' : 'text-green-600'}`}>
            {outOfStock ? 'Out of stock' : `${product.quantity} in stock`}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={outOfStock}
              className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              -
            </button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
              disabled={outOfStock}
              className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
