import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCreateOrder } from '../../api/generated/orders/orders'
import { useCart } from '../../contexts/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const placeOrder = useCreateOrder({
    mutation: {
      onSuccess: () => {
        clearCart()
        setOrderPlaced(true)
      },
    },
  })

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Order Placed!</h2>
        <p className="text-gray-500">Your order has been submitted successfully.</p>
        <Link
          to="/products"
          className="mt-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-900">Cart is empty</h2>
        <Link
          to="/products"
          className="mt-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  const handlePlaceOrder = () => {
    placeOrder.mutate({
      data: {
        items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
      },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <span className="w-20 text-right font-semibold text-gray-900">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => removeItem(item.productId)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

            <div className="mt-4 space-y-2 border-b border-gray-100 pb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            {placeOrder.isError && (
              <p className="mt-3 text-sm text-red-600">
                {(placeOrder.error as Error).message || 'Failed to place order. Please try again.'}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placeOrder.isPending}
              className="mt-4 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
