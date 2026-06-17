import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface CartItem {
  productId: string
  name: string
  price: number
  image?: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
}

const STORAGE_KEY = 'cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  const persist = useCallback((next: CartItem[]) => {
    setItems(next)
    saveCart(next)
  }, [])

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId)
        const next = existing
          ? prev.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            )
          : [...prev, { ...item, quantity }]
        saveCart(next)
        return next
      })
    },
    [],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) return
      setItems((prev) => {
        const next = prev.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        )
        saveCart(next)
        return next
      })
    },
    [],
  )

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId)
        saveCart(next)
        return next
      })
    },
    [],
  )

  const clearCart = useCallback(() => persist([]), [persist])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
