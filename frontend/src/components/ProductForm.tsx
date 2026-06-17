import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateProduct, useUpdateProduct, getGetProductsQueryKey } from '../api/generated/products/products'
import type { Product } from '../api/generated/schemas'

interface Props {
  product: Product | null
  onClose: () => void
}

export default function ProductForm({ product, onClose }: Props) {
  const isEdit = !!product
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    description: product?.description ?? '',
    category: product?.category ?? '',
    image: product?.image ?? '',
    expiryDate: product?.expiryDate ? product.expiryDate.slice(0, 10) : '',
    quantity: product?.quantity ?? 0,
    price: product?.price ?? 0,
    lowStockThreshold: product?.lowStockThreshold ?? 10,
  })

  const onMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() })
    onClose()
  }

  const createMutation = useCreateProduct({
    mutation: { onSuccess: onMutationSuccess },
  })

  const updateMutation = useUpdateProduct({
    mutation: { onSuccess: onMutationSuccess },
  })

  const mutation = isEdit ? updateMutation : createMutation
  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = () => {
    const payload: Record<string, unknown> = { ...form }
    if (!payload.image) delete payload.image
    if (!payload.expiryDate) delete payload.expiryDate
    else payload.expiryDate = new Date(form.expiryDate).toISOString()

    if (isEdit) {
      updateMutation.mutate({ id: product._id, data: payload as never })
    } else {
      createMutation.mutate({ data: payload as never })
    }
  }

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
          className="mt-4 space-y-4"
        >
          <div className="flex gap-4">
            <Field label="Name" required>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            </Field>
            {!isEdit && (
              <Field label="SKU" required>
                <input type="text" value={form.sku} onChange={(e) => update('sku', e.target.value)} required />
              </Field>
            )}
          </div>

          <Field label="Description" required>
            <textarea rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} required />
          </Field>

          <div className="flex gap-4">
            <Field label="Category" required>
              <input type="text" value={form.category} onChange={(e) => update('category', e.target.value)} required />
            </Field>
            <Field label="Image URL">
              <input type="url" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." />
            </Field>
          </div>

          <div className="flex gap-4">
            <Field label="Price" required>
              <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => update('price', +e.target.value)} required />
            </Field>
            {!isEdit && (
              <Field label="Quantity" required>
                <input type="number" min={0} value={form.quantity} onChange={(e) => update('quantity', +e.target.value)} required />
              </Field>
            )}
            <Field label="Low Stock Threshold">
              <input type="number" min={0} value={form.lowStockThreshold} onChange={(e) => update('lowStockThreshold', +e.target.value)} />
            </Field>
          </div>

          <Field label="Expiry Date">
            <input type="date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} />
          </Field>

          {mutation.isError && (
            <p className="text-sm text-red-600">
              {(mutation.error as Error).message || 'Something went wrong.'}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-emerald-400"
            >
              {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      <div className="[&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-gray-300 [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>input]:focus:border-emerald-500 [&>input]:focus:outline-none [&>input]:focus:ring-1 [&>input]:focus:ring-emerald-500 [&>textarea]:w-full [&>textarea]:rounded-lg [&>textarea]:border [&>textarea]:border-gray-300 [&>textarea]:px-3 [&>textarea]:py-2 [&>textarea]:text-sm [&>textarea]:focus:border-emerald-500 [&>textarea]:focus:outline-none [&>textarea]:focus:ring-1 [&>textarea]:focus:ring-emerald-500">
        {children}
      </div>
    </label>
  )
}
